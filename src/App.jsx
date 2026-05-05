import { useState, useEffect, useRef } from "react";
import { CASES } from "./data/cases";
import { TREAT_FX, ADVERSE_FX, TREATMENTS } from "./data/treatments";
import { CLAMP_RANGES, initPS, computeOutcome, clamp, r1 } from "./engine/patient";
import { computeScore } from "./engine/scoring";
import MenuScreen from "./screens/MenuScreen";
import GameScreen from "./screens/GameScreen";
import ResultScreen from "./screens/ResultScreen";

export default function App() {
  const [phase, setPhase] = useState("menu");
  const [cd, setCd] = useState(null);
  const [usedIds, setUsedIds] = useState([]);
  const [ps, setPs] = useState(null);
  const [prevPs, setPrevPs] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [appliedFx, setAppliedFx] = useState(new Set());
  const [pendingFx, setPendingFx] = useState(new Set());
  const [selDiag, setSelDiag] = useState([]);
  const [orderedDiag, setOrderedDiag] = useState([]);
  const [revealedResults, setRevealedResults] = useState({});
  const [newResultIds, setNewResultIds] = useState([]);
  const [selTreat, setSelTreat] = useState([]);
  const [diagText, setDiagText] = useState("");
  const [diagCat, setDiagCat] = useState("all");
  const [treatCat, setTreatCat] = useState("all");
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [processingTests, setProcessingTests] = useState(false);
  const [result, setResult] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [casesPlayed, setCasesPlayed] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [specFilter, setSpecFilter] = useState(null);
  const [showAllCases, setShowAllCases] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const timerRef = useRef(null);
  const detRef = useRef(null);
  const fxTimersRef = useRef([]);
  const timeLeftRef = useRef(0);
  const totalTimeRef = useRef(0);
  const psRef = useRef(null);
  const cdRef = useRef(null);
  const selTreatRef = useRef([]);
  const orderedDiagRef = useRef([]);
  const diagTextRef = useRef("");
  const appliedFxRef = useRef(new Set());
  const submitRef = useRef(null);

  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  useEffect(() => { totalTimeRef.current = totalTime; }, [totalTime]);
  useEffect(() => { psRef.current = ps; }, [ps]);
  useEffect(() => { cdRef.current = cd; }, [cd]);
  useEffect(() => { selTreatRef.current = selTreat; }, [selTreat]);
  useEffect(() => { orderedDiagRef.current = orderedDiag; }, [orderedDiag]);
  useEffect(() => { diagTextRef.current = diagText; }, [diagText]);
  useEffect(() => { appliedFxRef.current = appliedFx; }, [appliedFx]);

  const addEvent = (text, type = "info") => {
    const elapsed = totalTimeRef.current - timeLeftRef.current;
    const mm = Math.floor(elapsed / 60), ss = elapsed % 60;
    const timeStr = `${mm}:${String(ss).padStart(2, "0")}`;
    setEventLog(prev => [{ id: Date.now() + Math.random(), text, type, elapsed: timeStr }, ...prev.slice(0, 29)]);
  };

  const startGame = (caseId) => {
    clearInterval(timerRef.current);
    clearInterval(detRef.current);
    fxTimersRef.current.forEach(t => clearTimeout(t));
    fxTimersRef.current = [];
    const pool = usedIds.length >= CASES.length ? CASES : CASES.filter(c => !usedIds.includes(c.id));
    const chosen = caseId ? CASES.find(c => c.id === caseId) || pool[Math.floor(Math.random() * pool.length)] : pool[Math.floor(Math.random() * pool.length)];
    setCd(chosen);
    setUsedIds(prev => usedIds.length >= CASES.length ? [chosen.id] : [...prev, chosen.id]);
    const initialPS = initPS(chosen);
    setPs(initialPS);
    setPrevPs(initialPS);
    setGameOver(false);
    setAppliedFx(new Set());
    setPendingFx(new Set());
    setEventLog([{ id: 1, text: "Пациент поступил в приёмное отделение", type: "info", elapsed: "0:00" }]);
    setSelDiag([]); setOrderedDiag([]); setRevealedResults({}); setNewResultIds([]);
    setSelTreat([]); setDiagText(""); setDiagCat("all"); setTreatCat("all"); setResult(null);
    const t = chosen.timeLimit * 60;
    setTotalTime(t); setTimeLeft(t);
    totalTimeRef.current = t; timeLeftRef.current = t;
    setPhase("order_tests");
  };

  useEffect(() => {
    if (phase === "order_tests" || phase === "awaiting_results" || phase === "diagnose") {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); submitRef.current?.(true); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => {
    if (!cd || phase === "menu" || phase === "result" || gameOver) return;
    clearInterval(detRef.current);
    detRef.current = setInterval(() => {
      setPs(prev => {
        if (!prev || prev.status === "dead") return prev;
        const det = cdRef.current?.deterioration || {};
        setPrevPs({ ...prev });
        const next = {
          ...prev,
          hr:   clamp(r1(prev.hr   + (det.hr   ?? 0)), CLAMP_RANGES.hr[0],   CLAMP_RANGES.hr[1]),
          sbp:  clamp(r1(prev.sbp  + (det.sbp  ?? 0)), CLAMP_RANGES.sbp[0],  CLAMP_RANGES.sbp[1]),
          dbp:  clamp(r1(prev.dbp  + (det.dbp  ?? 0)), CLAMP_RANGES.dbp[0],  CLAMP_RANGES.dbp[1]),
          rr:   clamp(r1(prev.rr   + (det.rr   ?? 0)), CLAMP_RANGES.rr[0],   CLAMP_RANGES.rr[1]),
          spo2: clamp(r1(prev.spo2 + (det.spo2 ?? 0)), CLAMP_RANGES.spo2[0], CLAMP_RANGES.spo2[1]),
          temp: clamp(r1(prev.temp + (det.temp ?? 0)), CLAMP_RANGES.temp[0], CLAMP_RANGES.temp[1]),
          gcs:  clamp(r1(prev.gcs  + (det.gcs  ?? 0)), CLAMP_RANGES.gcs[0],  CLAMP_RANGES.gcs[1]),
          pain: clamp(r1(prev.pain + (det.pain ?? 0)), CLAMP_RANGES.pain[0], CLAMP_RANGES.pain[1]),
        };
        const dt = cdRef.current?.deathThresholds || {};
        const dead = (dt.sbp && next.sbp <= dt.sbp) || (dt.spo2 && next.spo2 <= dt.spo2) ||
                     (dt.gcs && next.gcs <= dt.gcs) || (dt.hr && next.hr >= dt.hr) || (dt.rr && next.rr <= dt.rr);
        next.status = dead ? "dead" : (next.sbp < 80 || next.spo2 < 80 || next.gcs < 8) ? "critical" : "deteriorating";
        return next;
      });
    }, 30000);
    return () => clearInterval(detRef.current);
  }, [cd, phase, gameOver]);

  useEffect(() => {
    if (!ps || ps.status !== "dead" || gameOver) return;
    setGameOver(true);
    clearInterval(timerRef.current);
    clearInterval(detRef.current);
    fxTimersRef.current.forEach(t => clearTimeout(t));
    addEvent("💀 ПАЦИЕНТ ПОГИБ — лечение не было начато вовремя", "critical");
    setTimeout(() => submitRef.current?.(false, true), 2000);
  }, [ps?.status]);

  useEffect(() => {
    if (!ps || ps.status !== "critical") return;
    addEvent("⚠ Состояние критическое! Требуются немедленные действия", "warning");
  }, [ps?.status]);

  const applyTreatEffect = (treatId) => {
    const cCase = cdRef.current;
    if (!cCase) return;
    const fx = TREAT_FX[treatId];
    const tName = TREATMENTS.find(t => t.id === treatId)?.name || treatId;
    const isWrong = cCase.wrongTreat.includes(treatId);
    const effects = isWrong ? (ADVERSE_FX[treatId] || {}) : (fx?.eff || {});
    const hasEffect = Object.keys(effects).some(k => effects[k] !== 0);
    if (!hasEffect) {
      setAppliedFx(prev => new Set([...prev, treatId]));
      setPendingFx(prev => { const n = new Set(prev); n.delete(treatId); return n; });
      return;
    }
    setPs(prev => {
      if (!prev || prev.status === "dead") return prev;
      const next = { ...prev };
      Object.entries(effects).forEach(([k, v]) => {
        if (k in next && CLAMP_RANGES[k]) next[k] = clamp(r1(next[k] + v), CLAMP_RANGES[k][0], CLAMP_RANGES[k][1]);
      });
      const dt = cCase.deathThresholds || {};
      const dead = (dt.sbp && next.sbp <= dt.sbp) || (dt.spo2 && next.spo2 <= dt.spo2) ||
                   (dt.gcs && next.gcs <= dt.gcs) || (dt.hr && next.hr >= dt.hr) || (dt.rr && next.rr <= dt.rr);
      next.status = dead ? "dead" : (next.sbp < 80 || next.spo2 < 80 || next.gcs < 8) ? "critical" :
                   (next.sbp > 100 && next.spo2 > 90 && next.gcs >= 12) ? "stable" : "deteriorating";
      return next;
    });
    if (isWrong) addEvent(`🚨 ${tName}: ОПАСНЫЙ ЭФФЕКТ — состояние ухудшилось`, "critical");
    else addEvent(`✓ ${tName}: ${fx?.desc || "эффект применён"}`, "result");
    setAppliedFx(prev => new Set([...prev, treatId]));
    setPendingFx(prev => { const n = new Set(prev); n.delete(treatId); return n; });
  };

  const toggleTreatment = (treatId) => {
    setSelTreat(prev => {
      const removing = prev.includes(treatId);
      if (removing) {
        if (appliedFxRef.current.has(treatId)) return prev;
        setPendingFx(p => { const n = new Set(p); n.delete(treatId); return n; });
        return prev.filter(x => x !== treatId);
      }
      const tName = TREATMENTS.find(t => t.id === treatId)?.name || treatId;
      addEvent(`💊 Назначен: ${tName}`, "treatment");
      const fx = TREAT_FX[treatId];
      const delayMs = Math.round(((fx?.delay || 60) / 6) * 1000);
      setPendingFx(p => new Set([...p, treatId]));
      const timer = setTimeout(() => applyTreatEffect(treatId), delayMs);
      fxTimersRef.current.push(timer);
      return [...prev, treatId];
    });
  };

  const handleOrderTests = async () => {
    if (selDiag.length === 0) return;
    setProcessingTests(true);
    setOrderedDiag(selDiag);
    setPhase("awaiting_results");
    addEvent(`Назначено ${selDiag.length} исследований`, "info");
    const ids = [...selDiag];
    for (let i = 0; i < ids.length; i++) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
      const id = ids[i];
      const text = cd.testResults[id] || `${cd.testResults[id] || id}: в пределах нормы.`;
      setRevealedResults(prev => ({ ...prev, [id]: text }));
      setNewResultIds(prev => [...prev, id]);
      const isCrit = text.startsWith("🔴");
      addEvent(`Результат: ${id}${isCrit ? " — КРИТИЧНО" : ""}`, isCrit ? "critical" : "result");
      setTimeout(() => setNewResultIds(prev => prev.filter(x => x !== id)), 2000);
    }
    setProcessingTests(false);
  };

  const handleSubmit = (timeout = false, died = false) => {
    clearInterval(timerRef.current);
    clearInterval(detRef.current);
    fxTimersRef.current.forEach(t => clearTimeout(t));
    const cCase = cdRef.current || cd;
    const cPs = psRef.current || ps;
    const cSelTreat = selTreatRef.current;
    const cOrderedDiag = orderedDiagRef.current;
    const cDiagText = diagTextRef.current;
    const cAppliedFx = appliedFxRef.current;
    if (!cCase) return;
    let finalPS = { ...(cPs || initPS(cCase)) };
    cSelTreat.forEach(treatId => {
      if (cAppliedFx.has(treatId)) return;
      const fx = TREAT_FX[treatId];
      if (!fx) return;
      const isWrong = cCase.wrongTreat.includes(treatId);
      const effects = isWrong ? (ADVERSE_FX[treatId] || {}) : fx.eff;
      Object.entries(effects).forEach(([key, val]) => {
        if (key in finalPS && CLAMP_RANGES[key]) {
          finalPS[key] = clamp(r1(finalPS[key] + val), CLAMP_RANGES[key][0], CLAMP_RANGES[key][1]);
        }
      });
    });
    const outcome = computeOutcome(finalPS);
    finalPS.status = outcome === "dead" ? "dead" : outcome === "stable" ? "stable" : finalPS.status;
    const res = computeScore(cCase, cOrderedDiag, cSelTreat, cDiagText, finalPS);
    setResult({ ...res, timeout, died });
    setPs(finalPS);
    setTotalScore(s => s + res.score);
    setCasesPlayed(c => c + 1);
    setPhase("result");
  };

  submitRef.current = handleSubmit;

  const allResultsReady = orderedDiag.length > 0 && orderedDiag.every(id => revealedResults[id]);

  // ── Routing ───────────────────────────────────────────────────────────

  if (phase === "menu") {
    return (
      <MenuScreen
        startGame={startGame}
        totalScore={totalScore}
        casesPlayed={casesPlayed}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        specFilter={specFilter} setSpecFilter={setSpecFilter}
        showAllCases={showAllCases} setShowAllCases={setShowAllCases}
        showNotif={showNotif} setShowNotif={setShowNotif}
        showSettings={showSettings} setShowSettings={setShowSettings}
      />
    );
  }

  if (phase === "result" && result && cd) {
    return (
      <ResultScreen
        result={result} cd={cd} ps={ps}
        orderedDiag={orderedDiag} selTreat={selTreat} diagText={diagText}
        eventLog={eventLog}
        setPhase={setPhase} startGame={startGame}
      />
    );
  }

  if (!cd || !ps) return null;

  return (
    <GameScreen
      phase={phase} setPhase={setPhase}
      cd={cd} ps={ps} prevPs={prevPs}
      selDiag={selDiag} setSelDiag={setSelDiag}
      selTreat={selTreat} toggleTreatment={toggleTreatment}
      orderedDiag={orderedDiag}
      revealedResults={revealedResults} newResultIds={newResultIds}
      diagText={diagText} setDiagText={setDiagText}
      diagCat={diagCat} setDiagCat={setDiagCat}
      treatCat={treatCat} setTreatCat={setTreatCat}
      appliedFx={appliedFx} pendingFx={pendingFx}
      timeLeft={timeLeft} totalTime={totalTime}
      eventLog={eventLog}
      handleOrderTests={handleOrderTests} handleSubmit={handleSubmit}
      processingTests={processingTests} allResultsReady={allResultsReady}
    />
  );
}
