const clock = document.getElementById("clock");
const countdownSection = document.getElementById("countdown");
const toggleBtn = document.getElementById("toggle");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const inputMinutes = document.getElementById("minutes");

const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const restartBtn = document.getElementById("restartBtn")
const stopBtn = document.getElementById("stopBtn");

let clockInterval, countdownInterval;
let mode = "clock"; // or "countdown"

// Function: Digital Clock
function startClock() {
  clockInterval = setInterval(() => {
    const now = new Date();
    const time = now.toLocaleTimeString();
    clock.textContent = time;
  }, 1000);
}

let timeLeft = 0;
let initialTime = 0;
let isPaused = false;

// Function: Countdown
function startCountdown() {
    // If already running, do nothing
    if (startBtn.disabled) return;

    timeLeft = Number(inputMinutes.value) * 60;
    if (!Number.isFinite(timeLeft) || timeLeft <= 0) {
            return alert("Enter valid minutes!");
    }

    initialTime = timeLeft;
    updateDisplay();
    startBtn.disabled = true; // 🔒 Disable the Start button
    inputMinutes.disabled = true; // Optional: disable input too during countdown
        
    pauseBtn.disabled = false;
    restartBtn.disabled = false;
    resumeBtn.disabled = true;

    countdownInterval = setInterval(tick, 1000);
}

function tick() {
  if (timeLeft <= 0) {
    clearInterval(countdownInterval);
    timerDisplay.textContent = "⏰ Time’s up!";
    resetButtons();
    return;
  }

  timeLeft--;
  updateDisplay();
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;  
}

// 🟡 Pause countdown
function pauseCountdown() {
  if (!countdownInterval) return;
  clearInterval(countdownInterval);
  isPaused = true;
  pauseBtn.disabled = true;
  resumeBtn.disabled = false;
}

// 🟢 Resume countdown
function resumeCountdown() {
  if (!isPaused) return;
  countdownInterval = setInterval(tick, 1000);
  isPaused = false;
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
}

// 🔁 Restart countdown
function restartCountdown() {
  clearInterval(countdownInterval);
  timeLeft = initialTime;
  updateDisplay();
  countdownInterval = setInterval(tick, 1000);
  isPaused = false;
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
}

// 🧹 Reset buttons when done
function resetButtons() {
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resumeBtn.disabled = true;
  restartBtn.disabled = true;
  inputMinutes.disabled = false;
}

function stopAll() {
  clearInterval(clockInterval);
  clearInterval(countdownInterval);
  countdownInterval = null;
  clockInterval = null;
  isPaused = false;
  timeLeft = 0;
  
  // Reset timer display only if in countdown mode
  timerDisplay.textContent = "⏰ Countdown stopped!";
  inputMinutes.disabled = false;
  inputMinutes.value = "";
  
  resetButtons(); // 🧹 Re-enable main start button, disable pause/resume etc.
}

// Toggle between modes
toggleBtn.addEventListener("click", () => {
  if (mode === "clock") {
    mode = "countdown";
    toggleBtn.textContent = "Switch to Clock";
    clock.classList.add("hidden");
    countdownSection.classList.remove("hidden");
    // ✅ Don't stop countdown — just stop clock
    clearInterval(clockInterval);
  } else {
    mode = "clock";
    toggleBtn.textContent = "Switch to Countdown";
    countdownSection.classList.add("hidden");
    clock.classList.remove("hidden");
    startClock();
  }
});

// Start countdown button
startBtn.addEventListener("click", startCountdown);
pauseBtn.addEventListener("click", pauseCountdown);
resumeBtn.addEventListener("click", resumeCountdown);
restartBtn.addEventListener("click", restartCountdown);
stopBtn.addEventListener('click', stopAll);

// Start clock by default
startClock();
