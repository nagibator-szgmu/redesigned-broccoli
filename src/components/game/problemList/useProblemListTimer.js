import { useState, useEffect, useRef } from "react";

export function useProblemListTimer(patientId) {
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "unlocked"
  const [timeLeft, setTimeLeft] = useState(15);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  // Сброс состояния при смене пациента
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus("idle");
    setTimeLeft(15);
    setProgress(0);
  }, [patientId]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startLoading = () => {
    if (status !== "idle") return;
    setStatus("loading");
    setTimeLeft(15);
    setProgress(0);

    const totalDurationMs = 15000;
    const intervalMs = 100;
    let elapsedMs = 0;

    timerRef.current = setInterval(() => {
      elapsedMs += intervalMs;
      const pct = Math.min(100, (elapsedMs / totalDurationMs) * 100);
      const remainingSec = Math.max(0, Math.ceil((totalDurationMs - elapsedMs) / 1000));

      setProgress(pct);
      setTimeLeft(remainingSec);

      if (elapsedMs >= totalDurationMs) {
        clearInterval(timerRef.current);
        setStatus("unlocked");
      }
    }, intervalMs);
  };

  return {
    status,
    timeLeft,
    progress,
    startLoading,
  };
}
