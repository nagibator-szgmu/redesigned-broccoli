import { useEffect, useRef } from "react";
import { tickDeterioration, applyContinuousEffects, resolveStatus } from "../../engine/deterioration";
import { TREAT_FX } from "../../data/treatments";

export function useSessionTimers({
  stateRef,
  phase,
  paused,
  gameOver,
  setPs,
  setPrevPs,
  setGameOver,
  setTimeLeft,
  addEvent,
  onSubmit,
  timerRef,
  detRef,
  fxTimersRef,
}) {
  const submitRef = useRef(onSubmit);
  submitRef.current = onSubmit;

  // Countdown timer
  useEffect(() => {
    if (
      stateRef.current.cd?.department !== "outpatient" &&
      (phase === "order_tests" || phase === "awaiting_results" || phase === "diagnose") &&
      !stateRef.current.paused
    ) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (stateRef.current.paused) return;
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            submitRef.current?.(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [phase, paused, setTimeLeft, stateRef, timerRef]);

  // Deterioration loop
  useEffect(() => {
    const s = stateRef.current;
    if (
      s.cd?.department === "outpatient" ||
      !s.cd ||
      phase === "menu" ||
      phase === "result" ||
      gameOver ||
      s.paused
    ) {
      clearInterval(detRef.current);
      return;
    }
    const interval = s.gameMode === "stress" ? 15000 : 30000;
    const startDet = () => {
      clearInterval(detRef.current);
      detRef.current = setInterval(() => {
        if (stateRef.current.paused) return;
        setPs((prev) => {
          if (!prev || prev.status === "dead") return prev;
          setPrevPs({ ...prev });
          let next = tickDeterioration(
            prev,
            stateRef.current.cd,
            stateRef.current.difficulty,
            stateRef.current.gameMode
          );
          next = applyContinuousEffects(
            next,
            stateRef.current.selTreat.filter((id) => TREAT_FX[id]?.continuous)
          );
          next = resolveStatus(next, stateRef.current.cd);
          return next;
        });
      }, interval);
    };

    startDet();
    const onVisibility = () => {
      if (document.hidden) clearInterval(detRef.current);
      else if (!stateRef.current.paused) startDet();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(detRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [stateRef, phase, gameOver, paused, setPs, setPrevPs, detRef]);

  // Watch for death
  useEffect(() => {
    const currentStatus = stateRef.current.ps?.status;
    if (currentStatus !== "dead" || gameOver) return;
    setGameOver(true);
    clearInterval(timerRef.current);
    clearInterval(detRef.current);
    fxTimersRef.current.forEach((t) => clearTimeout(t));
    addEvent("💀 ПАЦИЕНТ ПОГИБ — лечение не было начато вовремя", "critical");
    setTimeout(() => submitRef.current?.(false, true), 2000);
  }, [stateRef.current.ps?.status, gameOver, addEvent, setGameOver, timerRef, detRef, fxTimersRef]);

  // Watch for critical
  useEffect(() => {
    if (stateRef.current.ps?.status === "critical") {
      addEvent("⚠ Состояние критическое! Требуются немедленные действия", "warning");
    }
  }, [stateRef.current.ps?.status, addEvent]);
}
