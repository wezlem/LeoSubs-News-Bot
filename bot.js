require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType } = require('discord.js');
const { fetchLatestEpisodes, fetchAnimeInfo } = require('./scraper');
const { loadSeen, saveSeen } = require('./storage');
const { loadStatus, saveStatus } = require('./status');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

async function runCheck() {
  const status = loadStatus();

  let episodes;
  try {
    episodes = await fetchLatestEpisodes();
  } catch (err) {
    status.consecutiveErrors = (status.consecutiveErrors || 0) + 1;
    console.log(`Hata oluştu (${status.consecutiveErrors}. kez):`, err.message);

    if (status.consecutiveErrors === 3 && !status.ownerNotifiedOfError) {
      const owner = await client.users.fetch(process.env.OWNER_ID);
      await owner.send(`⚠️ LeoSubs botu üst üste 3 kez siteye erişemedi. Son hata: ${err.message}`);
      status.ownerNotifiedOfError = true;
    }

    status.lastCheck = new Date().toISOString();
    saveStatus(status);
    return;
  }

  status.scanCount = (status.scanCount || 0) + 1;

  if (status.consecutiveErrors >= 3 && status.ownerNotifiedOfError) {
    const owner = await client.users.fetch(process.env.OWNER_ID);
    await owner.send('✅ LeoSubs botu tekrar düzgün çalışıyor.');
  }

  status.consecutiveErrors = 0;
  status.ownerNotifiedOfError = false;
  status.lastCheck = new Date().toISOString();
  saveStatus(status);;

  const seen = loadSeen();
  const newEpisodes = episodes.filter((ep) => !seen.keys.has(ep.key));

  if (!seen.existedBefore) {
    episodes.forEach((ep) => seen.keys.add(ep.key));
    saveSeen(seen.keys);
    console.log(`İlk çalıştırma: ${episodes.length} bölüm hafızaya alındı, bildirim atılmadı.`);
    return;
  }

  if (newEpisodes.length === 0) {
    console.log(`Site tarandı, yeni bölüm yok. (Tarama #${status.scanCount})`);
    return;
  }

  const channel = await client.channels.fetch(process.env.CHANNEL_ID);

  for (const ep of newEpisodes) {

    const info = await fetchAnimeInfo(ep.slug);

    const seasonText = ep.seasonLabel.replace(/[()]/g, '');

const embed = new EmbedBuilder()
      .setColor(0xe67e22)
      //.setAuthor({
       // name: 'LeoSubs',
       // iconURL: client.user.displayAvatarURL(),
       // url: 'https://leosubs.co',
      //})
      .setTitle(ep.animeTitle)
      .setDescription(
        `**${ep.season}. Sezon ${ep.episode}. Bölüm yayında!** -Kaçırma, hemen izle!<:276933yippeee:1535684901893050399>`
      )
      .setImage((info && info.cover) || ep.thumbnail)
      .setFooter({
        text: 'LeoSubs ⭐ • Yeni bölüm',
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    if (info) {
      if (info.description) {
        embed.addFields({ name: '__Konu__', value: info.description });
      }
      embed.addFields(
        { name: '__Yıl__', value: info.year || 'Bilinmiyor', inline: true },
        { name: '__Puan__', value: info.score ? `⭐ ${info.score}` : 'Bilinmiyor', inline: true },
        { name: '__Kanal__', value: info.studio || 'Bilinmiyor', inline: true }
      );
      if (info.genres.length > 0) {
        embed.addFields({ name: '__Tür__', value: info.genres.join(', ') });
      }
    }

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('Hemen İzle').setStyle(ButtonStyle.Link).setURL(ep.url)
    );

    await channel.send({
  content: process.env.PING_ROLE_ID ? `<@&${process.env.PING_ROLE_ID}>` : undefined,
  embeds: [embed],
  components: [button],
});
    seen.keys.add(ep.key);
  }

  saveSeen(seen.keys);
  console.log(`${newEpisodes.length} yeni bölüm bildirildi.`);
}

client.once('clientReady', () => {
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'ping') return;

  const sent = await interaction.reply({ content: 'Ping hesaplaniyor...', fetchReply: true });
  const gecikme = sent.createdTimestamp - interaction.createdTimestamp;

  await interaction.editReply(`🏓 Pong! Gecikme: **${gecikme}ms** | API: **${Math.round(client.ws.ping)}ms**`);
});
  console.log(`Giriş yapıldı: ${client.user.tag}`);
  client.user.setActivity('leosubs.co', { type: ActivityType.Watching });
  runCheck();
  setInterval(runCheck, 5 * 60 * 1000);
});

client.login(process.env.DISCORD_TOKEN);