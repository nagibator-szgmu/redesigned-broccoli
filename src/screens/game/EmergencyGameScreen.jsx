import { useState, useEffect } from "react";
import { getTopicsForCase } from "../../data/topics";
import useIsMobile from "../../hooks/useIsMobile";
import MobileEmergencyLayout from "./MobileEmergencyLayout";
import DesktopEmergencyLayout from "./DesktopEmergencyLayout";

export default function EmergencyGameScreen({
  phase, setPhase, cd, ps, prevPs,
  trajectory, recordTrajectoryCheckpoint,
  selDiag, setSelDiag, selTreat, toggleTreatment,
  orderedDiag, revealedResults, newResultIds,
  diagText, setDiagText,
  diagCat, setDiagCat, treatCat, setTreatCat,
  appliedFx, pendingFx,
  timeLeft, totalTime,
  eventLog,
  handleOrderTests, handleSubmit,
  processingTests, allResultsReady,
  learningMode, paused, setPaused,
  selectedRoute, setSelectedRoute, setExtraResult,
  setRevealedAnamnesis,
  audioEnabled, setAudioEnabled,
  addEvent,
}) {
  const isMobile = useIsMobile();
  const [mobileTab, setMobileTab] = useState("main");
  const [showTheory, setShowTheory] = useState(false);
  const [learningTip, setLearningTip] = useState(null);
  const [activeTheoryTopic, setActiveTheoryTopic] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [notifiedVitals, setNotifiedVitals] = useState({ spo2: false, sbp: false, hr: false });

  useEffect(() => {
    if (!learningMode || !ps) return;

    let newTip = null;
    const nextNotified = { ...notifiedVitals };

    if (ps.spo2 < 90 && !notifiedVitals.spo2) {
      newTip = `👨‍⚕️ Наставник: Сатурация упала ниже 90% (${ps.spo2}%). Дайте кислород маской (oxygen_mask) или выполните интубацию трахеи.`;
      nextNotified.spo2 = true;
    } else if (ps.spo2 >= 92 && notifiedVitals.spo2) {
      nextNotified.spo2 = false;
    }

    if (ps.sbp < 90 && !notifiedVitals.sbp) {
      newTip = `👨‍⚕️ Наставник: Давление критически низкое (${ps.sbp} мм рт.ст.). Начните болюсное введение кристаллоидов (fluids) или подключите норадреналин (norepinephrine).`;
      nextNotified.sbp = true;
    } else if (ps.sbp >= 100 && notifiedVitals.sbp) {
      nextNotified.sbp = false;
    }

    if (ps.hr > 120 && !notifiedVitals.hr) {
      newTip = `👨‍⚕️ Наставник: Выраженная тахикардия (${ps.hr} уд/мин). Обязательно назначьте ЭКГ (ecg) для оценки ритма.`;
      nextNotified.hr = true;
    } else if (ps.hr <= 100 && notifiedVitals.hr) {
      nextNotified.hr = false;
    }

    if (newTip) {
      setLearningTip(newTip);
      setNotifiedVitals(nextNotified);
      const t = setTimeout(() => setLearningTip(null), 7000);
      return () => clearTimeout(t);
    }
  }, [ps?.spo2, ps?.sbp, ps?.hr, learningMode]);



  const relatedTopics = getTopicsForCase(cd.id);

  const handleRevealAnamnesis = (type) => {
    setRevealedAnamnesis(prev => new Set([...prev, type]));
  };

  useEffect(() => {
    if (!learningMode || !cd) return;
    const tip = cd.sourceReference ? `${cd.sourceReference.name} (${cd.sourceReference.year})` : null;
    if (tip) setLearningTip(tip);
    const timer = setTimeout(() => setLearningTip(null), 4000);
    return () => clearTimeout(timer);
  }, [appliedFx.size, learningMode, cd]);

  const shared = {
    cd, ps, prevPs, phase, setPhase, selDiag, setSelDiag, selTreat, toggleTreatment,
    orderedDiag, revealedResults, newResultIds, diagText, setDiagText,
    diagCat, setDiagCat, treatCat, setTreatCat, appliedFx, pendingFx,
    timeLeft, totalTime, eventLog, handleOrderTests, handleSubmit,
    processingTests, allResultsReady, learningMode, paused, setPaused,
    showTheory, setShowTheory, relatedTopics, activeTheoryTopic, setActiveTheoryTopic,
    learningTip, showInfo, setShowInfo, mobileTab, setMobileTab,
    selectedRoute, setSelectedRoute, setExtraResult,
    handleRevealAnamnesis,
    audioEnabled, setAudioEnabled,
    trajectory, recordTrajectoryCheckpoint,
    addEvent,
  };

  if (isMobile) return <MobileEmergencyLayout {...shared} />;
  return <DesktopEmergencyLayout {...shared} />;
}
