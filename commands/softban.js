import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('softban')
    .setDescription('Softban (ban then unban) to purge a user's messages.')
    .addUserOption(opt => opt.setName('target').setDescription('User to softban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason')),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: 'You need Ban Members permission to use this.', ephemeral: true });
    }
    const target = interaction.options.getUser('target', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';
    try {
      await interaction.guild.bans.create(target.id, { deleteMessageSeconds: 5 * 24 * 60 * 60, reason });
      await interaction.guild.bans.remove(target.id);
      await interaction.reply({ content: `Softbanned ${target.tag}. Reason: ${reason}` });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Failed to softban.', ephemeral: true });
    }
  }
};
