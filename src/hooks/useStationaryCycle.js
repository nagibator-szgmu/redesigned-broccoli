import { useState, useCallback, useRef } from "react";
import { computeSeverity } from "../engine/severity";

/**
 * Manages day-by-day cycle for stationary department.
 * Tracks current day, applies treatment effects at day end, checks discharge.
 */
export default function useStationaryCycle(cd) {
  const [currentDay, setCurrentDay] = useState(0);
  const [dayVitals, setDayVitals] = useState(null);
  const [dayHistory, setDayHistory] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [isDischarged, setIsDischarged] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const dayPlan = cd?.dayByDayPlan || [];
  const maxDays = cd?.maxDays || 7;
  const dischargeCriteria = cd?.dischargeCriteria || [];
  const dayRef = useRef(0);

  const morningInfo = dayPlan[currentDay] || null;

  const selectTreatment = useCallback((treatId) => {
    setTreatments(prev => prev.includes(treatId) ? prev : [...prev, treatId]);
  }, []);

  const deselectTreatment = useCallback((treatId) => {
    setTreatments(prev => prev.filter(id => id !== treatId));
  }, []);

  const checkDischarge = useCallback((vitals) => {
    if (!dischargeCriteria.length || !vitals) return false;
    const tempOk = vitals.temp < 37;
    const spo2Ok = vitals.spo2 > 94;
    const hrOk = vitals.hr > 50 && vitals.hr < 100;
    const sbpOk = vitals.sbp > 100;
    return tempOk && spo2Ok && hrOk && sbpOk;
  }, [dischargeCriteria]);

  const endDay = useCallback((currentPs) => {
    const day = dayRef.current;
    const nextDay = day + 1;
    const entry = { day: day + 1, treatments: [...treatments], vitals: { ...currentPs } };
    setDayHistory(prev => [...prev, entry]);

    let nextPs = { ...currentPs };
    if (cd?.deterioration) {
      const d = cd.deterioration;
      nextPs = {
        ...nextPs,
        hr: Math.max(30, Math.min(200, nextPs.hr + (d.hr || 0) * 2)),
        sbp: Math.max(40, Math.min(300, nextPs.sbp + (d.sbp || 0) * 2)),
        rr: Math.max(2, Math.min(60, nextPs.rr + (d.rr || 0) * 2)),
        spo2: Math.max(50, Math.min(100, nextPs.spo2 + (d.spo2 || 0) * 2)),
        temp: Math.max(30, Math.min(44, nextPs.temp + (d.temp || 0) * 2)),
        gcs: Math.max(3, Math.min(15, nextPs.gcs + (d.gcs || 0) * 2)),
      };
      if (nextPs.sbp <= (cd.deathThresholds?.sbp || 60) || nextPs.spo2 <= (cd.deathThresholds?.spo2 || 65) || nextPs.gcs <= (cd.deathThresholds?.gcs || 4)) {
        nextPs.status = "dead";
      } else if (nextPs.sbp < 90 || nextPs.spo2 < 90 || nextPs.gcs < 10) {
        nextPs.status = "critical";
      } else if (nextPs.sbp >= 100 && nextPs.spo2 >= 94 && nextPs.gcs >= 14) {
        nextPs.status = "stable";
      } else {
        nextPs.status = "deteriorating";
      }
    }
    setDayVitals(nextPs);
    setTreatments([]);
    dayRef.current = nextDay;
    setCurrentDay(nextDay);

    if (nextPs.status === "dead") {
      setOutcome("dead");
      return { ps: nextPs, gameOver: true, outcome: "dead" };
    }
    const severity = computeSeverity(nextPs);
    if (severity.total >= 10) {
      setOutcome("transferToICU");
      return { ps: nextPs, gameOver: true, outcome: "transferToICU", severity: severity.label };
    }
    if (checkDischarge(nextPs)) {
      setIsDischarged(true);
      setOutcome("discharge");
      return { ps: nextPs, gameOver: true, outcome: "discharge" };
    }
    if (nextDay >= maxDays) {
      setOutcome("max_days");
      return { ps: nextPs, gameOver: true, outcome: "max_days" };
    }
    return { ps: nextPs, gameOver: false, outcome: null };
  }, [cd, treatments, maxDays, checkDischarge]);

  return {
    currentDay, dayVitals, setDayVitals, dayHistory,
    treatments, selectTreatment, deselectTreatment,
    morningInfo, isDischarged, outcome, maxDays,
    dischargeCriteria, endDay,
  };
}
