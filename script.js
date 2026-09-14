const screens = [...document.querySelectorAll(".screen")]
const stars = document.getElementById("stars")

function showScreen(id) {
  screens.forEach(s => s.classList.remove("active"))

  const next = document.getElementById(id)

  if (next) {
    next.classList.add("active")
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}

function nextQuestion(currentId, nextId, button, message, color = "green") {
  const parent = button.closest(".screen")

  parent.querySelectorAll(".answer").forEach(b => {
    b.disabled = true
  })

  button.classList.add(
    color === "red" ? "wrong" : "correct"
  )

  const feedback = parent.querySelector(".feedback")

  if (feedback) {
    feedback.textContent = message
    feedback.className = "feedback pop"
  }

  setTimeout(() => {
    showScreen(nextId)
  }, 1250)
}


/* =========================
   GENERAL NEXT BUTTONS
========================= */

document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.next)
  })
})


/* =========================
   QUESTIONS 1 - 3
========================= */

const questionScreens = [
  {
    id: "q1",
    next: "q2"
  },
  {
    id: "q2",
    next: "q3"
  },
  {
    id: "q3",
    next: "q4"
  }
]

questionScreens.forEach(item => {
  const screen = document.getElementById(item.id)

  if (!screen) return

  screen.querySelectorAll(".answer").forEach(button => {
    button.addEventListener("click", () => {
      nextQuestion(
        item.id,
        item.next,
        button,
        button.dataset.msg
      )
    })
  })
})


/* =========================
   QUESTION 4
========================= */

const q4 = document.getElementById("q4")

if (q4) {
  q4.querySelectorAll(".answer").forEach(button => {
    button.addEventListener("click", () => {

      const isYes =
        button.textContent.trim() === "آره"

      q4.querySelectorAll(".answer").forEach(b => {
        b.disabled = true
      })

      button.classList.add(
        isYes ? "correct" : "wrong"
      )

      const feedback =
        q4.querySelector(".feedback")

      if (feedback) {
        feedback.textContent = button.dataset.msg
        feedback.className = "feedback pop"
      }

      setTimeout(() => {
        showScreen("game")
      }, 1250)
    })
  })
}


/* =========================
   GAME
========================= */

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
  return String(n).replace(
    /\d/g,
    d => "۰۱۲۳۴۵۶۷۸۹"[d]
  )
}


function spawnTarget() {
  if (!gameRunning || !gameBox) return

  const target = document.createElement("button")

  target.className = "target"
  target.type = "button"
  target.textContent = "🎯"

  const maxX = Math.max(
    0,
    gameBox.clientWidth - 56
  )

  const maxY = Math.max(
    0,
    gameBox.clientHeight - 56
  )

  target.style.left =
    `${Math.random() * maxX}px`

  target.style.top =
    `${Math.random() * maxY}px`

  target.addEventListener(
    "click",
    () => {
      if (!gameRunning) return

      score++

      if (scoreEl) {
        scoreEl.textContent = toFa(score)
      }

      target.remove()

      spawnTarget()
    },
    {
      once: true
    }
  )

  gameBox.appendChild(target)

  setTimeout(() => {
    if (target.isConnected) {
      target.remove()
    }
  }, 900)
}


function finishGame() {
  gameRunning = false

  clearInterval(timer)
  clearInterval(targetTimer)

  timer = null
  targetTimer = null

  if (gameBox) {
    gameBox
      .querySelectorAll(".target")
      .forEach(t => t.remove())
  }

  if (score >= 10) {

    if (gameResult) {
      gameResult.textContent =
        "آفرین خاک تو سر رایان 😂🔥"

      gameResult.style.color =
        "#86efac"
    }

    setTimeout(() => {
      showScreen("final")
      makeConfetti()
    }, 1400)

  } else {

    if (gameResult) {
      gameResult.textContent =
        "ریدییی 😂❌"

      gameResult.style.color =
        "#fca5a5"
    }

    if (startGame) {
      startGame.textContent =
        "دوباره تلاش کن 🔄"

      startGame.disabled = false
    }
  }
}


function startGameNow() {

  if (gameRunning) return

  score = 0
  timeLeft = 15

  if (scoreEl) {
    scoreEl.textContent = toFa(score)
  }

  if (timeEl) {
    timeEl.textContent = toFa(timeLeft)
  }

  if (gameResult) {
    gameResult.textContent = ""
  }

  gameRunning = true

  if (startGame) {
    startGame.disabled = true
    startGame.textContent = "بزن بریم 😈"
  }

  spawnTarget()

  targetTimer = setInterval(
    spawnTarget,
    650
  )

  timer = setInterval(() => {

    timeLeft--

    if (timeEl) {
      timeEl.textContent =
        toFa(timeLeft)
    }

    if (timeLeft <= 0) {
      finishGame()
    }

  }, 1000)
}


if (startGame) {
  startGame.addEventListener(
    "click",
    startGameNow
  )
}


/* =========================
   CONFETTI
========================= */

