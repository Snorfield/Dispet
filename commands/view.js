const { simpleEmbed } = require('../utils.js');
const { getUserInformation, getEmojiInformation } = require('./functions/database-handlers.js');
const drawCard = require('./functions/card');
const { AttachmentBuilder } = require('discord.js');

async function view(interaction) {
    let isUserAuthor = true;
    let user = interaction.user;

    const ranFromButton = interaction.isButton();
    if (!ranFromButton) {
        isUserAuthor = true;
        user = interaction.options.getUser('user');
    }

    const userId = user.id;

    let userObject = getUserInformation(userId);
    if (userObject && userObject.emoji_id) {
        await interaction.deferReply();

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
    }

    return interaction.reply({
        embeds: [simpleEmbed(
            isUserAuthor ? "❌ You don't have an emoji pet! Try using `/adopt` to get one." : '❌ This user does not have an emoji pet.'
        )]
    });
}

module.exports = view;
