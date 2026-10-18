const { PermissionFlagsBits } = require('discord.js');

async function moderate(context, action) {
    const { interaction, message, args = [] } = context;
    const guild = interaction ? interaction.guild : message.guild;
    const actor = interaction ? interaction.member : message.member;
    const actorUser = interaction ? interaction.user : message.author;

    if (!guild) {
        const response = { content: 'This command requires a server.' };
        if (interaction) return interaction.reply({ ...response, ephemeral: true });
        return message.reply(response);
    }

    const permissions = {
        kick: PermissionFlagsBits.KickMembers,
        ban: PermissionFlagsBits.BanMembers,
        timeout: PermissionFlagsBits.ModerateMembers
    };

    if (!actor.permissions.has(permissions[action])) {
        const response = {
            content: 'You do not have permission to use this command.'
        };

        if (interaction) return interaction.reply({ ...response, ephemeral: true });
        return message.reply(response);
    }

    let target;
    let minutes;
    let reason;

    if (interaction) {
        target = interaction.options.getUser('user');
        minutes = action === 'timeout'
            ? interaction.options.getInteger('minutes')
            : null;
        reason = interaction.options.getString('reason') || 'No reason provided';
    } else {
        target = message.mentions.users.first();

        const idIndex = args.findIndex(arg => /^\d{17,20}$/.test(arg));

        if (!target && idIndex !== -1) {
            target = await message.client.users.fetch(args[idIndex]).catch(() => null);
        }

        const remaining = [...args];

        if (target) {
            const mentionIndex = remaining.findIndex(arg => arg.includes(target.id));

            if (mentionIndex !== -1) {
                remaining.splice(mentionIndex, 1);
            } else if (idIndex !== -1) {
                remaining.splice(idIndex, 1);
            }
        }

        if (action === 'timeout') {
            minutes = Number(remaining.shift());
        }

        reason = remaining.join(' ') || 'No reason provided';
    }

    if (!target) {
        const response = {
            content: `Provide a valid user. Example: \`${context.client.config.prefix}${action} @user reason\``
        };

        if (interaction) return interaction.reply({ ...response, ephemeral: true });
        return message.reply(response);
    }

    if (target.id === actorUser.id || target.id === context.client.user.id) {
        const response = { content: 'You cannot target yourself or the bot.' };
        if (interaction) return interaction.reply({ ...response, ephemeral: true });
        return message.reply(response);
    }

    if (target.id === guild.ownerId) {
        const response = { content: 'The server owner cannot be targeted.' };
        if (interaction) return interaction.reply({ ...response, ephemeral: true });
        return message.reply(response);
    }

    const targetMember = await guild.members.fetch(target.id).catch(() => null);

    if (!targetMember) {
        const response = { content: 'That user is not a member of this server.' };
        if (interaction) return interaction.reply({ ...response, ephemeral: true });
        return message.reply(response);
    }

    if (
        actor.id !== guild.ownerId &&
        actor.roles.highest.comparePositionTo(targetMember.roles.highest) <= 0
    ) {
        const response = { content: 'The target role must be lower than your highest role.' };
        if (interaction) return interaction.reply({ ...response, ephemeral: true });
        return message.reply(response);
    }

    if (
        action === 'timeout' ? !targetMember.moderatable : !targetMember.manageable
    ) {
        const response = { content: 'The bot role is too low or lacks the required permissions.' };
        if (interaction) return interaction.reply({ ...response, ephemeral: true });
        return message.reply(response);
    }

    if (action === 'timeout' &&
        (!Number.isInteger(minutes) || minutes < 1 || minutes > 40320)) {
        const response = { content: 'Timeout duration must be 1–40320 minutes.' };
        if (interaction) return interaction.reply({ ...response, ephemeral: true });
        return message.reply(response);
    }

    try {
        const auditReason = `${String(reason).slice(0, 400)} | Moderator: ${actorUser.tag}`;

        if (action === 'kick') {
            await targetMember.kick(auditReason);
        } else if (action === 'ban') {
            await guild.members.ban(target.id, { reason: auditReason });
        } else {
            await targetMember.timeout(minutes * 60 * 1000, auditReason);
        }

        const messageText = action === 'timeout'
            ? `✅ ${target.tag} timed out for ${minutes} minute(s).`
            : `✅ ${target.tag} was ${action === 'kick' ? 'kicked' : 'banned'}.`;

        const response = { content: messageText, allowedMentions: { parse: [] } };

        if (interaction) {
            return interaction.reply(response);
        }

        return message.reply(response);
    } catch (error) {
        console.error(`Moderation action "${action}" failed:`, error);

        const response = {
            content: 'Moderation failed. Check bot permissions and role hierarchy.'
        };

        if (interaction) return interaction.reply({ ...response, ephemeral: true });
        return message.reply(response);
    }
}

module.exports = { moderate };
