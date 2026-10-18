require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Collection
} = require('discord.js');

const path = require('node:path');
const { loadCommands } = require('./utils/loadCommands');
const { loadEvents } = require('./utils/loadEvents');

if (!process.env.DISCORD_TOKEN) {
    console.error('DISCORD_TOKEN belum diatur.');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

client.config = {
    prefix: process.env.PREFIX || '.'
};

async function bootstrap() {
    try {
        await loadCommands(
            client,
            path.join(__dirname, 'commands')
        );

        await loadEvents(
            client,
            path.join(__dirname, 'events')
        );

        console.log(`Loaded ${client.commands.size} commands.`);

        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error('Failed to start bot:', error);
        process.exit(1);
    }
}

bootstrap();
