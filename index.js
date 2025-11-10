const bedrock = require('bedrock-protocol');
const behaviorManager = require('./behaviors/behaviorManager'); // import AI loop

const bot = bedrock.createClient({
  host: 'kupaleros-rg1D.aternos.me',
  port: 40915,
  username: 'Noxell'
  offline: true,
  version: '1.21.120'
});

bot.on('spawn', () => {
  console.log('Bot spawned!');
  behaviorManager(bot); // start AI loop
});

bot.on('text', (packet) => console.log(`[Server] ${packet.message}`));
bot.on('error', (err) => console.error('Bot error:', err));
bot.on('kick', (packet) => console.log('Kicked from server:', packet.reason));
