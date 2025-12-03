const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
const commands = require('./commands.js');
const database = require('./database.js');
const { simpleEmbed } = require('./utils.js');

const activities = [
	":3",
	":>",
	":]"
];

const map = {
	adopt: commands.adopt,
	view: commands.view,
	release: commands.release
}

const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isCommand()) return;
	const { commandName } = interaction;

	if (map[commandName]) {
		map[commandName](interaction);
	} else {
		await interaction.editReply({ embeds: [simpleEmbed('Command file not found.')] });
	}

});

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready on ${readyClient.user.tag}`);
	client.user.setPresence({
		activities: [{ name: activities[Math.floor(Math.random() * activities.length)], type: 4 }],
		status: 'online',
	});
});

client.login(token);
