const { EmbedBuilder } = require('discord.js');
const { getGuildConfig } = require('../utils/welcomeConfig');

module.exports = {
    name: 'guildMemberRemove',

    async execute(member) {
        const config = getGuildConfig(member.guild.id);
        if (!config.byeChannelId) return;

        const channel = await member.guild.channels
            .fetch(config.byeChannelId)
            .catch(() => null);

        if (!channel?.isTextBased()) return;

        const avatar = member.user.displayAvatarURL({
            extension: 'png',
            size: 256
        });

        const embed = new EmbedBuilder()
            .setColor(0xED4245)
            .setAuthor({
                name: 'MEMBER TELAH KELUAR 👋'
            })
            .setTitle('GOODBYE, MEMBER!')
            .setThumbnail(avatar)
            .setDescription(
                `**${member.user.tag}** telah meninggalkan **${member.guild.name}**.\n\n` +
                'Terima kasih sudah menjadi bagian dari komunitas kami. ' +
                'Semoga sukses di mana pun lu berada. ❤️'
            )
            .addFields({
                name: '👥 Sisa Member',
                value: `${member.guild.memberCount}`,
                inline: true
            })
            .setFooter({
                text: `Sampai jumpa lagi • ${member.guild.name}`
            })
            .setTimestamp();

        await channel.send({
            embeds: [embed]
        }).catch(error => {
            console.error('Gagal mengirim bye:', error);
        });
    }
};
