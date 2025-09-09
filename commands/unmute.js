import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove Muted role from a member.')
    .addUserOption(opt => opt.setName('target').setDescription('User to unmute').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers) &&
        !interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: 'You need Moderate Members or Manage Roles permission to use this.', ephemeral: true });
    }
    const target = interaction.options.getMember('target', true);
    const mutedRole = interaction.guild.roles.cache.find(r => r.name === 'Muted');
    if (!mutedRole) return interaction.reply({ content: 'No Muted role found.', ephemeral: true });
    try {
      await target.roles.remove(mutedRole, `Unmuted by ${interaction.user.tag}`);
      await interaction.reply({ content: `Unmuted ${target.user.tag}.` });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Failed to unmute.', ephemeral: true });
    }
  }
};
