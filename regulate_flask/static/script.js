const startButton = document.getElementById('startButton');
const sideBtn = document.getElementById('sideBtn');
const phaseLabel = document.getElementById('phaseLabel');
const timerLabel = document.getElementById('timerLabel');
const breathingRing = document.getElementById('breathingRing');
const deviceLed = document.getElementById('deviceLed');
const sessionCountEl = document.getElementById('sessionCount');

let running = false;
let sessions = 0;

const phases = [
  { name: 'Inhale', seconds: 4, scale: 1.28, led: '#9be7e0', shadow: '0 0 24px rgba(155,231,224,0.6)' },
  { name: 'Hold In', seconds: 4, scale: 1.28, led: '#d7fff9', shadow: '0 0 26px rgba(215,255,249,0.7)' },
  { name: 'Exhale', seconds: 4, scale: 0.9, led: '#5dbab4', shadow: '0 0 18px rgba(93,186,180,0.5)' },
  { name: 'Hold Out', seconds: 4, scale: 0.9, led: '#bdedeb', shadow: '0 0 20px rgba(189,237,235,0.5)' }
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

async function runPhase(phase) {
  const phaseLabels = {
    'Inhale': 'Breathe In',
    'Hold In': 'Hold',
    'Exhale': 'Breathe Out',
    'Hold Out': 'Pause'
  };

  phaseLabel.textContent = phaseLabels[phase.name];
  setRing(phase);

  for (let remaining = phase.seconds; remaining >= 1; remaining--) {
    timerLabel.textContent = `${remaining}s`;
    await sleep(1000);
  }
}

async function runSession(durationMinutes = 1) {
  if (running) return;

  running = true;
  startButton.disabled = true;
  sideBtn.disabled = true;
  startButton.textContent = 'Breathing...';

  const totalSessionMs = durationMinutes * 60 * 1000;
  const cycleMs = phases.reduce((sum, phase) => sum + (phase.seconds * 1000), 0);
  const totalCycles = Math.ceil(totalSessionMs / cycleMs);

  for (let cycle = 0; cycle < totalCycles; cycle++) {
    for (const phase of phases) {
      await runPhase(phase);
    }
  }

  sessions += 1;
  sessionCountEl.textContent = sessions;
  phaseLabel.textContent = 'Reset Complete';
  timerLabel.textContent = 'Nice. Press again any time.';
  breathingRing.style.transform = 'scale(1)';
  deviceLed.style.background = 'rgba(255,255,255,0.45)';
  deviceLed.style.boxShadow = '0 0 0 rgba(109, 199, 193, 0.7)';
  startButton.disabled = false;
  sideBtn.disabled = false;
  startButton.textContent = 'Start Regulate';
  running = false;
}

startButton.addEventListener('click', () => runSession(1));
sideBtn.addEventListener('click', () => runSession(3));