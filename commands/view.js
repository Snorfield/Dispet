const { simpleEmbed } = require('../utils.js');
const { getUserInformation, getEmojiInformation } = require('./functions/database-handlers.js');
const drawCard = require('./functions/card');
const { AttachmentBuilder } = require('discord.js');

async function view(interaction) {

    await interaction.deferReply();

    let user = interaction.options.getUser('user');
    let userId = null;

    userId = (user) ? user.id : interaction.user.id;
    user = (user) ? user : interaction.user;

    let userObject = getUserInformation(userId);

    if (userObject && userObject.emoji_id) {
        const emojiInformation = getEmojiInformation(userObject.emoji_id);

        const emoji = {
            owner: user.username,
            id: emojiInformation.emoji_id,
            name: emojiInformation.emoji_name,
            bio: emojiInformation.bio,
            damage: emojiInformation.damage,
            tier: emojiInformation.tier,
            health: emojiInformation.health,
            abilityName: emojiInformation.ability_name,
            abilityBio: emojiInformation.ability_bio,
            animated: emojiInformation.animated
        }

        const image = await drawCard(emoji);

        const attachment = new AttachmentBuilder(image, { name: 'card.png' });

        return interaction.editReply({ files: [attachment] });

    } else {
        return interaction.editReply({ embeds: [simpleEmbed('❌ This user does not have an emoji pet.')] });
    }
}

module.exports = view;
