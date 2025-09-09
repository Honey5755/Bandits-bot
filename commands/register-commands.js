import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { REST, Routes } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // optional, for dev

if (!token || !clientId) {
  console.error('DISCORD_TOKEN and CLIENT_ID required in env.');
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(process.cwd(), 'commands');
for (const file of fs.readdirSync(commandsPath)) {
  if (!file.endsWith('.js')) continue;
  const filePath = path.join(commandsPath, file);
  const cmd = await import('file://' + filePath);
  if (cmd && cmd.default && cmd.default.data) {
    commands.push(cmd.default.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    if (guildId) {
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );
      console.log('Successfully reloaded guild commands.');
    } else {
      const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );
      console.log('Successfully reloaded global commands.');
    }
  } catch (error) {
    console.error(error);
  }
})();
