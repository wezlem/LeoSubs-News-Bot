const fs = require('fs');
const path = require('path');

const STATUS_PATH = path.join(__dirname, 'status.json');

function loadStatus() {
  if (!fs.existsSync(STATUS_PATH)) {
    return { lastCheck: null, consecutiveErrors: 0, ownerNotifiedOfError: false, scanCount: 0 };
  }

  const raw = fs.readFileSync(STATUS_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveStatus(status) {
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2), 'utf-8');
}

module.exports = { loadStatus, saveStatus };