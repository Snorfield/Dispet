const database = require('../../database');

/**
 * Fetch the user object from the database for a user id and return it
 * @param {string} id 
 * @returns {object}
 */

function getUserInformation(id) {
    return database.prepare('SELECT * FROM users WHERE user_id = ?').get(id);
}

/**
 * Inserts a blank entry into the database under the id
 * @param {string} id 
 */

function insertUserId(id) {
    database.prepare(`INSERT OR IGNORE INTO users (user_id) VALUES (?)`).run(id);
}

/**
 * Select and return the emoji information from the database matching the id
 * @param {string} id 
 * @returns {object}
 */

function getEmojiInformation(id) {
    return database.prepare('SELECT * FROM cache WHERE emoji_id = ?').get(id);
}

module.exports = { getUserInformation, insertUserId, getEmojiInformation }