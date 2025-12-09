const database = require('../database.js');
const { simpleEmbed, emojiValidator, parseEmojiInformation } = require('../utils.js')
const generateEmojiInformation = require('./functions/experimental-fetch.js')
const { getUserInformation, insertUserId, getEmojiInformation } = require('./functions/database-handlers.js')

async function adopt(interaction) {

    await interaction.deferReply();

    const commandUser = interaction.user;
    let user = getUserInformation(commandUser.id);

    // check if the user actually exists, and if not, add them
    if (!user) {
        insertUserId(commandUser.id);
        user = getUserInformation(commandUser.id);
    }

    const emoji = interaction.options.getString('emoji');

    // we can now do this since we grabbed the user data after inserting it

    if (user.emoji_id) {
        return interaction.editReply({ embeds: [simpleEmbed('❌ You already have an adopted emoji, use `/release` to set it free before you can adopt another one.')] });
    }

    // currently doesn't support unicode emojis so this also returns if it's a unicode emoji

    if (!emojiValidator(emoji)) {
        return interaction.editReply({ embeds: [simpleEmbed('❌ Emoji is not valid. At this point only custom server emojis are supported.')] });
    }


    const emojiInformation = parseEmojiInformation(emoji);
    let isAdopted = database.prepare('SELECT * FROM users WHERE emoji_id = ?').get(emojiInformation.id);

    // return early if another user already owns this emoji
    if (isAdopted) {
        return interaction.editReply({ embeds: [simpleEmbed(`❌ User <@${isAdopted.user_id}> has already adopted this emoji.`)] });
    }

    let emojiExists = getEmojiInformation(emojiInformation.id);

    let updateUser = database.prepare(`
                    UPDATE users
                    SET pet_name = ?, emoji_id = ?
                    WHERE user_id = ?
                `);

    if (emojiExists) {
        updateUser.run(emojiInformation.name, emojiInformation.id, commandUser.id);
        return interaction.editReply({ embeds: [simpleEmbed('✅ You\'ve successfully adopted a ' + '`' + emojiInformation.name + '`.')] });
    } else {

        let insertEmoji = database.prepare(`
                        INSERT OR IGNORE INTO cache (
                            emoji_id,
                            emoji_name,
                            tier,
                            health,
                            damage,
                            bio,
                            ability_name,
                            ability_bio,
                            animated
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `);

        const emojiObject = await generateEmojiInformation(emojiInformation.name);

        insertEmoji.run(
            emojiInformation.id,
            emojiInformation.name,
            // hmm should make this favored toward common tiers
            Math.floor(Math.random() * 6) + 1,
            emojiObject.health,
            emojiObject.damage,
            emojiObject.bio,
            emojiObject.abilityName,
            emojiObject.abilityBio,
            emojiInformation.animated ? 1 : 0
        );

        updateUser.run(emojiInformation.name, emojiInformation.id, commandUser.id);

        return interaction.editReply({ embeds: [simpleEmbed('✅ You\'ve successfully adopted a ' + '`' + emojiInformation.name + '`.')] });
    }
}

module.exports = adopt;

