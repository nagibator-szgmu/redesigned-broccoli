import { useState } from "react";

export function useSessionState() {
  const [phase, setPhase] = useState("menu");
  const [cd, setCd] = useState(null);
  const [usedIds, setUsedIds] = useState([]);
  const [ps, setPs] = useState(null);
  const [prevPs, setPrevPs] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const [trajectory, setTrajectory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [diagText, setDiagText] = useState("");
  const [diagCat, setDiagCat] = useState("all");
  const [treatCat, setTreatCat] = useState("all");
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [result, setResult] = useState(null);
  const [paused, setPaused] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [revealedAnamnesis, setRevealedAnamnesis] = useState(new Set());

  return {
    phase, setPhase,
    cd, setCd,
    usedIds, setUsedIds,
    ps, setPs,
    prevPs, setPrevPs,
    eventLog, setEventLog,
    trajectory, setTrajectory,
    gameOver, setGameOver,
    diagText, setDiagText,
    diagCat, setDiagCat,
    treatCat, setTreatCat,
    timeLeft, setTimeLeft,
    totalTime, setTotalTime,
    result, setResult,
    paused, setPaused,
    selectedRoute, setSelectedRoute,
    revealedAnamnesis, setRevealedAnamnesis,
  };
}
