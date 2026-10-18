const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embed');

module.exports = {
    name: 'help',
    aliases: ['h', 'commands'],
    description: 'Display available commands',

    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display available commands'),

    async execute({ client, interaction, message }) {
        const unique = [...new Set(client.commands.values())];

        const lines = unique
            .filter(command => command.data)
            .map(command => {
                const aliases = command.aliases?.length
                    ? ` (aliases: ${command.aliases.map(a => `\`${a}\``).join(', ')})`
                    : '';

                return `\`/${command.name}\` — ${command.description || 'No description'}${aliases}`;
            });

        const embed = createEmbed(
            '📚 Command List',
            `Prefix: \`${client.config.prefix}\`\n\n${lines.join('\n')}`
        );

        if (interaction) {
            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        return message.reply({ embeds: [embed] });
    },

    async prefixExecute(context) {
        return this.execute(context);
    }
};
