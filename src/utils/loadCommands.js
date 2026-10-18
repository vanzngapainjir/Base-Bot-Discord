const fs = require('node:fs');
const path = require('node:path');

async function loadCommands(client, directory) {
    if (!fs.existsSync(directory)) {
        throw new Error(`Commands directory not found: ${directory}`);
    }

    const categories = fs.readdirSync(directory, { withFileTypes: true });

    for (const category of categories) {
        const categoryPath = path.join(directory, category.name);

        if (category.isDirectory()) {
            await loadCommands(client, categoryPath);
            continue;
        }

        if (!category.isFile() || !category.name.endsWith('.js')) {
            continue;
        }

        const command = require(categoryPath);

        if (!command.name || typeof command.execute !== 'function') {
            console.warn(`Skipped invalid command: ${categoryPath}`);
            continue;
        }

        if (client.commands.has(command.name)) {
            throw new Error(`Duplicate command name: ${command.name}`);
        }

        client.commands.set(command.name, command);

        for (const alias of command.aliases || []) {
            if (client.commands.has(alias)) {
                throw new Error(`Duplicate command alias: ${alias}`);
            }

            client.commands.set(alias, command);
        }

        console.log(`Loaded command: ${command.name}`);
    }
}

module.exports = { loadCommands };
