const TIME = 1500;
const SHORT_BREAK = 300;
const LONG_BREAK = 600;

let timeDisplay = document.querySelector('#timeDisplay');

let remainingTime = TIME;
let started = false;
let intervalId = undefined;
let lastChoice = undefined;

function init(time = TIME) {
  stop();

  remainingTime = time;

  lastChoice = time;

  updateUI();
}

function start() {
  if (started) return;

  started = true;

  intervalId = setInterval(tick, 1000);
}

function stop() {
  if (!started) return;

  clearInterval(intervalId);
  intervalId = undefined;

  started = false;
  remainingTime = TIME;

  reset();
}

function reset() {
  init(lastChoice);
}

function tick() {
  remainingTime -= 1;

  updateUI();
}

function updateUI() {
  timeDisplay.textContent = formatRemainingTime();
  document.title = `${formatRemainingTime()} - Pomodoro taimer`;
}

function formatRemainingTime() {
  const mins = formatZeroes(Math.floor(remainingTime / 60));
  const secs = formatZeroes(remainingTime - mins * 60);

  return `${mins}:${secs}`;
}

function formatZeroes(number, len = 2) {
  return String(number).padStart(len, '0');
}

(() => init)();
