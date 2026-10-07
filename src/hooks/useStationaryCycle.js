import { useState, useCallback, useRef } from "react";
import { computeSeverity } from "../engine/severity.js";
import { calculateNextDayVitals } from "./stationary/vitalsProgression.js";
import { getDynamicTestResult, sanitizeMorningText } from "./stationary/dynamicTestResults.js";

/**
 * Manages comprehensive day-by-day cycle for stationary department.
 * Tracks daily treatments, dynamic test results, clinical recovery and discharge.
 */
export default function useStationaryCycle(cd, initialPs) {
  const [currentDay, setCurrentDay] = useState(0);
  const [dayVitals, setDayVitals] = useState(initialPs || null);
  const [dayHistory, setDayHistory] = useState([]);
  const [dailyTreatments, setDailyTreatments] = useState([]);
  const [testsByDay, setTestsByDay] = useState({});
  const [allTreatments, setAllTreatments] = useState(new Set());
  const [allOrders, setAllOrders] = useState(new Set());
  const [isDischarged, setIsDischarged] = useState(false);
  const [outcome, setOutcome] = useState(null);

  const dayPlan = cd?.dayByDayPlan || [];
  const maxDays = cd?.maxDays || 7;
  const dischargeCriteria = cd?.dischargeCriteria || [];
  const dayRef = useRef(0);
  dayRef.current = currentDay;
  const dayHistoryRef = useRef([]);
  dayHistoryRef.current = dayHistory;

  const rawMorning = dayPlan[currentDay]?.morningStatus || dayPlan[currentDay]?.morning || "";
  const morningInfo = dayPlan[currentDay]
    ? { ...dayPlan[currentDay], morning: sanitizeMorningText(rawMorning) }
    : null;

  const toggleTreatment = useCallback((treatId) => {
    setDailyTreatments(prev => {
      const next = prev.includes(treatId) ? prev.filter(id => id !== treatId) : [...prev, treatId];
      return next;
    });
  }, []);

  const orderDailyTests = useCallback((testIds = [], activeTreatments) => {
    const dayIdx = dayRef.current;
    const dayResults = {};
    const treats = Array.isArray(activeTreatments) ? activeTreatments : dailyTreatments;
    testIds.forEach(id => {
      dayResults[id] = getDynamicTestResult(cd, id, dayIdx, treats);
    });
    setTestsByDay(prev => ({
      ...prev,
      [dayIdx]: { ...(prev[dayIdx] || {}), ...dayResults },
    }));
    setAllOrders(prev => new Set([...prev, ...testIds]));
    return dayResults;
  }, [cd, dailyTreatments]);

  const checkDischarge = useCallback((vitals) => {
    if (!dischargeCriteria.length || !vitals) return false;
    const tempOk = vitals.temp < 37.1;
    const spo2Ok = vitals.spo2 >= 95;
    const hrOk = vitals.hr >= 50 && vitals.hr <= 95;
    const sbpOk = vitals.sbp >= 100 && vitals.sbp <= 140;

    const requiresCrp = dischargeCriteria.some(c => /СРБ|CRP/i.test(c));
    const crpOk = !requiresCrp || allOrders.has("crp");

    return tempOk && spo2Ok && hrOk && sbpOk && crpOk;
  }, [dischargeCriteria, allOrders]);

  const endDay = useCallback((currentPs, activeTreatments) => {
    const day = dayRef.current;
    const nextDay = day + 1;
    const treats = Array.isArray(activeTreatments) ? activeTreatments : dailyTreatments;
    setDailyTreatments(treats);

    const currentDayTests = Object.keys(testsByDay[day] || {});
    if (currentDayTests.length > 0) {
      const refreshedResults = {};
      currentDayTests.forEach(id => {
        refreshedResults[id] = getDynamicTestResult(cd, id, day, treats);
      });
      setTestsByDay(prev => ({
        ...prev,
        [day]: { ...(prev[day] || {}), ...refreshedResults },
      }));
    }

    const entry = {
      day: day + 1,
      treatments: [...treats],
      tests: currentDayTests,
      vitals: { ...currentPs },
      morningNote: morningInfo?.morning || "",
    };
    const nextHistory = [...dayHistoryRef.current, entry];
    dayHistoryRef.current = nextHistory;
    setDayHistory(nextHistory);
    setAllTreatments(prev => new Set([...prev, ...treats]));

    const nextPs = calculateNextDayVitals(currentPs, cd, nextDay, treats);
    setDayVitals(nextPs);
    setCurrentDay(nextDay);

    if (nextPs.status === "dead") {
      setOutcome("dead");
      return { ps: nextPs, gameOver: true, outcome: "dead", dayHistory: nextHistory };
    }
    const severity = computeSeverity(nextPs);
    if (severity.total >= 10) {
      setOutcome("transferToICU");
      return { ps: nextPs, gameOver: true, outcome: "transferToICU", severity: severity.label, dayHistory: nextHistory };
    }
    if (checkDischarge(nextPs)) {
      setIsDischarged(true);
      setOutcome("discharge");
      return { ps: nextPs, gameOver: true, outcome: "discharge", dayHistory: nextHistory };
    }
    if (nextDay >= maxDays) {
      setOutcome("max_days");
      return { ps: nextPs, gameOver: true, outcome: "max_days", dayHistory: nextHistory };
    }
    return { ps: nextPs, gameOver: false, outcome: null, dayHistory: nextHistory };
  }, [cd, dailyTreatments, testsByDay, morningInfo, maxDays, checkDischarge]);

  return {
    cd, currentDay, dayVitals, setDayVitals, dayHistory,
    dailyTreatments, toggleTreatment, orderDailyTests,
    testsByDay, allTreatments, allOrders,
    morningInfo, isDischarged, outcome, maxDays,
    dischargeCriteria, endDay,
  };
}
