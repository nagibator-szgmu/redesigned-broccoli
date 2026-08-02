import { useEffect } from "react";
import { medicalAudio } from "../engine/audio";

/**
 * Hook to synchronize medical audio signals with current game states.
 * 
 * @param {string} phase - current app phase ("menu", "game", "result", etc.)
 * @param {boolean} paused - game pause state
 * @param {string} department - current department ("icu", "admission", "outpatient", "stationary")
 * @param {Object} ps - current patient state
 */
export default function useGameAudio(phase, paused, department, ps, audioEnabled) {
  const isPlayingEmergency =
    phase !== "menu" &&
    phase !== "result" &&
    phase !== "theory" &&
    phase !== "leaderboard" &&
    phase !== "certificates" &&
    (department === "icu" || department === "admission");

  const hr = ps?.hr ?? 80;
  const spo2 = ps?.spo2 ?? 98;
  const status = ps?.status ?? "alive";

  useEffect(() => {
    medicalAudio.setMute(!audioEnabled);
  }, [audioEnabled]);

  useEffect(() => {
    // Enable audio contexts on first interaction
    const clickHandler = () => {
      medicalAudio.init();
    };
    window.addEventListener("click", clickHandler);
    window.addEventListener("touchstart", clickHandler);
    return () => {
      window.removeEventListener("click", clickHandler);
      window.removeEventListener("touchstart", clickHandler);
    };
  }, []);

  useEffect(() => {
    if (isPlayingEmergency && !paused) {
      medicalAudio.start(hr, spo2, status);
    } else {
      medicalAudio.stop();
    }

    return () => {
      medicalAudio.stop();
    };
  }, [isPlayingEmergency, paused]);

  useEffect(() => {
    if (isPlayingEmergency && !paused) {
      medicalAudio.update(hr, spo2, status);
    }
  }, [hr, spo2, status, isPlayingEmergency, paused]);
}
