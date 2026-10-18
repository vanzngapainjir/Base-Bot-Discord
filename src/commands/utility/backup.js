const {
    SlashCommandBuilder,
    AttachmentBuilder,
    MessageFlags
} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const archiver = require('archiver');

const BACKUP_OWNER_ID = '1418860365998985296';
const PROJECT_DIR = path.resolve(__dirname, '../../..');

function getJakartaDate() {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    }).formatToParts(new Date());

    const date = {};

    for (const part of parts) {
        if (part.type !== 'literal') {
            date[part.type] = part.value;
        }
    }

    return {
        day: date.day,
        month: date.month,
        year: date.year,
        display: `${date.day}/${date.month}/${date.year}`,
        file: `${date.day}-${date.month}-${date.year}`
    };
}

function createBackup(backupPath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(backupPath);

        const archive = archiver('zip', {
            zlib: {
                level: 5
            }
        });

        let settled = false;

        function fail(error) {
            if (settled) return;
            settled = true;
            reject(error);
        }

        output.on('close', () => {
            if (settled) return;
            settled = true;
            resolve(archive.pointer());
        });

        output.on('error', fail);

        archive.on('warning', error => {
            if (error.code === 'ENOENT') {
                console.warn('BACKUP WARNING:', error.message);
            } else {
                fail(error);
            }
        });

        archive.on('error', fail);

        archive.pipe(output);

        archive.glob('**/*', {
            cwd: PROJECT_DIR,
            dot: true,
            ignore: [
                'node_modules/**',
                '.git/**',
                '.npm/**',
                'sessions/**',
                'session/**',
                'tmp/**',
                'temp/**',
                'jadibot/**',
                'backup/**',
                'backups/**',
                '*.zip',
                '**/*.zip',
                '*.log',
                '**/*.log'
            ]
        });

        archive.finalize().catch(fail);
    });
}

module.exports = {
    name: 'backup',

    data: new SlashCommandBuilder()
        .setName('backup')
        .setDescription('Backup full source code BEAR BOT.'),

    async execute({ interaction, client }) {
        if (interaction.user.id !== BACKUP_OWNER_ID) {
            return interaction.reply({
                content: '❌ Lu tidak memiliki akses ke command ini.',
                flags: MessageFlags.Ephemeral
            });
        }

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        let backupPath = null;

        try {
            const date = getJakartaDate();
            const backupName = `BEAR BOT ${date.file}.zip`;

            backupPath = path.join(
                os.tmpdir(),
                `bear-backup-${Date.now()}.zip`
            );

            await interaction.editReply(
                '⏳ **BACKUP SYSTEM**\n\n' +
                'Sedang mengompresi source code BEAR BOT...'
            );

            const size = await createBackup(backupPath);

            if (!size || !fs.existsSync(backupPath)) {
                throw new Error('File backup kosong atau gagal dibuat.');
            }

            const stats = fs.statSync(backupPath);
            const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

            const owner = await client.users.fetch(BACKUP_OWNER_ID);

            const attachment = new AttachmentBuilder(backupPath, {
                name: backupName
            });

            await owner.send({
                content:
                    '🔐 **BEAR BOT BACKUP**\n\n' +
                    `📦 **File:** \`BEAR BOT ${date.display}.zip\`\n` +
                    `💾 **Ukuran:** ${sizeMB} MB\n` +
                    `📅 **Tanggal:** ${date.display}\n` +
                    '🔒 Backup dikirim khusus ke owner.',
                files: [attachment]
            });

            await interaction.editReply(
                '✅ **BACKUP BERHASIL**\n\n' +
                `📦 Nama: \`BEAR BOT ${date.display}.zip\`\n` +
                `💾 Ukuran: ${sizeMB} MB\n` +
                '📨 File sudah dikirim ke DM owner.'
            );
        } catch (error) {
            console.error('BACKUP ERROR:', error);

            await interaction.editReply(
                '❌ **BACKUP GAGAL**\n\n' +
                `Error: \`${error.message}\``
            ).catch(() => {});
        } finally {
            if (backupPath && fs.existsSync(backupPath)) {
                fs.unlinkSync(backupPath);
            }
        }
    }
};
