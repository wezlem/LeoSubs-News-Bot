require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { fetchLatestEpisodes, fetchAnimeInfo, fetchEpisodeCredits } = require('./scraper');
const { loadSeen, saveSeen } = require('./data/storage');
const { loadStatus, saveStatus } = require('./data/status');
const creditsMap = require('./data/credits.json');

const readyEvent = require('./events/ready');
const interactionCreateEvent = require('./events/interactionCreate');

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
  saveStatus(status);

  const seen = loadSeen();
  const newEpisodes = episodes.filter((ep) => !seen.keys.has(ep.key)).reverse();

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
    const episodeCredits = await fetchEpisodeCredits(ep.url);

    const seasonText = ep.seasonLabel.replace(/[()]/g, '');

    const embed = new EmbedBuilder()
      .setColor(0xe67e22)
      .setTitle(ep.animeTitle)
      .setDescription(
        `**${ep.season}. Sezon ${ep.episode}. Bölüm yayında!** -İyi seyirler dileriz!<:leoemoji:1537035239732543550>`
      )
      .setImage((info && info.cover) || ep.thumbnail)
      .setFooter({
        text: 'LeoSubs ⭐ • Yeni bölüm',
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    if (info) {
      if (episodeCredits?.episodeTitle) {
        embed.addFields({ name: '__Bölüm Adı__', value: `*${episodeCredits.episodeTitle}*` });
      }
      if (info.description) {
        embed.addFields({ name: '__Konu__', value: info.description });
      }
      embed.addFields(
        { name: '__Yıl__', value: info.year || 'Bilinmiyor', inline: true },
        { name: '__Puan__', value: info.score ? `⭐ ${info.score}` : 'Bilinmiyor', inline: true },
        { name: '__Stüdyo__', value: info.studio || 'Bilinmiyor', inline: true }
      );
      if (info.genres.length > 0) {
        embed.addFields({ name: '__Tür__', value: info.genres.join(', ') });
      }

      const creditParts = [];
      if (episodeCredits?.translator) creditParts.push(`Çevirmen: ${resolveCredit(episodeCredits.translator)}`);
      if (episodeCredits?.editor) creditParts.push(`Redaktör: ${resolveCredit(episodeCredits.editor)}`);

      if (creditParts.length > 0) {
        embed.addFields({
          name: '\u200b',
          value: creditParts.join(' & '),
        });
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

function resolveCredit(name) {
  if (!name) return 'Bilinmiyor';

  const key = Object.keys(creditsMap).find(
    (k) => k.toLowerCase().trim() === name.toLowerCase().trim()
  );

  return key ? `<@${creditsMap[key]}>` : name;
}

client.once(readyEvent.name, () => readyEvent.execute(client, runCheck));
client.on(interactionCreateEvent.name, (interaction) => interactionCreateEvent.execute(interaction, client));

client.login(process.env.DISCORD_TOKEN);