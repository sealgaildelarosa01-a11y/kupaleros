let tick = 0;

module.exports = function walkLoop(bot) {
  if (!bot?.entity?.position) return;

  tick++;

  // Change direction every 2 seconds
  if (tick % 40 === 0) {
    bot.pathYaw = Math.random() * 360;
  }

  const speed = bot.gamemode === 1 ? 0.5 : 0.2; // faster in creative
  const yawRad = (bot.pathYaw * Math.PI) / 180;

  const velocity = {
    x: Math.sin(yawRad) * speed,
    y: 0,
    z: Math.cos(yawRad) * speed,
  };

  try {
    if (bot.gamemode === 1) {
      // Creative: simple motion
      bot.queue('set_actor_motion', {
        runtime_entity_id: bot.entity.runtime_id,
        motion: velocity,
      });
    } else {
      // Survival: realistic move
      const pos = bot.entity.position;
      const newPos = {
        x: pos.x + velocity.x,
        y: pos.y,
        z: pos.z + velocity.z,
      };

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

      bot.entity.position = newPos;
    }

    console.log(`[WalkLoop] Moving to x:${bot.entity.position.x.toFixed(2)} z:${bot.entity.position.z.toFixed(2)}`);
  } catch (err) {
    console.log('WalkLoop error:', err.message);
  }
};
