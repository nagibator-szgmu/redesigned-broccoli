let flatlineOsc = null;
let flatlineGain = null;

export function getPitchForSpO2(spo2) {
  if (spo2 >= 95) return 800;
  if (spo2 >= 90) return 650;
  if (spo2 >= 85) return 520;
  if (spo2 >= 80) return 420;
  return 320;
}

export function playOximeterBeep(audioCtx, masterGain, spo2) {
  if (!audioCtx || !masterGain) return;

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const pitch = getPitchForSpO2(spo2);
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

export function startFlatlineAlarm(audioCtx, masterGain) {
  if (!audioCtx || !masterGain) return;
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

export function stopFlatlineAlarm() {
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
