const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { moderate } = require('../../utils/moderation');

module.exports = {
    name: 'timeout',
    aliases: [],
    description: 'Timeout a member',

    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName('user').setDescription('Target member').setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('Duration in minutes (1–40320)')
                .setMinValue(1)
                .setMaxValue(40320)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason').setDescription('Reason').setMaxLength(400)
        ),

    async execute(context) {
        return moderate(context, 'timeout');
    },

    async prefixExecute(context) {
        return moderate(context, 'timeout');
    }
};
