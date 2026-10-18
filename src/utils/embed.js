const { EmbedBuilder } = require('discord.js');

function createEmbed(title, description) {
    return new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();
}

module.exports = { createEmbed };
