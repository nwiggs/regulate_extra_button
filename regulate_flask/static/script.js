const startButton = document.getElementById('startButton');
const sideBtn = document.getElementById('sideBtn');
const phaseLabel = document.getElementById('phaseLabel');
const timerLabel = document.getElementById('timerLabel');
const breathingRing = document.getElementById('breathingRing');
const deviceLed = document.getElementById('deviceLed');
const sessionCountEl = document.getElementById('sessionCount');

let running = false;
let sessions = 0;
let stopRequested = false;

const phases = [
  { name: 'Inhale', seconds: 4, scale: 1.28, led: '#9be7e0', shadow: '0 0 24px rgba(155,231,224,0.6)' },
  { name: 'Hold In', seconds: 4, scale: 1.28, led: '#d7fff9', shadow: '0 0 26px rgba(215,255,249,0.7)' },
  { name: 'Exhale', seconds: 4, scale: 0.9, led: '#5dbab4', shadow: '0 0 18px rgba(93,186,180,0.5)' },
  { name: 'Hold Out', seconds: 4, scale: 0.9, led: '#bdedeb', shadow: '0 0 20px rgba(189,237,235,0.5)' }
];

const phaseLabels = {
  Inhale: 'Breathe In',
  'Hold In': 'Hold',
  Exhale: 'Breathe Out',
  'Hold Out': 'Pause'
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function setRing(phase) {
  breathingRing.style.transform = `scale(${phase.scale})`;

  breathingRing.style.filter =
    phase.name === 'Exhale'
      ? 'saturate(0.9) brightness(0.95)'
      : 'saturate(1.1) brightness(1.05)';

  deviceLed.style.background = phase.led;
  deviceLed.style.boxShadow = phase.shadow;
}

function setIdleState(message = 'Press the button to begin') {
  breathingRing.style.transform = 'scale(1)';
  breathingRing.style.filter = 'saturate(1) brightness(1)';
  deviceLed.style.background = 'rgba(255,255,255,0.45)';
  deviceLed.style.boxShadow = '0 0 18px rgba(109, 199, 193, 0.7)';
  phaseLabel.textContent = 'Ready';
  timerLabel.textContent = message;
  startButton.textContent = 'Regulate';
  running = false;
  stopRequested = false;
}

function setCompletedState() {
  breathingRing.style.transform = 'scale(1)';
  breathingRing.style.filter = 'saturate(1) brightness(1)';
  deviceLed.style.background = 'rgba(255,255,255,0.45)';
  deviceLed.style.boxShadow = '0 0 18px rgba(109, 199, 193, 0.7)';
  phaseLabel.textContent = 'Reset Complete';
  timerLabel.textContent = 'Nice. Press again any time.';
  startButton.textContent = 'Regulate';
  running = false;
  stopRequested = false;

  sessions += 1;
  sessionCountEl.textContent = sessions;
}

function triggerSideGlow() {
  sideBtn.classList.remove('active-press');
  void sideBtn.offsetWidth; // restart animation
  sideBtn.classList.add('active-press');

  setTimeout(() => {
    sideBtn.classList.remove('active-press');
  }, 600);
}

async function runPhase(phase, getRemainingTime) {
  phaseLabel.textContent = phaseLabels[phase.name];
  setRing(phase);

  for (let remaining = phase.seconds; remaining >= 1; remaining--) {
    if (stopRequested) return false;

    const totalRemaining = Math.max(getRemainingTime() - (phase.seconds - remaining), 0);
    timerLabel.textContent = `${phaseLabels[phase.name]} • ${formatTime(totalRemaining)}`;

    await sleep(1000);

    if (stopRequested) return false;
  }

  return true;
}

async function runSession(durationMinutes = 1) {
  if (running) return;

  running = true;
  stopRequested = false;
  startButton.textContent = 'Stop';

  if (durationMinutes === 3) {
    triggerSideGlow();
    deviceLed.style.background = '#7fb4e8';
    deviceLed.style.boxShadow = '0 0 22px rgba(127,180,232,0.65)';
  }

  const totalSessionSeconds = durationMinutes * 60;
  const cycleSeconds = phases.reduce((sum, phase) => sum + phase.seconds, 0);
  const totalCycles = Math.ceil(totalSessionSeconds / cycleSeconds);

  let elapsedSeconds = 0;

  for (let cycle = 0; cycle < totalCycles; cycle++) {
    for (const phase of phases) {
      if (stopRequested || elapsedSeconds >= totalSessionSeconds) {
        break;
      }

      const completed = await runPhase(
        phase,
        () => Math.max(totalSessionSeconds - elapsedSeconds, 0)
      );

      if (!completed || stopRequested) {
        break;
      }

      elapsedSeconds += phase.seconds;
    }

    if (stopRequested || elapsedSeconds >= totalSessionSeconds) {
      break;
    }
  }

  if (stopRequested) {
    setIdleState('Press Button to Begin');
  } else {
    setCompletedState();
  }
}

startButton.addEventListener('click', () => {
  if (running) {
    stopRequested = true;
    return;
  }

  runSession(1);
});

sideBtn.addEventListener('click', () => {
  if (running) {
    stopRequested = true;
    return;
  }

  runSession(3);
});

// initialize UI
setIdleState();