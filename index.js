const { createClient } = require('bedrock-protocol')
const http = require('http')

/* ======================
   CONFIG
   ====================== */
const BASE_CONFIG = {
  host: 'kupaleros-rg1D.aternos.me',
  port: 40915,
  version: '1.21.120',
  offline: true
}

const BOT_A = { ...BASE_CONFIG, username: 'Noxella' }
const BOT_B = { ...BASE_CONFIG, username: 'Noxellb' }

const JOIN_TIME = 18 * 60 * 1000   // 18 minutes
const SWITCH_TIME = 15 * 60 * 1000 // 15 minutes
const RECONNECT_DELAY = 15000     // 15 sec

let activeBot = null
let activeName = null
let activeConfig = null

let walkInterval = null
let reconnectTimer = null
let intentionalStop = false

/* ======================
   START BOT
   ====================== */
function startBot(config, name) {
  console.log(`🚀 Starting ${name}...`)
  activeConfig = config

  const bot = createClient(config)

  bot.on('spawn', () => {
    console.log(`✅ ${name} spawned`)
    intentionalStop = false
    startWalkLoop(bot, name)
  })

  const handleDisconnect = (reason) => {
    if (intentionalStop) return
    if (name !== activeName) return

    console.log(`🔄 ${name} reconnecting in 15s... Reason:`, reason)

    clearTimeout(reconnectTimer)
    reconnectTimer = setTimeout(() => {
      activeBot = startBot(activeConfig, activeName)
    }, RECONNECT_DELAY)
  }

  bot.on('kick', p => handleDisconnect(p.reason))
  bot.on('error', e => handleDisconnect(e.message))

  return bot
}

/* ======================
   STOP BOT
   ====================== */
function stopBot() {
  if (!activeBot) return

  intentionalStop = true
  console.log(`👋 ${activeName} leaving server`)

  clearInterval(walkInterval)
  walkInterval = null

  try {
    activeBot.disconnect()
  } catch {}

  activeBot = null
  activeName = null
}

/* ======================
   WALK LOOP (HUMAN-LIKE)
   ====================== */
function startWalkLoop(bot, name) {
  let angle = Math.random() * Math.PI * 2

  walkInterval = setInterval(() => {
    if (!bot?.entity?.position) return

    const pos = bot.entity.position
    const speed = 0.2 + Math.random() * 0.15
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
      yaw: angle * 180 / Math.PI,
      head_yaw: angle * 180 / Math.PI,
      mode: 0,
      on_ground: true,
      riding_runtime_id: 0,
      teleportation_cause: 0,
      teleportation_item: 0
    })

    bot.entity.position = newPos
    console.log(`[${name} Walk] x=${newPos.x.toFixed(2)} z=${newPos.z.toFixed(2)}`)
  }, 1500)
}

/* ======================
   BOT ROTATION LOGIC
   ====================== */
function startRotation() {
  // Start BOT A
  activeName = 'BOT_A'
  activeBot = startBot(BOT_A, 'BOT_A')

  // Switch to BOT B after 15 minutes
  setTimeout(() => {
    stopBot()
    activeName = 'BOT_B'
    activeBot = startBot(BOT_B, 'BOT_B')
  }, SWITCH_TIME)

  // Continue rotating every 18 minutes
  setInterval(() => {
    stopBot()

    if (activeName === 'BOT_A') {
      activeName = 'BOT_B'
      activeBot = startBot(BOT_B, 'BOT_B')
    } else {
      activeName = 'BOT_A'
      activeBot = startBot(BOT_A, 'BOT_A')
    }
  }, JOIN_TIME)
}

/* ======================
   HTTP SERVER (RENDER)
   ====================== */
const PORT = process.env.PORT || 3000

http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Minecraft Bedrock bot rotation running ✅')
}).listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 HTTP server running on port ${PORT}`)
})

/* ======================
   START EVERYTHING
   ====================== */
startRotation()
