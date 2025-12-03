const { SlashCommandBuilder, REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

const commands = [

    new SlashCommandBuilder()
        .setName('view')
        .setDescription('View a user\'s emoji pet')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User\'s who\'s pet to view, if left blank will default to command user')
                .setRequired(false)
        )
        .toJSON(),

    new SlashCommandBuilder()
        .setName('release')
        .setDescription('Release your current emoji, freeing it for other people to adopt')
        .toJSON(),

    new SlashCommandBuilder()
        .setName('adopt')
        .setDescription('Adopt an emoji as a pet')
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('Emoji to be adopted')
                .setRequired(true)
        )
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(clientId, guildId), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

