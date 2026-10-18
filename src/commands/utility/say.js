const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    name: 'say',
    aliases: [],
    description: 'Make the bot send a message',

    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot send a message')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Message to send')
                .setMaxLength(2000)
                .setRequired(true)
        ),

    async execute({ interaction, message, args }) {
        const member = interaction
            ? interaction.member
            : message.member;

        if (!member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            const response = {
                content: 'You need Manage Messages permission.',
                allowedMentions: { parse: [] }
            };

            if (interaction) return interaction.reply({ ...response, ephemeral: true });
            return message.reply(response);
        }

        const text = interaction
            ? interaction.options.getString('text')
            : args.join(' ');

        if (!text.trim()) {
            const response = { content: 'Please provide a message.' };

            if (interaction) return interaction.reply({ ...response, ephemeral: true });
            return message.reply(response);
        }

        const response = {
            content: text.slice(0, 2000),
            allowedMentions: { parse: [] }
        };

        if (interaction) {
            return interaction.reply(response);
        }

        return message.reply(response);
    },

    async prefixExecute(context) {
        return this.execute(context);
    }
};
