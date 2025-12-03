const database = require('../database.js');
const { simpleEmbed, emojiValidator, getEmojiInformation } = require('../utils.js')
const generateEmojiInformation = require('../fetch.js')

async function adopt(interaction) {

    await interaction.deferReply();

    let selectUser = database.prepare('SELECT * FROM users WHERE user_id = ?');
    const commandUser = interaction.user;
    let user = selectUser.get(commandUser.id);

    if (!user) {
        let insertUser = database.prepare(`INSERT OR IGNORE INTO users (user_id) VALUES (?)`);
        insertUser.run(commandUser.id);
        user = selectUser.get(commandUser.id);
    }

    const emoji = interaction.options.getString('emoji');

    if (user.emoji_id) {

        await interaction.editReply({ embeds: [simpleEmbed('❌ You already have an adopted emoji, use `/release` to set it free before you can adopt another one.')] });
    } else {

        if (!emojiValidator(emoji)) {
            
            await interaction.editReply({ embeds: [simpleEmbed('❌ Emoji is not valid. At this point only custom server emojis are supported.')] });
        } else {

            const emojiInformation = getEmojiInformation(emoji);
            let isAdopted = database.prepare('SELECT * FROM users WHERE emoji_id = ?').get(emojiInformation.id);

            if (isAdopted) {
                 await interaction.editReply({ embeds: [simpleEmbed(`❌ User <@${isAdopted.user_id}> has already adopted this emoji.`)] });
            } else {

                let selectEmoji = database.prepare('SELECT * FROM cache WHERE emoji_id = ?');
                let emojiExists = selectEmoji.get(emojiInformation.id);

                let updateUser = database.prepare(`
                    UPDATE users
                    SET pet_name = ?, emoji_id = ?
                    WHERE user_id = ?
                `);

                if (emojiExists) {
                    updateUser.run(emojiInformation.name, emojiInformation.id, commandUser.id);
                    await interaction.editReply({ embeds: [simpleEmbed('✅ You\'ve successfully adopted a ' + '`' + emojiInformation.name + '`.')] });
                } else {

                    let insertEmoji = database.prepare(`
                        INSERT OR IGNORE INTO cache (
                            emoji_id,
                            emoji_name,
                            tier,
                            health,
                            damage,
                            bio,
                            animated
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)
                    `);

                    const emojiObject = await generateEmojiInformation(emojiInformation.name);

                    insertEmoji.run(
                        emojiInformation.id,
                        emojiInformation.name,
                        Math.floor(Math.random() * 5) + 1,
                        emojiObject.health,
                        emojiObject.damage,
                        emojiObject.bio,
                        emojiInformation.animated ? 1 : 0
                    );

                    updateUser.run(emojiInformation.name, emojiInformation.id, commandUser.id);

                    await interaction.editReply({ embeds: [simpleEmbed('✅ You\'ve successfully adopted a ' + '`' + emojiInformation.name + '`.')] });
                }
            }
        }
    }
}

module.exports = adopt;
