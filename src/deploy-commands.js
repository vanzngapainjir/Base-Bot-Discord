require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');

function collectCommands(directory) {
    const commands = [];

    if (!fs.existsSync(directory)) {
        throw new Error(`Commands directory not found: ${directory}`);
    }

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            commands.push(...collectCommands(fullPath));
            continue;
        }

        if (!entry.isFile() || !entry.name.endsWith('.js')) {
            continue;
        }

        const command = require(fullPath);

        if (command.data) {
            commands.push(command.data.toJSON());
        }
    }

    return commands;
}

async function deploy() {
    const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

    if (!DISCORD_TOKEN || !CLIENT_ID) {
        throw new Error('DISCORD_TOKEN and CLIENT_ID are required.');
    }

    const commands = collectCommands(path.join(__dirname, 'commands'));
    const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

    const route = GUILD_ID
        ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
        : Routes.applicationCommands(CLIENT_ID);

    console.log(`Deploying ${commands.length} slash commands...`);

    await rest.put(route, { body: commands });

    console.log(
        GUILD_ID
            ? `Successfully deployed guild commands to ${GUILD_ID}.`
            : 'Successfully deployed global commands.'
    );
}

deploy().catch(error => {
    console.error('Command deployment failed:', error);
    process.exitCode = 1;
});
