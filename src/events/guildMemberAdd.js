const { EmbedBuilder } = require('discord.js');
const { getGuildConfig } = require('../utils/welcomeConfig');

module.exports = {
    name: 'guildMemberAdd',

    async execute(member) {
        const config = getGuildConfig(member.guild.id);
        if (!config.welcomeChannelId) return;

        const channel = await member.guild.channels
            .fetch(config.welcomeChannelId)
            .catch(() => null);

        if (!channel?.isTextBased()) return;

        const avatar = member.user.displayAvatarURL({
            extension: 'png',
            size: 256
        });

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setAuthor({
                name: 'MEMBER BARU TERDETEKSI 👋'
            })
            .setTitle(`WELCOME TO ${member.guild.name.toUpperCase()}`)
            .setThumbnail(avatar)
            .setDescription(
                `Halo ${member}! Selamat datang di **${member.guild.name}**!\n\n` +
                'Senang melihat lu bergabung bersama kami. ✨\n' +
                'Silakan baca peraturan server dan kenalan dengan member lainnya.'
            )
            .addFields(
                {
                    name: '👤 Username',
                    value: `${member.user.tag}`,
                    inline: true
                },
                {
                    name: '🆔 Member ke-',
                    value: `${member.guild.memberCount}`,
                    inline: true
                }
            )
            .setFooter({
                text: `Selamat bergabung • ${member.guild.name}`
            })
            .setTimestamp();

        await channel.send({
            content: `Selamat datang ${member}!`,
            embeds: [embed],
            allowedMentions: {
                users: [member.id]
            }
        }).catch(error => {
            console.error('Gagal mengirim welcome:', error);
        });
    }
};
