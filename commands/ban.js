import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server.')
    .addUserOption(opt => opt.setName('target').setDescription('User to ban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason')),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: 'You need Ban Members permission to use this.', ephemeral: true });
    }
    const target = interaction.options.getUser('target', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(target.id);
    try {
      await interaction.guild.bans.create(target.id, { reason });
      await interaction.reply({ content: `Banned ${target.tag}. Reason: ${reason}` });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: `Failed to ban ${target.tag}.`, ephemeral: true });
    }
  }
};
