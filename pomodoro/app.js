// Defineerime erinevate etappide ajad
const TIME = 1500;
const SHORT_BREAK = 300;
const LONG_BREAK = 600;

// Võtame DOM-ist vajalikud elemendid
const timeDisplay = document.querySelector('#timeDisplay');

const startButton = document.querySelector('#startButton');
const stopButton = document.querySelector('#stopButton');
const resetButton = document.querySelector('#resetButton');

const workButton = document.querySelector('#workButton');
const shotBreakButton = document.querySelector('#shotBreakButton');
const longBreakButton = document.querySelector('#longBreakButton');

class PomodoroApp {
  remainingTime = TIME;
  started = false;
  intervalId = undefined;
  lastChoice = undefined;

  constructor() {
    this.init();

    startButton.addEventListener('click', (e) => this.start());
    stopButton.addEventListener('click', (e) => this.stop());
    resetButton.addEventListener('click', (e) => this.reset());

    workButton.addEventListener('click', (e) => this.init(TIME));
    shotBreakButton.addEventListener('click', (e) => this.init(SHORT_BREAK));
    longBreakButton.addEventListener('click', (e) => this.init(LONG_BREAK));
  }

  init(time = TIME) {
    // Kui taimer käib, lõpetame töö
    this.stop();

    /**
     * Sätime taimeri tagasi üles
     * lastChoice on väärtus, mis seadistatakse "nullides" - põhimõtteliselt viimane valik, mis tehti
     */
    this.remainingTime = time;
    this.lastChoice = time;

    this.updateUI();
  }

  start() {
    // Kui on juba alustatud, ära tee midagi
    if (this.started) return;
    this.started = true;

    // Luba stopp-nupp ja keela start-nupp
    stopButton.disabled = false;
    startButton.disabled = true;

    // Seadistame tick meetodile 1-sekundise intervalli, mille ID salvestame, et pärast see tühistada
    this.intervalId = setInterval(this.tick.bind(this), 1000);
  }

  stop() {
    // Kui pole alustatud, ära tee midagi
    if (!this.started) return;

    // Tühistab IDga, mille eelnevalt seadistas, intervalli ja paneb selle igaks juhuks defineerimata olekusse
    clearInterval(this.intervalId);
    this.intervalId = undefined;

    // Lubab start-nupu, keelab stop-nupu
    stopButton.disabled = true;
    startButton.disabled = false;

    this.started = false;
  }

  reset() {
    // Nullime viimase valikuga
    this.init(this.lastChoice);
  }

  tick() {
    // Iga käiguga eemaldame taimerist 1 sekundi
    this.remainingTime -= 1;

    // Uuendame kasutajaliidest
    this.updateUI();

    // Kui jõuame sekunditega nulli, lõpetame töö
    if (this.remainingTime === 0) this.stop();
  }

  updateUI() {
    // Kujundame jäänud aja
    const formattedRemainingTime = this.formatRemainingTime();

    // Paneme järelejäänud aja kasutajaliidesesse ja ka aknatiitlisse
    timeDisplay.textContent = formattedRemainingTime;
    document.title = `${formattedRemainingTime} - Pomodoro taimer`;
  }

  formatRemainingTime() {
    // Lihtne valem sekundite minutiteks ja sekunditeks tegemiseks
    const mins = this.formatZeroes(Math.floor(this.remainingTime / 60));
    const secs = this.formatZeroes(this.remainingTime - mins * 60);

    return `${mins}:${secs}`;
  }

  formatZeroes(number, len = 2) {
    // Kujundame nullid nii, et ühekohalised numbrid algaksid nulliga
    return String(number).padStart(len, '0');
  }
}

// Loome uue PomodoroApp-i, et loogikat kasutada
const pomodoroApp = new PomodoroApp();
