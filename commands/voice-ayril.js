const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  name: 'voice-ayril',
  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      await interaction.reply({ content: 'Zaten bir ses kanalında değilim.', ephemeral: true });
      return;
    }

    connection.destroy();
    await interaction.reply({ content: 'Ses kanalından ayrıldım.', ephemeral: true });
  },
};