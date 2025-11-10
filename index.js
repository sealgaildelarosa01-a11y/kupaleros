const { createClient } = require('bedrock-protocol');
const behaviorManager = require('./behaviors/behaviorManager');

// --- Microsoft (Xbox) Login ---
const bot = createClient({
  host: 'kupaleros-rg1D.aternos.me',  // Your server IP
  port: 40915,                         // Your server port
  username: 'sealgaildelarosa20@gmail.com',    // Microsoft email
  password: 'Codezyy@72443', // Microsoft password
  auth: 'microsoft',                   // Enables Xbox login
  version: '1.21.120'                  // Your Minecraft Bedrock version
});

// --- Events ---
bot.on('spawn', () => {
  console.log('✅ Bot spawned successfully! Starting AI behaviors...');
  behaviorManager(bot);
});

bot.on('text', packet => {
  console.log(`[Server] ${packet.message}`);
});

bot.on('kick', packet => {
  console.log('❌ Kicked from server:', packet.reason);
});

bot.on('error', err => {
  console.log('⚠️ Bot error:', err);
});
