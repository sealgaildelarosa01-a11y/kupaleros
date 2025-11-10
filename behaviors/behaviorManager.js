// behaviors/behaviorManager.js
const walkLoop = require('./walkLoop');
const {
  handleNightSafety,
  handleLostSafety,
  handleHunger,
  handleMobAvoidance,
  respawnIfDead,
  handlePathing
} = require('./handlers');

module.exports = function behaviorManager(bot) {
  let activeBehavior = null;

  function switchBehavior(name, fn) {
    if (activeBehavior !== name) {
      activeBehavior = name;
      console.log(`[Behavior] Switched to: ${name}`);
    }
    try { fn(bot); } catch (e) { console.log('Behavior error:', e.message); }
  }

  // Change pathing direction randomly every 5 seconds
  setInterval(() => {
    if (activeBehavior === 'pathing') bot.pathYaw = Math.random() * 360;
  }, 5000);

  // Main AI loop (~20 ticks per second)
  setInterval(() => {
    if (!bot?.entity) return;

    // 1️⃣ Respawn
    if (respawnIfDead(bot)) return switchBehavior('respawn', () => {});

    // 2️⃣ Lost safety
    if (handleLostSafety(bot)) return switchBehavior('lostSafety', () => {});

    // 3️⃣ Hunger
    if (handleHunger(bot)) return switchBehavior('hunger', () => {});

    // 4️⃣ Night safety
    if (handleNightSafety(bot)) return switchBehavior('nightSafety', () => {});

    // 5️⃣ Mob avoidance
    if (handleMobAvoidance(bot)) return switchBehavior('mobAvoidance', () => {});

    // 6️⃣ Default pathing / walking
    switchBehavior('pathing', handlePathing);
  }, 50);
};
