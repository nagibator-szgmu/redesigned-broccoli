let audioCtx = null;
let masterGain = null;
let isMuted = false;
let masterVolume = 0.3;

export function getAudioContext() {
  return audioCtx;
}

export function getMasterGain() {
  return masterGain;
}

export function initAudio() {
  if (audioCtx) return audioCtx;
  try {
    const AudioContextClass = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : masterVolume, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  } catch (e) {
    console.error("Failed to initialize AudioContext", e);
  }
  return audioCtx;
}

export function setAudioMute(mute) {
  isMuted = mute;
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(isMuted ? 0 : masterVolume, audioCtx.currentTime);
  }
}

export function setAudioVolume(vol) {
  masterVolume = Math.max(0, Math.min(1, vol));
  if (masterGain && audioCtx && !isMuted) {
    masterGain.gain.setValueAtTime(masterVolume, audioCtx.currentTime);
  }
}

export function getAudioMuted() {
  return isMuted;
}
