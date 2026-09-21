import {
  initAudio,
  getAudioContext,
  getMasterGain,
  setAudioMute,
  setAudioVolume,
  getAudioMuted,
} from "./audioContext.js";
import {
  playOximeterBeep,
  startFlatlineAlarm,
  stopFlatlineAlarm,
} from "./audioSynth.js";

let beepTimeout = null;
let currentHR = 80;
let currentSpO2 = 98;
let currentStatus = "alive";
let isRunning = false;

function triggerBeep() {
  const audioCtx = getAudioContext();
  const masterGain = getMasterGain();
  const isMuted = getAudioMuted();
  if (!audioCtx || isMuted || currentStatus === "dead" || !isRunning) return;
  playOximeterBeep(audioCtx, masterGain, currentSpO2);
}

function scheduleNextBeep() {
  if (beepTimeout) {
    clearTimeout(beepTimeout);
    beepTimeout = null;
  }
  if (!isRunning || currentStatus === "dead") return;

  const hr = Math.max(30, Math.min(220, currentHR));
  const intervalMs = (60 / hr) * 1000;

  triggerBeep();
  beepTimeout = setTimeout(scheduleNextBeep, intervalMs);
}

function triggerFlatline() {
  const audioCtx = getAudioContext();
  const masterGain = getMasterGain();
  const isMuted = getAudioMuted();
  if (!audioCtx || isMuted || !isRunning) return;
  startFlatlineAlarm(audioCtx, masterGain);
}

export const medicalAudio = {
  init: () => {
    const audioCtx = initAudio();
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

    stopFlatlineAlarm();

    if (currentStatus === "dead") {
      triggerFlatline();
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
        triggerFlatline();
      }
    } else {
      stopFlatlineAlarm();
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
    stopFlatlineAlarm();
  },

  setMute: (mute) => {
    setAudioMute(mute);
  },

  setVolume: (vol) => {
    setAudioVolume(vol);
  },

  getIsMuted: () => getAudioMuted(),
};
