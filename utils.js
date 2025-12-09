const { EmbedBuilder, parseEmoji } = require('discord.js');

/**
 * Takes in a string and returns a Discord.js embed object with the string as the description
 * @param {string} content 
 * @returns {object}
 */

function simpleEmbed(content) {
    let embed = new EmbedBuilder().setDescription(content)
    return embed;
}

/**
 * Takes in a string and returns a boolean identifying if it's a valid emoji
 * @param {string} string 
 */

function emojiValidator(string) {
    const parsed = parseEmoji(string);
    return (parsed.id) ? true : false;
}

/**
 * Return information about an emoji 
 * @param {string} string 
 * @returns {object}
 */

function parseEmojiInformation(string) {
    const parsed = parseEmoji(string);
    return parsed;
}

/**
 * 
 * @param {*} max 
 * @returns {integer}
 */

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = { parseEmojiInformation, emojiValidator, simpleEmbed, getRandomInt };
