import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits, Collection, Partials } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('Missing DISCORD_TOKEN in environment.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();
const commandsPath = path.join(process.cwd(), 'commands');
for (const file of fs.readdirSync(commandsPath)) {
  if (!file.endsWith('.js')) continue;
  const filePath = path.join(commandsPath, file);
  const cmd = await import('file://' + filePath);
  if (cmd && cmd.default && cmd.default.data) {
    client.commands.set(cmd.default.data.name, cmd.default);
  }
}

client.once('ready', () => {
  console.log(`Bandits ready — logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute(interaction);
  } catch (err) {
    console.error(err);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error running that command.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error running that command.', ephemeral: true });
    }
  }
});

client.login(token);
