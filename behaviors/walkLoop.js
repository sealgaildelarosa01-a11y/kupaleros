// behaviors/walkLoop.js
let tick = 0;

module.exports = function walkLoop(bot) {
  if (!bot?.entity?.position || !bot?.entity?.runtime_id) return;

  tick++;

  // change direction every 40 ticks (~2s)
  if (tick % 40 === 0) {
    bot.pathYaw = Math.random() * 360;
  }

  const speed = 0.3;
  const yawRad = (bot.pathYaw ?? 0) * (Math.PI / 180);

  const dx = Math.sin(yawRad) * speed;
  const dz = Math.cos(yawRad) * speed;

  const pos = bot.entity.position;
  const newPos = {
    x: pos.x + dx,
    y: pos.y,
    z: pos.z + dz,
  };

  // send motion + position to server
  bot.queue('set_actor_motion', {
    runtime_entity_id: bot.entity.runtime_id,
    motion: { x: dx, y: 0, z: dz }
  });

  bot.queue('move_player', {
    runtime_entity_id: bot.entity.runtime_id,
    position: newPos,
    pitch: 0,
    yaw: bot.pathYaw ?? 0,
    head_yaw: bot.pathYaw ?? 0,
    mode: 0,
    on_ground: true,
    riding_runtime_id: 0
  });

  // update local position
  bot.entity.position = newPos;

  console.log(`[WalkLoop] Walking to x:${newPos.x.toFixed(2)} z:${newPos.z.toFixed(2)}`);
};
