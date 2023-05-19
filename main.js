const timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

let interval;
let endTime; // Declare endTime variable outside the startTimer function

const audioElements = {
    pomodoro: document.getElementById("pomodoroSound"),
    shortBreak: document.getElementById("shortBreakSound"),
    longBreak: document.getElementById("longBreakSound"),
  };
  
  function playSound(mode) {
    const audioElement = audioElements[mode];
    if (audioElement) {
      audioElement.currentTime = 0; // Rewind to the beginning
  
      // Check if the user has interacted with the page
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Audio playback started successfully
          })
          .catch((error) => {
            // Audio playback failed
            console.log(error);
          });
      }
    }
  }
  

const mainButton = document.getElementById("js-btn");
mainButton.addEventListener("click", () => {
  const { action } = mainButton.dataset;
  if (action === "start") {
    startTimer();
  } else {
    stopTimer(); // Call stopTimer function when the button action is "stop"
  }
});

const modeButtons = document.querySelector("#js-mode-buttons");
modeButtons.addEventListener("click", handleMode);

function handleMode(event) {
  const { mode } = event.target.dataset;

  if (!mode) return;

  switchMode(mode);
}

function switchMode(mode) {
  if (mainButton.dataset.action === "stop") {
    stopTimer(); // Stop the timer if it's currently running
  }

  clearInterval(interval); // Clear the interval

  timer.mode = mode;
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
  };

  document
    .querySelectorAll("button[data-mode]")
    .forEach((e) => e.classList.remove("active"));
  document.querySelector(`[data-mode="${mode}"]`).classList.add("active");
  document.body.style.backgroundColor = `var(--${mode})`;

  updateClock();
}

function getRemainingTime() {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;

  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
    total,
    minutes,
    seconds,
  };
}

function startTimer() {
    let { total } = timer.remainingTime;
    endTime = Date.parse(new Date()) + total * 1000;
  
    mainButton.dataset.action = "stop";
    mainButton.textContent = "stop";
    mainButton.classList.add("active");
  
    interval = setInterval(function () {
      timer.remainingTime = getRemainingTime();
      updateClock();
  
      total = timer.remainingTime.total;
      if (total <= 0) {
        clearInterval(interval);
        mainButton.dataset.action = "start";
        mainButton.textContent = "start";
        mainButton.classList.remove("active");
  
        if (timer.mode === "pomodoro") {
          // Switch to break mode
          switchMode("shortBreak");
        } else {
          // Switch to Pomodoro mode
          switchMode("pomodoro");
        }
        playSound(timer.mode);
      }
    }, 1000);
  }
  

function stopTimer() {
  clearInterval(interval);
  mainButton.dataset.action = "start";
  mainButton.textContent = "start";
  mainButton.classList.remove("active");
}

function updateClock() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, "0");
  const seconds = `${remainingTime.seconds}`.padStart(2, "0");

  const min = document.getElementById("js-minutes");
  const sec = document.getElementById("js-seconds");

  min.textContent = minutes;
  sec.textContent = seconds;
}

document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
});