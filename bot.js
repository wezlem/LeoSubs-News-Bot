require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { fetchLatestEpisodes, fetchAnimeInfo, fetchEpisodeCredits } = require('./scraper');
const { loadSeen, saveSeen } = require('./data/storage');
const { loadStatus, saveStatus } = require('./data/status');
const creditsMap = require('./data/credits.json');

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
      //.setAuthor({
       // name: 'LeoSubs',
       // iconURL: client.user.displayAvatarURL(),
       // url: 'https://leosubs.co',
      //})
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

client.once('clientReady', () => {
client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand() && interaction.commandName === 'ping') {
    const sent = await interaction.reply({ content: 'Ping hesaplaniyor...' });
    const sentReply = await interaction.fetchReply();
    const gecikme = sentReply.createdTimestamp - interaction.createdTimestamp;

    await interaction.editReply(`🏓 Pong! Gecikme: **${gecikme}ms** | API: **${Math.round(client.ws.ping)}ms**`);
    return;
  }

  if (interaction.isChatInputCommand() && interaction.commandName === 'embed-olustur') {
    const secilenRol = interaction.options.getRole('rol');

    const modal = new ModalBuilder()
      .setCustomId(`embedModal_${secilenRol ? secilenRol.id : 'none'}`)
      .setTitle('Embed Oluştur');

    const baslikInput = new TextInputBuilder()
      .setCustomId('baslik')
      .setLabel('Başlık')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const aciklamaInput = new TextInputBuilder()
      .setCustomId('aciklama')
      .setLabel('Açıklama')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const renkInput = new TextInputBuilder()
      .setCustomId('renk')
      .setLabel('Renk (hex kod, örn: FF0000)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const resimInput = new TextInputBuilder()
      .setCustomId('resim')
      .setLabel('Resim linki')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const footerInput = new TextInputBuilder()
      .setCustomId('footer')
      .setLabel('Footer metni')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(baslikInput),
      new ActionRowBuilder().addComponents(aciklamaInput),
      new ActionRowBuilder().addComponents(renkInput),
      new ActionRowBuilder().addComponents(resimInput),
      new ActionRowBuilder().addComponents(footerInput),
    );

    await interaction.showModal(modal);
    return;
  }

  if (interaction.isModalSubmit() && interaction.customId.startsWith('embedModal_')) {
  const rolId = interaction.customId.split('_')[1];
  const rolMetni = rolId !== 'none' ? (rolId === interaction.guild.id ? '@everyone ' : `<@&${rolId}> `) : '';
  const baslik = interaction.fields.getTextInputValue('baslik');
  const aciklama = interaction.fields.getTextInputValue('aciklama');
  const renk = interaction.fields.getTextInputValue('renk');
  const resim = interaction.fields.getTextInputValue('resim');
  const footer = interaction.fields.getTextInputValue('footer');

  const embed = new EmbedBuilder()
    .setTitle(baslik)
    .setDescription(aciklama);

  if (renk) embed.setColor(`#${renk.replace('#', '')}`);
  if (resim) embed.setImage(resim);
  if (footer) embed.setFooter({ text: footer });
  embed.setTimestamp();

  await interaction.channel.send({ content: rolMetni || undefined, embeds: [embed] });
  await interaction.reply({ content: 'Embed gönderildi!', ephemeral: true });
}

});
  console.log(`Giriş yapıldı: ${client.user.tag}`);
  client.user.setActivity('leosubs.co', { type: ActivityType.Watching });
  runCheck();
  setInterval(runCheck, 5 * 60 * 1000);
});

client.login(process.env.DISCORD_TOKEN);