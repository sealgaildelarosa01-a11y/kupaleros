const { createClient } = require('bedrock-protocol');

/* ======================
   CONFIG
   ====================== */
const BASE_CONFIG = {
  host: 'kupaleros-rg1D.aternos.me',
  port: 40915,
  offline: true,
  version: '1.21.120'
};

const BOT_A = { ...BASE_CONFIG, username: 'Noxell' };
const BOT_B = { ...BASE_CONFIG, username: 'Noxell_2' };

const JOIN_TIME = 18 * 60 * 1000;   // 18 minutes
const SWITCH_TIME = 15 * 60 * 1000; // 15 minutes
const RECONNECT_DELAY = 15000;

/* ======================
   STATE
   ====================== */
let activeBot = null;
let activeName = null;
let activeConfig = null;

let walkInterval = null;
let reconnectTimer = null;
let intentionalStop = false;

/* ======================
   CREATE BOT (YOUR ORIGINAL LOGIC)
   ====================== */
function createBot(config, name) {
  console.log(`🚀 Starting ${name}...`);
  activeConfig = config;

  const bot = createClient(config);

  bot.on('spawn', () => {
    console.log(`✅ ${name} spawned! Starting walk loop...`);
    intentionalStop = false;
    startWalkLoop(bot);
  });

  bot.on('text', p => console.log(`[${name}] ${p.message}`));

  const handleDisconnect = (reason) => {
    if (intentionalStop) return;
    if (name !== activeName) return;

    console.log(`🔄 ${name} reconnecting in 15s... Reason:`, reason);

    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(() => {
      activeBot = createBot(activeConfig, activeName);
    }, RECONNECT_DELAY);
  };

  bot.on('kick', p => handleDisconnect(p.reason));
  bot.on('error', e => handleDisconnect(e.message));

  return bot;
}

/* ======================
   STOP BOT
   ====================== */
function stopBot() {
  if (!activeBot) return;

  intentionalStop = true;
  console.log(`👋 ${activeName} leaving server`);

  clearInterval(walkInterval);
  walkInterval = null;

  try {
    activeBot.disconnect();
  } catch {}

  activeBot = null;
  activeName = null;
}

/* ======================
   YOUR ORIGINAL WALK LOOP
   ====================== */
function startWalkLoop(bot) {
  let tick = 0;
  let angle = 0;

  walkInterval = setInterval(() => {
    if (!bot?.entity?.position) return;

    const pos = bot.entity.position;
    const speed = 0.3;

    // Walk in a smooth circle (UNCHANGED)
    angle += Math.PI / 12;
    const newX = pos.x + Math.cos(angle) * speed;
    const newZ = pos.z + Math.sin(angle) * speed;

    const newPos = { x: newX, y: pos.y, z: newZ };

    bot.queue('move_player', {
      runtime_id: bot.entity.runtime_id,
      position: newPos,
      pitch: 0,
      yaw: (angle * 180) / Math.PI,
      head_yaw: (angle * 180) / Math.PI,
      mode: 0,
      on_ground: true,
      riding_runtime_id: 0,
      teleportation_cause: 0,
      teleportation_item: 0
    });

    bot.entity.position = newPos;

    tick++;
    if (tick % 20 === 0) {
      console.log(`[Walk] New pos: x=${newX.toFixed(2)} z=${newZ.toFixed(2)}`);
    }
  }, 500);
}

/* ======================
   ROTATION LOGIC
   ====================== */
function startRotation() {
  // Start BOT A
  activeName = 'BOT_A';
  activeBot = createBot(BOT_A, 'BOT_A');

  // Switch to BOT B after 15 mins
  setTimeout(() => {
    stopBot();
    activeName = 'BOT_B';
    activeBot = createBot(BOT_B, 'BOT_B');
  }, SWITCH_TIME);

  // Continue rotating every 18 mins
  setInterval(() => {
    stopBot();

    if (activeName === 'BOT_A') {
      activeName = 'BOT_B';
      activeBot = createBot(BOT_B, 'BOT_B');
    } else {
      activeName = 'BOT_A';
      activeBot = createBot(BOT_A, 'BOT_A');
    }
  }, JOIN_TIME);
}

/* ======================
   START
   ====================== */
startRotation();
