const { handlePathing } = require('./handlers');

module.exports = function behaviorManager(bot) {
  console.log('BehaviorManager started: bot will move every tick');

  // Randomly change pathYaw every 5 seconds
  setInterval(() => {
    if (bot.pathYaw !== undefined) bot.pathYaw = Math.random() * 360;
  }, 5000);

  // Main loop: move the bot every 50ms (~20 ticks/sec)
  setInterval(() => {
    if (!bot?.entity?.position) return;
    handlePathing(bot);
  }, 50);
};
