const { createClient } = require('bedrock-protocol');
const behaviorManager = require('./behaviors/behaviorManager');

const bot = createClient({
  host: 'kupaleros-rg1D.aternos.me',
  port: 40915,
  username: 'Noxell',
  offline: true,
  version: '1.21.120'
});

// Detect gamemode after spawn
bot.on('spawn', () => {
  console.log('Bot spawned! Starting AI behaviors...');
  // default to survival, can change later if server says creative
  bot.gamemode = 0; 
  behaviorManager(bot);
});

bot.on('text', (packet) => console.log(`[Server] ${packet.message}`));
bot.on('error', (err) => console.error('Bot error:', err));
bot.on('kick', (packet) => console.log('Kicked from server:', packet.reason));
