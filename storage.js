const fs = require('fs');
const path = require('path');

const SEEN_PATH = path.join(__dirname, 'seen.json');

function loadSeen() {
  const existedBefore = fs.existsSync(SEEN_PATH);
  if (!existedBefore) {
    return { existedBefore: false, keys: new Set() };
  }

  const raw = fs.readFileSync(SEEN_PATH, 'utf-8');
  const arr = JSON.parse(raw);
  return { existedBefore: true, keys: new Set(arr) };
}

function saveSeen(keysSet) {
  fs.writeFileSync(SEEN_PATH, JSON.stringify([...keysSet], null, 2), 'utf-8');
}

module.exports = { loadSeen, saveSeen };