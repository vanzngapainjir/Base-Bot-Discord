async function runCommand(command, context) {
    const { client, interaction, message, args } = context;

    try {
        if (interaction) {
            await command.execute({
                client,
                interaction,
                message: null,
                args: []
            });
        } else if (message && typeof command.prefixExecute === 'function') {
            await command.prefixExecute(message, args, client);
        }
    } catch (error) {
        console.error(
            `Command "${command.name}" failed:`,
            error
        );

        if (interaction) {
            const response = {
                content: 'Terjadi kesalahan saat menjalankan command.',
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(response).catch(() => {});
            } else {
                await interaction.reply(response).catch(() => {});
            }
        } else if (message) {
            await message.reply(
                'Terjadi kesalahan saat menjalankan command.'
            ).catch(() => {});
        }
    }
}

module.exports = { runCommand };
