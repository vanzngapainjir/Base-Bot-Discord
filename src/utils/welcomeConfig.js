const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'welcomeConfig.json');

function readConfig() {
    try {
        if (!fs.existsSync(configPath)) {
            fs.writeFileSync(configPath, '{}');
        }

        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
        console.error('Gagal membaca konfigurasi welcome:', error);
        return {};
    }
}

function getGuildConfig(guildId) {
    const config = readConfig();
    return config[guildId] || {};
}

function setGuildChannel(guildId, key, channelId) {
    const config = readConfig();

    if (!config[guildId]) {
        config[guildId] = {};
    }

    config[guildId][key] = channelId;

    fs.writeFileSync(
        configPath,
        JSON.stringify(config, null, 2)
    );
}

module.exports = {
    getGuildConfig,
    setGuildChannel
};
