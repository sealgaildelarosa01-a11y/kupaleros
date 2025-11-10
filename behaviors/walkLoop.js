// walkLoop.js
module.exports = function walkLoop(bot) {
  if (!bot.entity || !bot.entity.position) return;

  // Initialize yaw if not set
  if (bot.pathYaw === undefined) bot.pathYaw = Math.random() * 360;

  const speed = 0.4; // movement speed per tick
  const rad = (bot.pathYaw * Math.PI) / 180;

  // Calculate velocity
  const velocity = {
    x: Math.cos(rad) * speed,
    y: 0,
    z: Math.sin(rad) * speed,
  };

  // Send motion to server
  bot.queue('set_actor_motion', {
    runtime_entity_id: bot.entity.runtime_id,
    motion: velocity,
  });

  // Predict new position
  const newPos = {
    x: bot.entity.position.x + velocity.x,
    y: bot.entity.position.y,
    z: bot.entity.position.z + velocity.z,
  };

  // Send move_player packet
  bot.queue('move_player', {
    runtime_entity_id: bot.entity.runtime_id,
    position: newPos,
    pitch: 0,
    yaw: bot.pathYaw,
    head_yaw: bot.pathYaw,
    mode: 0,
    on_ground: true,
    ridden_runtime_id: 0,
  });

  console.log('Walking yaw:', bot.pathYaw.toFixed(1));
};
