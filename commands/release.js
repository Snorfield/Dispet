const database = require('../database.js');
const { simpleEmbed } = require('../utils.js')

async function release(interaction) {

    await interaction.deferReply();

    let selectUser = database.prepare('SELECT * FROM users WHERE user_id = ?');
    let releaseUser = database.prepare('UPDATE users SET emoji_id = NULL, pet_name = NULL WHERE user_id = ?');

    let userObject = selectUser.get(interaction.user.id);

    if (userObject && userObject.emoji_id) {
        releaseUser.run(interaction.user.id);
        await interaction.editReply({ embeds: [simpleEmbed('✅ Your current emoji pet has been released to be on their own! Try using `/adopt` to get a new one.')] });
    } else {
        await interaction.editReply({ embeds: [simpleEmbed('❌ You don\'t have an emoji pet to release! Try using `/adopt` to get one.')] });
    }
}

module.exports = release;
