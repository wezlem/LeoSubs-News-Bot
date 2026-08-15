const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  name: 'voice-baglan',
  async execute(interaction, client) {
    const channelId = process.env.VOICE_CHANNEL_ID;
    const channel = await client.channels.fetch(channelId);

    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    await interaction.reply({ content: `${channel.name} kanalına bağlandım.`, ephemeral: true });
  },
};