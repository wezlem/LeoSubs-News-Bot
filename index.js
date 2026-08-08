const { fetchLatestEpisodes } = require('./scraper');
const { loadSeen, saveSeen } = require('./storage');
const { loadStatus, saveStatus } = require('./status');

async function runCheck() {
  const status = loadStatus();

  let episodes;
  try {
    episodes = await fetchLatestEpisodes();
  } catch (err) {
    status.consecutiveErrors = (status.consecutiveErrors || 0) + 1;
    console.log(`Hata oluştu (${status.consecutiveErrors}. kez):`, err.message);
    status.lastCheck = new Date().toISOString();
    saveStatus(status);
    return;
  }

  status.consecutiveErrors = 0;
  status.lastCheck = new Date().toISOString();
  saveStatus(status);

  const seen = loadSeen();
  const newEpisodes = episodes.filter((ep) => !seen.keys.has(ep.key));

  if (!seen.existedBefore) {
    episodes.forEach((ep) => seen.keys.add(ep.key));
    saveSeen(seen.keys);
    console.log(`İlk çalıştırma: ${episodes.length} bölüm hafızaya alındı, bildirim atılmadı.`);
    return;
  }

  if (newEpisodes.length === 0) {
    console.log('Yeni bölüm yok.');
    return;
  }

  console.log(`${newEpisodes.length} yeni bölüm bulundu:`);
  newEpisodes.forEach((ep) => {
    console.log(`- ${ep.animeTitle} ${ep.episodeLabel} ${ep.seasonLabel} -> ${ep.url}`);
    seen.keys.add(ep.key);
  });

  saveSeen(seen.keys);
}

runCheck();