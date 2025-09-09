import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server.')
    .addUserOption(opt => opt.setName('target').setDescription('User to kick').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason')),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({ content: 'You need Kick Members permission to use this.', ephemeral: true });
    }
    const target = interaction.options.getMember('target', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';
    try {
      await target.kick(reason);
      await interaction.reply({ content: `Kicked ${target.user.tag}. Reason: ${reason}` });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: `Failed to kick.`, ephemeral: true });
    }
  }
};
