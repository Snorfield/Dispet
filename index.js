const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const commands = require("./commands.js");
const { simpleEmbed } = require("./utils.js");

const activities = [":3", ":>", ":]"];

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === 'view_emoji') {
            return commands['view'](interaction);
        }
    }

    if (!interaction.isCommand()) return;
    const { commandName } = interaction;

    if (commands[commandName]) {
        commands[commandName](interaction);
    } else {
        await interaction.editReply({
            embeds: [simpleEmbed("Command file not found.")],
        });
    }
});

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready on ${readyClient.user.tag}`);
    client.user.setPresence({
        activities: [
            {
                name: activities[Math.floor(Math.random() * activities.length)],
                type: 4,
            },
        ],
        status: "online",
    });
});

client.login(token);