function makeConfetti() {

  const wrap =
    document.getElementById("confetti")

  if (!wrap) return

  wrap.innerHTML = ""

  for (let i = 0; i < 55; i++) {

    const piece =
      document.createElement("i")

    piece.style.left =
      `${Math.random() * 100}%`

    piece.style.animationDelay =
      `${Math.random() * 1.2}s`

    piece.style.transform =
      `rotate(${Math.random() * 180}deg)`

    piece.style.width =
      `${5 + Math.random() * 7}px`

    piece.style.height =
      `${8 + Math.random() * 13}px`

    wrap.appendChild(piece)
  }
}


/* =========================
   BIRTHDAY MUSIC
========================= */

const giftBtn =
  document.getElementById("giftBtn")

const audio =
  document.getElementById("birthdayAudio")

const musicStatus =
  document.getElementById("musicStatus")


/*
   تنظیمات اولیه صدا
*/

if (audio) {

  audio.preload = "auto"

  audio.volume = 1

  /*
     وقتی واقعاً پخش شروع شد
  */

  audio.addEventListener(
    "playing",
    () => {

      if (musicStatus) {
        musicStatus.textContent =
          "آهنگ تولدت مبارک 🎵❤️"
      }

      console.log(
        "Birthday audio is playing."
      )
    }
  )


  /*
     وقتی صدا pause شد
  */

  audio.addEventListener(
    "pause",
    () => {

      console.log(
        "Birthday audio paused."
      )
    }
  )


  /*
     خطای لود یا پخش فایل
  */

  audio.addEventListener(
    "error",
    () => {

      console.error(
        "Audio error:",
        audio.error
      )

      if (musicStatus) {
        musicStatus.textContent =
          "مشکل در فایل آهنگ وجود دارد ❌🎵"
      }
    }
  )


  /*
     فایل صوتی آماده پخش شده
  */

  audio.addEventListener(
    "canplay",
    () => {

      console.log(
        "Audio is ready to play."
      )
    }
  )
}


/*
   تابع اصلی پخش آهنگ
*/

async function playBirthdayMusic() {

  if (!audio) {

    console.error(
      "Element #birthdayAudio was not found."
    )

    if (musicStatus) {
      musicStatus.textContent =
        "audio پیدا نشد ❌"
    }

    return false
  }


  try {

    /*
       اگر آهنگ قبلاً تمام شده،
       از اول شروع کن
    */

    if (audio.ended) {
      audio.currentTime = 0
    }


    /*
       اطمینان از صدای روشن
    */

    audio.muted = false
    audio.volume = 1


    /*
       تلاش برای پخش
    */

    const playPromise = audio.play()


    /*
       بعضی محیط‌های قدیمی ممکن است
       Promise برنگردانند
    */

    if (playPromise !== undefined) {
      await playPromise
    }


    if (musicStatus) {
      musicStatus.textContent =
        "آهنگ تولدت مبارک 🎵❤️"
    }

    console.log(
      "Audio playback started successfully."
    )

    return true

  } catch (error) {

    console.error(
      "Audio play failed:",
      error.name,
      error.message
    )


    if (musicStatus) {

      if (error.name === "NotAllowedError") {

        musicStatus.textContent =
          "برای پخش آهنگ یک بار روی صفحه بزن 🎵"

      } else if (
        error.name === "NotSupportedError"
      ) {

        musicStatus.textContent =
          "فرمت یا فایل آهنگ قابل پخش نیست ❌"

      } else {

        musicStatus.textContent =
          "پخش آهنگ انجام نشد؛ دوباره روی صفحه بزن 🎵"
      }
    }

    return false
  }
}


/*
   کلیک روی دکمه هدیه

   نکته مهم:
   playBirthdayMusic() مستقیماً
   از همین click اجرا می‌شود.
*/

if (giftBtn) {

  giftBtn.addEventListener(
    "click",
    async () => {

      showScreen("last")

      await playBirthdayMusic()
    }
  )
}


/*
   اگر کلیک اول توسط WebView رد شد،
   هر کلیک روی صفحه دوباره تلاش می‌کند.
*/

const lastScreen =
  document.getElementById("last")

if (lastScreen) {

  lastScreen.addEventListener(
    "click",
    async () => {

      if (!audio) return

      if (audio.paused) {
        await playBirthdayMusic()
      }
    }
  )
}


/*
   اگر کاربر روی خود صفحه لمس/کلیک کرد،
   امکان فعال شدن صدا فراهم می‌شود.
*/

document.addEventListener(
  "pointerdown",
  () => {

    if (!audio) return

    /*
       فقط preload را شروع می‌کنیم؛
       پخش را بدون درخواست کاربر شروع نمی‌کنیم.
    */

    if (audio.readyState === 0) {
      audio.load()
    }
  },
  {
    once: true,
    passive: true
  }
)


/* =========================
   TELEGRAM WEB APP
========================= */

if (
  window.Telegram &&
  window.Telegram.WebApp
) {

  window.Telegram.WebApp.ready()

  window.Telegram.WebApp.expand()

  document.body.classList.add(
    "telegram"
  )
}
