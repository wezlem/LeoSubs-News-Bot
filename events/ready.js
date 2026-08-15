const { ActivityType } = require('discord.js');

module.exports = {
  name: 'clientReady',
  once: true,
  execute(client, runCheck) {
    console.log(`Giriş yapıldı: ${client.user.tag}`);
    client.user.setActivity('leosubs.co', { type: ActivityType.Watching });
    runCheck();
    setInterval(runCheck, 5 * 60 * 1000);
  },
};