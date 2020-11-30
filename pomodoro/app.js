const TIME = 1500;
const SHORT_BREAK = 300;
const LONG_BREAK = 600;

const timeDisplay = document.querySelector('#timeDisplay');

const startButton = document.querySelector('#startButton');
const stopButton = document.querySelector('#stopButton');
const resetButton = document.querySelector('#resetButton');

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

  stopButton.disabled = false;
  startButton.disabled = true;

  intervalId = setInterval(tick, 1000);
}

function stop() {
  if (!started) return;

  clearInterval(intervalId);
  intervalId = undefined;

  stopButton.disabled = true;
  startButton.disabled = false;

  started = false;
}

function reset() {
  remainingTime = TIME;
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
