const database = require('../database.js');
const { simpleEmbed } = require('../utils.js')

async function view(interaction) {

    await interaction.deferReply();

    let selectUser = database.prepare('SELECT * FROM users WHERE user_id = ?');
    let selectEmoji = database.prepare('SELECT * FROM cache WHERE emoji_id = ?');

    let user = interaction.options.getUser('user');
    let userId = null;

    userId = (user) ? user.id : interaction.user.id;
    user = (user) ? user : interaction.user;

    let userObject = selectUser.get(userId);

    if (userObject && userObject.emoji_id) {
        const emoji = selectEmoji.get(userObject.emoji_id);

        const tiers = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythical'];
        const tierColors = [0xAAAAAA, 0x0099FF, 0x9933FF, 0xFFD700, 0xFF4500];

        await interaction.editReply({
            embeds: [
                {
                    "title": emoji.emoji_name,
                    "description": `**Tier**: ${tiers[emoji.tier - 1]}\n**Health**: ${emoji.health}\n**Damage**: ${emoji.damage}\n\n*${emoji.bio}*`,
                    "color": tierColors[emoji.tier - 1],
                    "author": {
                        "name": `${user.username}'s`
                    },
                    "image": {
                        "url": `https://cdn.discordapp.com/emojis/${emoji.emoji_id}.${(emoji.animated) ? 'gif' : 'png'}`
                    }
                }
            ]
        });
    } else {
        await interaction.editReply({ embeds: [simpleEmbed('❌ This user does not have an emoji pet.')] });
    }
}

module.exports = view;
