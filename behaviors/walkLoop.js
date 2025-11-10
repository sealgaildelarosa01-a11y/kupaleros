// behaviors/walkLoop.js
let tick = 0;

module.exports = function walkLoop(bot) {
  if (!bot?.entity?.position) return;

  tick++;

  // Change direction every 2 seconds (~40 ticks)
  if (tick % 40 === 0) {
    bot.pathYaw = Math.random() * 360;
  }

  const speed = 0.2; // movement speed per tick
  const yawRad = (bot.pathYaw * Math.PI) / 180;

  const velocity = {
    x: Math.sin(yawRad) * speed,
    y: 0, // y handled by physics
    z: Math.cos(yawRad) * speed,
  };

  // Send motion packet to server
  try {
    bot.queue('set_actor_motion', {
      runtime_entity_id: bot.entity.runtime_id,
      motion: velocity,
    });

    // Predict new position
    const pos = bot.entity.position;
    const newPos = {
      x: pos.x + velocity.x,
      y: pos.y,
      z: pos.z + velocity.z,
    };

    // Move player packet so server sees bot moving
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

    // Update local position cache
    bot.entity.position = newPos;

    console.log(`[WalkLoop] Moving to x:${newPos.x.toFixed(2)} z:${newPos.z.toFixed(2)}`);
  } catch (err) {
    console.log('WalkLoop error:', err.message);
  }
};
