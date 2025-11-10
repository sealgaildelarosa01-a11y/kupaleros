// behaviors/behaviorManager.js
const walkLoop = require('./walkLoop');
const { handleNightSafety, handleLostSafety, handleHunger, handleMobAvoidance, respawnIfDead, handlePathing } = require('./handlers');

module.exports = function behaviorManager(bot) {

  // Walk loop every 50ms
  setInterval(() => {
    walkLoop(bot);
  }, 50);

  // AI checks every 1s
  setInterval(() => {
    if (!bot?.entity) return;

    if (respawnIfDead(bot)) return;
    if (handleLostSafety(bot)) return;
    if (handleHunger(bot)) return;
    if (handleNightSafety(bot)) return;
    if (handleMobAvoidance(bot)) return;
  }, 1000);
};
