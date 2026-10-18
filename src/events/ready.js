module.exports = {
    name: 'ready',
    once: true,

    execute(client) {
        console.log('================================');
        console.log(`Bot: ${client.user.tag}`);
        console.log(`ID: ${client.user.id}`);
        console.log(`Prefix: ${client.config.prefix}`);
        console.log(`Servers: ${client.guilds.cache.size}`);
        console.log('Status: Online');
        console.log('================================');

        client.user.setPresence({
            activities: [{ name: 'slash & prefix commands' }],
            status: 'online'
        });
    }
};
