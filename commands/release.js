const database = require('../database.js');
const { simpleEmbed } = require('../utils.js')
const { getUserInformation } = require('./functions/database-handlers.js')

async function release(interaction) {

    await interaction.deferReply();

    let releaseUser = database.prepare('UPDATE users SET emoji_id = NULL, pet_name = NULL WHERE user_id = ?');

    let userObject = getUserInformation(interaction.user.id);

    if (userObject && userObject.emoji_id) {
        releaseUser.run(interaction.user.id);
        return interaction.editReply({ embeds: [simpleEmbed('✅ Your current emoji pet has been released to be on their own! Try using `/adopt` to get a new one.')] });
    } else {
        return interaction.editReply({ embeds: [simpleEmbed('❌ You don\'t have an emoji pet to release! Try using `/adopt` to get one.')] });
    }
}

module.exports = release;
