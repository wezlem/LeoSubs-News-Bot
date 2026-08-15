module.exports = {
  name: 'ping',
  async execute(interaction, client) {
    const sent = await interaction.reply({ content: 'Ping hesaplaniyor...' });
    const sentReply = await interaction.fetchReply();
    const gecikme = sentReply.createdTimestamp - interaction.createdTimestamp;

    await interaction.editReply(`🏓 Pong! Gecikme: **${gecikme}ms** | API: **${Math.round(client.ws.ping)}ms**`);
  },
};