const { runCommand } = require('../utils/commandHandler');

module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command || !command.data) {
            return interaction.reply({
                content: 'Command tidak ditemukan.',
                ephemeral: true
            }).catch(() => {});
        }

        await runCommand(command, {
            client,
            interaction,
            message: null,
            args: []
        });
    }
};
