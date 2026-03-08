import 'dotenv/config';
import { Client, Events, GatewayIntentBits, Collection, ApplicationCommandOptionType, MessageFlags } from 'discord.js';
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

    // Log: who ran the command and with what arguments
    const args = {};
    for (const opt of interaction.options.data) {
      if (opt.type === ApplicationCommandOptionType.User) {
        const user = interaction.options.getUser(opt.name);
        args[opt.name] = user ? user.tag : opt.value;
      } else if (opt.value !== undefined) {
        args[opt.name] = opt.value;
      }
    }
    const guild = interaction.guild?.name ?? 'DM';
    const channel = interaction.channel?.name ?? '—';
    console.log(
      `[command] /${interaction.commandName} | by ${interaction.user.tag} (${interaction.user.id}) | ${guild} #${channel} |`,
      Object.keys(args).length ? args : '(no args)'
    );

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      const reply = { content: 'There was an error running this command.', flags: MessageFlags.Ephemeral };
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
