import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete messages (up to 100).')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Number of messages to delete (2-100)').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({ content: 'You need Manage Messages permission to use this.', ephemeral: true });
    }
    const amount = interaction.options.getInteger('amount', true);
    if (amount < 2 || amount > 100) return interaction.reply({ content: 'Amount must be between 2 and 100.', ephemeral: true });
    try {
      const fetched = await interaction.channel.messages.fetch({ limit: amount });
      await interaction.channel.bulkDelete(fetched, true);
      await interaction.reply({ content: `Deleted ${fetched.size} messages.`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Failed to purge messages.', ephemeral: true });
    }
  }
};
