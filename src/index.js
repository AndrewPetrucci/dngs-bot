import 'dotenv/config';
import { Client, Events, GatewayIntentBits, Collection } from 'discord.js';
import { loadCommands } from './commands/load-commands.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.commands = new Collection();

async function main() {
  await loadCommands(client);

  client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      const reply = { content: 'There was an error running this command.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply).catch(() => {});
      } else {
        await interaction.reply(reply).catch(() => {});
      }
    }
  });

  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    console.error('Missing DISCORD_TOKEN. Set it in .env or your environment.');
    process.exit(1);
  }
  await client.login(token);
}

main().catch(console.error);
