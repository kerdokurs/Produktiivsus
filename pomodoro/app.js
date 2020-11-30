// Defineerime erinevate etappide ajad
const TIME = 5;
const SHORT_BREAK = 300;
const LONG_BREAK = 600;

// Võtame DOM-ist vajalikud elemendid
const timeDisplay = document.querySelector('#timeDisplay');

const startButton = document.querySelector('#startButton');
const stopButton = document.querySelector('#stopButton');
const resetButton = document.querySelector('#resetButton');

class PomodoroApp {
  remainingTime = TIME;
  started = false;
  intervalId = undefined;
  lastChoice = undefined;

  constructor() {
    this.init();
  }

  init(time = TIME) {
    this.stop();

    this.remainingTime = time;
    this.lastChoice = time;

    this.updateUI();
  }

  start() {
    if (this.started) return;

    this.started = true;

    stopButton.disabled = false;
    startButton.disabled = true;

    this.intervalId = setInterval(this.tick.bind(this), 1000);
  }

  stop() {
    if (!this.started) return;

    clearInterval(this.intervalId);
    this.intervalId = undefined;

    stopButton.disabled = true;
    startButton.disabled = false;

    this.started = false;
  }

  reset() {
    this.init(this.lastChoice);
  }

  tick() {
    this.remainingTime -= 1;

    this.updateUI();

    if (this.remainingTime === 0) this.stop();
  }

  updateUI() {
    const formattedRemainingTime = this.formatRemainingTime();

    timeDisplay.textContent = formattedRemainingTime;
    document.title = `${formattedRemainingTime} - Pomodoro taimer`;
  }

  formatRemainingTime() {
    const mins = this.formatZeroes(Math.floor(this.remainingTime / 60));
    const secs = this.formatZeroes(this.remainingTime - mins * 60);

    return `${mins}:${secs}`;
  }

  formatZeroes(number, len = 2) {
    return String(number).padStart(len, '0');
  }
}

const pomodoroApp = new PomodoroApp();
