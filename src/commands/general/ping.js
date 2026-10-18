const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embed');

module.exports = {
    name: 'ping',
    aliases: ['p'],
    description: 'Check bot latency',

    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency'),

    async execute({ client, interaction, message }) {
        const embed = createEmbed(
            '🏓 Pong!',
            `WebSocket: **${client.ws.ping}ms**`
        );

        if (interaction) {
            return interaction.reply({ embeds: [embed] });
        }

        return message.reply({ embeds: [embed] });
    },

    async prefixExecute(context) {
        return this.execute(context);
    }
};
