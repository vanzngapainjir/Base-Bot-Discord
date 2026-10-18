const fs = require('node:fs');
const path = require('node:path');

async function loadEvents(client, directory) {
    if (!fs.existsSync(directory)) {
        throw new Error(`Events directory not found: ${directory}`);
    }

    const files = fs.readdirSync(directory, { withFileTypes: true });

    for (const file of files) {
        const filePath = path.join(directory, file.name);

        if (file.isDirectory()) {
            await loadEvents(client, filePath);
            continue;
        }

        if (!file.isFile() || !file.name.endsWith('.js')) {
            continue;
        }

        const event = require(filePath);

        if (!event.name || typeof event.execute !== 'function') {
            console.warn(`Skipped invalid event: ${filePath}`);
            continue;
        }

        const handler = (...args) => event.execute(...args, client);

        if (event.once) {
            client.once(event.name, handler);
        } else {
            client.on(event.name, handler);
        }

        console.log(`Loaded event: ${event.name}`);
    }
}

module.exports = { loadEvents };
