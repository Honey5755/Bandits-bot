import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('hackban')
    .setDescription('Ban a user by ID even if they are not in the guild.')
    .addStringOption(opt => opt.setName('userid').setDescription('User ID to ban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason')),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: 'You need Ban Members permission to use this.', ephemeral: true });
    }
    const userId = interaction.options.getString('userid', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';
    try {
      await interaction.guild.bans.create(userId, { reason });
      await interaction.reply({ content: `Banned user ID ${userId}.` });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: `Failed to ban ID ${userId}.`, ephemeral: true });
    }
  }
};
