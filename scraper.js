const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://leosubs.co';

async function fetchLatestEpisodes() {
  const { data: html } = await axios.get(BASE_URL, {
    timeout: 15000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
    },
  });

  const $ = cheerio.load(html);
  const episodes = [];

  $('a.episode-card-home').each((_, el) => {
    const card = $(el);
    const href = card.attr('href') || '';

    const match = href.match(/\/anime\/([^/]+)\/sezon\/(\d+)\/bolum\/(\d+)/);
    if (!match) return;

    const [, slug, season, episode] = match;

    const animeTitle = card.find('.ep-anime-title').text().trim();
    const episodeLabel = card.find('.ep-title-highlight').text().trim();
    const seasonLabel = card.find('.ep-season-label').text().trim();
    const thumbnail = card.find('img.ep-thumb').attr('src') || null;

    episodes.push({
      key: `${slug}:sezon${season}:bolum${episode}`,
      slug,
      season: Number(season),
      episode: Number(episode),
      animeTitle,
      episodeLabel,
      seasonLabel,
      thumbnail,
      url: `${BASE_URL}${href}`,
    });
  });

  return episodes;
}

async function fetchAnimeInfo(slug) {
  try {
    const { data: html } = await axios.get(`${BASE_URL}/anime/${slug}`, {
      timeout: 15000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
      },
    });
    const $ = cheerio.load(html);

    const metaSpans = $('.anime-detail-meta > span:not(.hero-score)');
    const year = metaSpans.eq(0).text().trim();
    const studio = metaSpans.eq(1).text().trim();
    const score = $('.hero-score span').last().text().trim();

    const genres = [];
    $('.anime-genre-pill').each((_, el) => genres.push($(el).text().trim()));

    return {
      cover: $('.anime-detail-cover').attr('src') || null,
      year,
      studio,
      score,
      genres,
      description: $('.anime-description').text().trim(),
    };
  } catch {
    return null;
  }
}

module.exports = { fetchLatestEpisodes, fetchAnimeInfo, BASE_URL };