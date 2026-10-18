const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setGuildChannel } = require('../../utils/welcomeConfig');

const ALLOWED_ROLE_ID = '1447904770135162950';

module.exports = {
    name: 'setwelcome',

    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Mengatur channel welcome member baru.'),

    async execute({ interaction }) {
        if (!interaction.guild) {
            return interaction.reply({
                content: 'Command ini hanya bisa digunakan di server.',
                ephemeral: true
            });
        }

        const member = await interaction.guild.members
            .fetch(interaction.user.id)
            .catch(() => null);

        if (!member || !member.roles.cache.has(ALLOWED_ROLE_ID)) {
            return interaction.reply({
                content: 'Lu tidak memiliki role yang diizinkan.',
                ephemeral: true
            });
        }

        if (!interaction.channel?.isTextBased()) {
            return interaction.reply({
                content: 'Channel ini tidak mendukung pesan teks.',
                ephemeral: true
            });
        }

        setGuildChannel(
            interaction.guild.id,
            'welcomeChannelId',
            interaction.channel.id
        );

        return interaction.reply({
            content: `✅ Channel welcome berhasil diatur ke ${interaction.channel}.`,
            ephemeral: true
        });
    }
};
