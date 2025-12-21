const { createClient } = require('bedrock-protocol')
const http = require('http')

/* ======================
   CONFIG
   ====================== */
const CONFIG = {
  host: 'kupaleros-rg1D.aternos.me',
  port: 40915,
  username: 'Noxell',
  version: '1.21.120',
  offline: true
}

let bot = null
let reconnecting = false

/* ======================
   START BOT
   ====================== */
function startBot() {
  console.log('🚀 Starting bot...')

  bot = createClient(CONFIG)

  bot.on('spawn', () => {
    console.log('✅ Bot spawned!')
    startWalkLoop()
  })

  bot.on('text', p => {
    console.log(`[Server] ${p.message}`)
  })

  bot.on('kick', p => {
    console.log('❌ Kicked:', p.reason)
    reconnect()
  })

  bot.on('error', e => {
    console.log('⚠️ Error:', e.message)
    reconnect()
  })
}

/* ======================
   AUTO RECONNECT
   ====================== */
function reconnect() {
  if (reconnecting) return
  reconnecting = true

  console.log('🔄 Reconnecting in 15 seconds...')
  setTimeout(() => {
    reconnecting = false
    startBot()
  }, 15000)
}

/* ======================
   HUMAN-LIKE MOVEMENT
   ====================== */
function startWalkLoop() {
  let angle = Math.random() * Math.PI * 2

  setInterval(() => {
    if (!bot?.entity?.position) return

    const pos = bot.entity.position
    const speed = 0.2 + Math.random() * 0.15

    // Random movement (NOT perfect circle)
    angle += (Math.random() * 0.6) - 0.3

    const newPos = {
      x: pos.x + Math.cos(angle) * speed,
      y: pos.y,
      z: pos.z + Math.sin(angle) * speed
    }

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
    })

    bot.entity.position = newPos
    console.log(`[Walk] x=${newPos.x.toFixed(2)} z=${newPos.z.toFixed(2)}`)
  }, 1200 + Math.random() * 800) // slower + random
}

/* ======================
   RENDER HTTP SERVER
   ====================== */
const PORT = process.env.PORT || 3000

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Minecraft Bedrock bot is running ✅')
}).listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 HTTP server running on port ${PORT}`)
})

/* ======================
   START EVERYTHING
   ====================== */
startBot()
