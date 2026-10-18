const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { moderate } = require('../../utils/moderation');

module.exports = {
    name: 'kick',
    aliases: [],
    description: 'Kick a member from the server',

    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option.setName('user').setDescription('Target member').setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason').setDescription('Reason').setMaxLength(400)
        ),

    async execute(context) {
        return moderate(context, 'kick');
    },

    async prefixExecute(context) {
        return moderate(context, 'kick');
    }
};
