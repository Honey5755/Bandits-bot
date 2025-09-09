import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a member by assigning a Muted role.')
    .addUserOption(opt => opt.setName('target').setDescription('User to mute').setRequired(true))
    .addIntegerOption(opt => opt.setName('minutes').setDescription('Duration in minutes').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason')),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers) &&
        !interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: 'You need Moderate Members or Manage Roles permission to use this.', ephemeral: true });
    }

    const target = interaction.options.getMember('target', true);
    const minutes = interaction.options.getInteger('minutes', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';

    let mutedRole = interaction.guild.roles.cache.find(r => r.name === 'Muted');
    if (!mutedRole) {
      try {
        mutedRole = await interaction.guild.roles.create({ name: 'Muted', reason: 'Auto-create Muted role' });
        // Deny SEND_MESSAGES in text channels for this role
        for (const [, channel] of interaction.guild.channels.cache) {
          await channel.permissionOverwrites.edit(mutedRole, {
            SendMessages: false,
            AddReactions: false,
            Speak: false
          }).catch(() => {});
        }
      } catch (err) {
        console.error('Failed to create Muted role:', err);
      }
    }

    try {
      await target.roles.add(mutedRole, `Muted by ${interaction.user.tag} — ${reason}`);
      await interaction.reply({ content: `Muted ${target.user.tag} for ${minutes} minute(s). Reason: ${reason}` });
      // automatic unmute using Timeout if bot stays online (not persistent)
      setTimeout(async () => {
        try {
          await target.roles.remove(mutedRole, 'Auto unmute after duration');
        } catch (e) {
          console.error('Failed auto-unmute:', e);
        }
      }, minutes * 60 * 1000);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Failed to mute.', ephemeral: true });
    }
  }
};
