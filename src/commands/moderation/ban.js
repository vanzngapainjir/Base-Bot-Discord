const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { moderate } = require('../../utils/moderation');

module.exports = {
    name: 'ban',
    aliases: [],
    description: 'Ban a member from the server',

    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName('user').setDescription('Target member').setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason').setDescription('Reason').setMaxLength(400)
        ),

    async execute(context) {
        return moderate(context, 'ban');
    },

    async prefixExecute(context) {
        return moderate(context, 'ban');
    }
};
