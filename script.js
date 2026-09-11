const screens = [...document.querySelectorAll(".screen")]
const stars = document.getElementById("stars")

function showScreen(id) {
  screens.forEach(s => s.classList.remove("active"))
  const next = document.getElementById(id)
  if (next) next.classList.add("active")
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function nextQuestion(currentId, nextId, button, message, color = "green") {
  const parent = button.closest(".screen")
  parent.querySelectorAll(".answer").forEach(b => b.disabled = true)
  button.classList.add(color === "red" ? "wrong" : "correct")
  const feedback = parent.querySelector(".feedback")
  feedback.textContent = message
  feedback.className = "feedback pop"

  setTimeout(() => showScreen(nextId), 1250)
}

document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.next))
})

const questionScreens = [
  { id: "q1", next: "q2" },
  { id: "q2", next: "q3" },
  { id: "q3", next: "q4" }
]

questionScreens.forEach(item => {
  const screen = document.getElementById(item.id)
  screen.querySelectorAll(".answer").forEach(button => {
    button.addEventListener("click", () => {
      nextQuestion(item.id, item.next, button, button.dataset.msg)
    })
  })
})

const q4 = document.getElementById("q4")
q4.querySelectorAll(".answer").forEach(button => {
  button.addEventListener("click", () => {
    const isYes = button.textContent.trim() === "آره"
    q4.querySelectorAll(".answer").forEach(b => b.disabled = true)
    button.classList.add(isYes ? "correct" : "wrong")
    const feedback = q4.querySelector(".feedback")
    feedback.textContent = button.dataset.msg
    feedback.className = "feedback pop"
    setTimeout(() => showScreen("game"), 1250)
  })
})

const scoreEl = document.getElementById("score")
const timeEl = document.getElementById("time")
const gameBox = document.getElementById("gameBox")
const startGame = document.getElementById("startGame")
const gameResult = document.querySelector(".game-result")

let score = 0
let timeLeft = 15
let gameRunning = false
let timer = null
let targetTimer = null

function toFa(n) {
  return String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d])
}

function spawnTarget() {
  if (!gameRunning) return

  const target = document.createElement("button")
  target.className = "target"
  target.type = "button"
  target.textContent = "🎯"

  const maxX = Math.max(0, gameBox.clientWidth - 56)
  const maxY = Math.max(0, gameBox.clientHeight - 56)

  target.style.left = `${Math.random() * maxX}px`
  target.style.top = `${Math.random() * maxY}px`

  target.addEventListener("click", () => {
    score++
    scoreEl.textContent = toFa(score)
    target.remove()
    spawnTarget()
  }, { once: true })

  gameBox.appendChild(target)

  setTimeout(() => {
    if (target.isConnected) target.remove()
  }, 900)
}

function finishGame() {
  gameRunning = false
  clearInterval(timer)
  clearInterval(targetTimer)
  gameBox.querySelectorAll(".target").forEach(t => t.remove())

  if (score >= 10) {
    gameResult.textContent = "آفرین خاک تو سر رایان 😂🔥"
    gameResult.style.color = "#86efac"
    setTimeout(() => {
      showScreen("final")
      makeConfetti()
    }, 1400)
  } else {
    gameResult.textContent = "ریدییی 😂❌"
    gameResult.style.color = "#fca5a5"
    startGame.textContent = "دوباره تلاش کن 🔄"
    startGame.disabled = false
  }
}

function startGameNow() {
  score = 0
  timeLeft = 15
  scoreEl.textContent = toFa(score)
  timeEl.textContent = toFa(timeLeft)
  gameResult.textContent = ""
  gameRunning = true
  startGame.disabled = true
  startGame.textContent = "بزن بریم 😈"

  spawnTarget()
  targetTimer = setInterval(spawnTarget, 650)

  timer = setInterval(() => {
    timeLeft--
    timeEl.textContent = toFa(timeLeft)

    if (timeLeft <= 0) finishGame()
  }, 1000)
}

startGame.addEventListener("click", startGameNow)

function makeConfetti() {
  const wrap = document.getElementById("confetti")
  wrap.innerHTML = ""
  for (let i = 0; i < 55; i++) {
    const piece = document.createElement("i")
    piece.style.left = `${Math.random() * 100}%`
    piece.style.animationDelay = `${Math.random() * 1.2}s`
    piece.style.transform = `rotate(${Math.random() * 180}deg)`
    piece.style.width = `${5 + Math.random() * 7}px`
    piece.style.height = `${8 + Math.random() * 13}px`
    wrap.appendChild(piece)
  }
}

const giftBtn = document.getElementById("giftBtn")
const audio = document.getElementById("birthdayAudio")
const musicStatus = document.getElementById("musicStatus")

giftBtn.addEventListener("click", async () => {
  showScreen("last")
  try {
    await audio.play()
    musicStatus.textContent = "آهنگ تولدت مبارک 🎵❤️"
  } catch (e) {
    musicStatus.textContent = "برای پخش آهنگ یک بار روی صفحه بزن 🎵"
  }
})

document.getElementById("last").addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play()
      musicStatus.textContent = "آهنگ تولدت مبارک 🎵❤️"
    } catch (e) {}
  }
})

if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready()
  window.Telegram.WebApp.expand()
  document.body.classList.add("telegram")
}
