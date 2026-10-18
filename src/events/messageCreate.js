const { runCommand } = require('../utils/commandHandler');

module.exports = {
    name: 'messageCreate',

    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        const prefix = client.config.prefix;

        if (!message.content.startsWith(prefix)) return;

        const input = message.content.slice(prefix.length).trim();

        if (!input) return;

        const parts = input.split(/\s+/);
        const name = parts.shift().toLowerCase();
        const command = client.commands.get(name);

        if (!command || typeof command.prefixExecute !== 'function') return;

        await runCommand(command, {
            client,
            interaction: null,
            message,
            args: parts
        });
    }
};
