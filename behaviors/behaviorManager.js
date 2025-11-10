// behaviorManager.js
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
  let cooldown = 0;

  function switchBehavior(name, fn) {
    if (activeBehavior !== name) {
      activeBehavior = name;
      console.log(`[Behavior] Switched to: ${name}`);
    }
    try { fn(bot); } catch (e) { console.log('Behavior error:', e.message); }
  }

  // Randomly change pathing direction every 5s
  setInterval(() => {
    if (activeBehavior === 'pathing') bot.pathYaw = Math.random() * 360;
  }, 5000);

  // Main AI loop
  setInterval(() => {
    if (!bot || !bot.entity) return;

    // Respawn if dead
    if (respawnIfDead(bot)) return switchBehavior('respawn', () => {});

    // Lost safety
    if (handleLostSafety(bot)) return switchBehavior('lostSafety', () => {});

    // Hunger
    if (handleHunger(bot)) return switchBehavior('hunger', () => {});

    // Night safety
    if (handleNightSafety(bot)) return switchBehavior('nightSafety', () => {});

    // Mob avoidance
    if (handleMobAvoidance(bot)) return switchBehavior('mobAvoidance', () => {});

    // Default pathing / walking
    switchBehavior('pathing', handlePathing); 
    walkLoop(bot); // continuously move bot

  }, 50); // 20 ticks per second
};
