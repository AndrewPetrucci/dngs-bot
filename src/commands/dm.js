import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Send a private message to a user.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to message')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('The message to send (optional)')
    ),
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const content =
      interaction.options.getString('message') ||
      `${interaction.user.tag} sent you a message from **${interaction.guild?.name ?? 'the bot'}**.`;

    try {
      await targetUser.send(content);
      await interaction.reply({
        content: `Message sent to **${targetUser.tag}**.`,
        ephemeral: true,
      });
    } catch (err) {
      const cannotDm =
        err.code === 50007 ||
        (err.message && err.message.includes('Cannot send messages to this user'));
      await interaction.reply({
        content: cannotDm
          ? `Could not DM **${targetUser.tag}** — they may have DMs disabled or have blocked the bot.`
          : `Something went wrong: ${err.message}`,
        ephemeral: true,
      });
    }
  },
};
