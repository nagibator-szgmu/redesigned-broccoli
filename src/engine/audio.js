let audioCtx = null;
let masterGain = null;
let beepTimeout = null;
let flatlineOsc = null;
let flatlineGain = null;

let currentHR = 80;
let currentSpO2 = 98;
let currentStatus = "alive";
let isMuted = false;
let masterVolume = 0.3;
let isRunning = false;

function initAudio() {
  if (audioCtx) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : masterVolume, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  } catch (e) {
    console.error("Failed to initialize AudioContext", e);
  }
}

function getPitchForSpO2(spo2) {
  if (spo2 >= 95) return 800;
  if (spo2 >= 90) return 650;
  if (spo2 >= 85) return 520;
  if (spo2 >= 80) return 420;
  return 320;
}

function playBeep() {
  if (!audioCtx || isMuted || currentStatus === "dead" || !isRunning) return;

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const pitch = getPitchForSpO2(currentSpO2);
  const duration = 0.12; // 120ms beep
  const time = audioCtx.currentTime;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(masterGain);

    osc.type = "sine";
    osc.frequency.setValueAtTime(pitch, time);

    // Fade-in/out to prevent speaker pops/clicks
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(1.0, time + 0.01);
    gain.gain.setValueAtTime(1.0, time + duration - 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.start(time);
    osc.stop(time + duration);
  } catch {
    /* ignore context errors */
  }
}

function scheduleNextBeep() {
  if (beepTimeout) {
    clearTimeout(beepTimeout);
    beepTimeout = null;
  }
  if (!isRunning || currentStatus === "dead") return;

  const hr = Math.max(30, Math.min(220, currentHR));
  const intervalMs = (60 / hr) * 1000;

  playBeep();
  beepTimeout = setTimeout(scheduleNextBeep, intervalMs);
}

function startFlatline() {
  if (!audioCtx || isMuted || !isRunning) return;
  if (flatlineOsc) return;

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  try {
    flatlineOsc = audioCtx.createOscillator();
    flatlineGain = audioCtx.createGain();

    flatlineOsc.connect(flatlineGain);
    flatlineGain.connect(masterGain);

    flatlineOsc.type = "sine";
    flatlineOsc.frequency.setValueAtTime(280, audioCtx.currentTime); // Low alarm tone

    flatlineGain.gain.setValueAtTime(0, audioCtx.currentTime);
    flatlineGain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.1);

    flatlineOsc.start();
  } catch {
    /* ignore */
  }
}

function stopFlatline() {
  if (flatlineOsc) {
    try {
      flatlineOsc.stop();
      flatlineOsc.disconnect();
    } catch {
      /* ignore */
    }
    flatlineOsc = null;
    flatlineGain = null;
  }
}

export const medicalAudio = {
  init: () => {
    initAudio();
    // Attempt resume on direct user click/touch
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
  },

  start: (hr, spo2, status) => {
    initAudio();
    currentHR = hr;
    currentSpO2 = spo2;
    currentStatus = status;
    isRunning = true;

    stopFlatline();

    if (currentStatus === "dead") {
      startFlatline();
    } else {
      scheduleNextBeep();
    }
  },

  update: (hr, spo2, status) => {
    currentHR = hr;
    currentSpO2 = spo2;
    const oldStatus = currentStatus;
    currentStatus = status;

    if (!isRunning) return;

    if (currentStatus === "dead") {
      if (beepTimeout) {
        clearTimeout(beepTimeout);
        beepTimeout = null;
      }
      if (oldStatus !== "dead") {
        startFlatline();
      }
    } else {
      stopFlatline();
      // If we recovered from dead (shouldn't happen in normal ICU, but just in case)
      if (oldStatus === "dead" && !beepTimeout) {
        scheduleNextBeep();
      }
    }
  },

  stop: () => {
    isRunning = false;
    if (beepTimeout) {
      clearTimeout(beepTimeout);
      beepTimeout = null;
    }
    stopFlatline();
  },

  setMute: (mute) => {
    isMuted = mute;
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(isMuted ? 0 : masterVolume, audioCtx.currentTime);
    }
  },

  setVolume: (vol) => {
    masterVolume = Math.max(0, Math.min(1, vol));
    if (masterGain && audioCtx && !isMuted) {
      masterGain.gain.setValueAtTime(masterVolume, audioCtx.currentTime);
    }
  },

  getIsMuted: () => isMuted,
};
