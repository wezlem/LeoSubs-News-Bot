require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { runCheck } = require('./services/notifier');

const readyEvent = require('./events/ready');
const interactionCreateEvent = require('./events/interactionCreate');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(readyEvent.name, () => readyEvent.execute(client, () => runCheck(client)));
client.on(interactionCreateEvent.name, (interaction) => interactionCreateEvent.execute(interaction, client));

client.login(process.env.DISCORD_TOKEN);