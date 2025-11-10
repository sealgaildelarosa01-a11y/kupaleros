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

  // Walk continuously
  setInterval(() => walkLoop(bot), 50); // 20 ticks per second

  // Main AI loop
  setInterval(() => {
    if (!bot?.entity) return;

    if (respawnIfDead(bot)) return switchBehavior('respawn', () => {});
    if (handleLostSafety(bot)) return switchBehavior('lostSafety', () => {});
    if (handleHunger(bot)) return switchBehavior('hunger', () => {});
    if (handleNightSafety(bot)) return switchBehavior('nightSafety', () => {});
    if (handleMobAvoidance(bot)) return switchBehavior('mobAvoidance', () => {});

    switchBehavior('pathing', handlePathing);
  }, 200);
};
