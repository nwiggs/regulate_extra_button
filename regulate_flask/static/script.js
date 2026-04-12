const startButton = document.getElementById('startButton');
const phaseLabel = document.getElementById('phaseLabel');
const timerLabel = document.getElementById('timerLabel');
const breathingRing = document.getElementById('breathingRing');
const deviceLed = document.getElementById('deviceLed');
const sessionCountEl = document.getElementById('sessionCount');

let running = false;
let sessions = 0;

const phases = [
  { name: 'Inhale', seconds: 4, scale: 1.28, led: '#9be7e0', shadow: '0 0 24px rgba(155, 231, 224, 0.85)' },
  { name: 'Hold', seconds: 4, scale: 1.28, led: '#d7fff9', shadow: '0 0 26px rgba(215, 255, 249, 0.95)' },
  { name: 'Exhale', seconds: 4, scale: 0.9, led: '#5dbab4', shadow: '0 0 18px rgba(93, 186, 180, 0.8)' },
  { name: 'Hold', seconds: 4, scale: 0.9, led: '#bddedb', shadow: '0 0 20px rgba(189, 222, 219, 0.8)' }
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setRing(phase) {
  breathingRing.style.transform = `scale(${phase.scale})`;
  breathingRing.style.filter = phase.name === 'Exhale' ? 'saturate(0.9)' : 'saturate(1.12)';
  deviceLed.style.background = phase.led;
  deviceLed.style.boxShadow = phase.shadow;
}

async function runPhase(phase) {
  phaseLabel.textContent = phase.name;
  setRing(phase);

  for (let remaining = phase.seconds; remaining >= 1; remaining--) {
    timerLabel.textContent = `${remaining}s`;
    await sleep(1000);
  }
}

async function runSession() {
  if (running) return;
  running = true;
  startButton.disabled = true;
  startButton.textContent = 'Breathing...';

  for (const phase of phases) {
    await runPhase(phase);
  }

  sessions += 1;
  sessionCountEl.textContent = sessions;
  phaseLabel.textContent = 'Reset Complete';
  timerLabel.textContent = 'Nice. Press again any time.';
  breathingRing.style.transform = 'scale(1)';
  deviceLed.style.background = 'rgba(255,255,255,0.45)';
  deviceLed.style.boxShadow = '0 0 0 rgba(109, 199, 193, 0.7)';
  startButton.disabled = false;
  startButton.textContent = 'Start Regulate';
  running = false;
}

startButton.addEventListener('click', runSession);
