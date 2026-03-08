import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { loadCommands } from './commands/load-commands.js';

async function deploy() {
  const client = { commands: new Map() };
  const commands = await loadCommands(client);
  const body = commands.map((c) => c.data.toJSON());

  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!token || !clientId) {
    console.error('Set DISCORD_TOKEN and DISCORD_CLIENT_ID in .env');
    process.exit(1);
  }

  const rest = new REST().setToken(token);

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body });
    console.log(`Registered ${body.length} command(s) for guild ${guildId}`);
  } else {
    await rest.put(Routes.applicationCommands(clientId), { body });
    console.log(`Registered ${body.length} command(s) globally`);
  }
}

deploy().catch(console.error);
