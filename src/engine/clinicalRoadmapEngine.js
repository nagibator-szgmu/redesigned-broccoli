import { DIAGNOSTICS } from "../data/diagnostics.js";
import { TREATMENTS } from "../data/treatments.js";
import { matchDiagnosisFuzzy } from "../lib/stringMatcher.js";

/**
 * Clinical Roadmap Engine for Case Debriefing.
 * Builds structured step-by-step guideline verification across 6 mandatory stages:
 * 1. Сбор анамнеза и жалоб (Anamnesis)
 * 2. Физикальный осмотр и ABCDE (Examination)
 * 3. Лабораторно-инструментальная диагностика (Diagnostics)
 * 4. Клинический диагноз по КР (Diagnosis)
 * 5. Фармакотерапия и неотложные манипуляции (Treatment)
 * 6. Маршрутизация и исход (Routing & Disposition)
 */
export function buildClinicalRoadmap({
  cd,
  selTreat = [],
  selDiag = [],
  revealedResults = {},
  revealedAnamnesis = new Set(),
  diagText = "",
  extraResult = null,
  trajectory = [],
}) {
  if (!cd) return [];

  const sourceRef = cd.sourceReference
    ? `${cd.sourceReference.name}${cd.sourceReference.year ? ` (${cd.sourceReference.year})` : ""}`
    : "Клинические рекомендации Минздрава РФ";

  // --- 1. АНАМНЕЗ ---
  const rev = revealedAnamnesis instanceof Set ? revealedAnamnesis : new Set(revealedAnamnesis || []);
  const hasHistory = cd.shortHistory || cd.historyOfIllness || cd.anamnesis;
  const isAnamnesisDone = rev.size > 0 || rev.has("shortHistory") || rev.has("complaints") || rev.has("historyOfIllness") || (trajectory && trajectory.length > 1);

  const anamnesisStage = {
    id: "anamnesis",
    stepNumber: 1,
    title: "1. Сбор жалоб и анамнеза заболевания",
    icon: "📋",
    status: isAnamnesisDone ? "done" : "missed",
    statusLabel: isAnamnesisDone ? "Выполнено (хорошо)" : "Не выполнено (пропущено)",
    statusColor: isAnamnesisDone ? "green" : "red",
    krReference: `${sourceRef} · Раздел 1. Жалобы и анамнез`,
    rationale: `Согласно клиническим рекомендациям, сбор детального анамнеза (время манифестации, провоцирующие факторы, сопутствующая терапия) является ключом к стратификации неотложного состояния. Жалоба пациента: «${cd.complaint || "острое ухудшение состояния"}».`,
    items: [
      {
        name: "Выяснение анамнеза и триггеров",
        done: isAnamnesisDone,
        detail: hasHistory ? (cd.shortHistory || cd.historyOfIllness || cd.anamnesis) : "Анамнез со слов бригады СМП / сопровождающих",
        krStatus: isAnamnesisDone ? "success" : "danger",
      }
    ]
  };

  // --- 2. ОСМОТР ---
  const hasVitalsCheck = true; // Telemetry monitor is active from t=0
  const examStage = {
    id: "exam",
    stepNumber: 2,
    title: "2. Физикальный осмотр и витальный мониторинг",
    icon: "🩺",
    status: hasVitalsCheck ? "done" : "missed",
    statusLabel: "Выполнено (хорошо)",
    statusColor: "green",
    krReference: `${sourceRef} · Раздел 2. Физикальное обследование`,
    rationale: `Оценка проходимости дыхательных путей, паттерна дыхания (ЧДД ${cd.vitals?.rr || 18}), гемодинамики (АД ${cd.vitals?.bp || "---/---"}, ЧСС ${cd.vitals?.hr || 80}) и сознания (ШКГ ${cd.vitals?.gcs || 15}) по протоколу ABCDE.`,
    items: [
      {
        name: "Физикальный статус при поступлении",
        done: true,
        detail: cd.exam || `АД ${cd.vitals?.bp || "---/---"}, ЧСС ${cd.vitals?.hr || 80}, SpO2 ${cd.vitals?.spo2 || 98}%`,
        krStatus: "success",
      }
    ]
  };

  // --- 3. ИССЛЕДОВАНИЯ ---
  const needDiag = cd.needDiag || [];
  const orderedSet = new Set(selDiag || []);
  const diagItems = needDiag.map(testId => {
    const diagDef = DIAGNOSTICS.find(d => d.id === testId) || { id: testId, name: testId };
    const done = orderedSet.has(testId);
    return {
      id: testId,
      name: diagDef.name,
      done,
      krStatus: done ? "success" : "danger",
      resultText: revealedResults[testId] || (cd.testResults && cd.testResults[testId]) || "В пределах нормы",
      rationale: `Обязательный диагностический критерий стандарта: ${diagDef.name}.`
    };
  });

  const diagDoneCount = diagItems.filter(i => i.done).length;
  const isDiagFullyDone = diagItems.length > 0 && diagDoneCount === diagItems.length;
  const isDiagPartial = diagDoneCount > 0 && !isDiagFullyDone;

  const diagnosticsStage = {
    id: "diagnostics",
    stepNumber: 3,
    title: "3. Лабораторная и инструментальная диагностика",
    icon: "🔬",
    status: isDiagFullyDone ? "done" : isDiagPartial ? "partial" : "missed",
    statusLabel: isDiagFullyDone
      ? "Выполнено полностью (хорошо)"
      : isDiagPartial
      ? `Выполнено частично (${diagDoneCount}/${diagItems.length})`
      : "Не выполнено (пропущено)",
    statusColor: isDiagFullyDone ? "green" : isDiagPartial ? "yellow" : "red",
    krReference: `${sourceRef} · Раздел 3. Диагностика`,
    rationale: `Клинические рекомендации предписывают обязательное выполнение ${diagItems.length} ключевых исследований для верификации диагноза и исключения жизнеугрожающих состояний.`,
    items: diagItems
  };

  // --- 4. ДИАГНОЗ ---
  const matchRatio = matchDiagnosisFuzzy(cd.diagnosis, diagText);
  const isDiagCorrect = matchRatio >= 0.5;

  let userEnteredSummary = diagText;
  if (typeof diagText === "string" && diagText.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(diagText);
      userEnteredSummary = parsed.main || diagText;
    } catch {
      // keep raw
    }
  }

  const diagnosisStage = {
    id: "diagnosis",
    stepNumber: 4,
    title: "4. Постановка клинического диагноза по КР",
    icon: "📝",
    status: isDiagCorrect ? "done" : "missed",
    statusLabel: isDiagCorrect ? "Диагноз верен (хорошо)" : "Диагноз ошибочен / не поставлен",
    statusColor: isDiagCorrect ? "green" : "red",
    krReference: `${sourceRef} · Раздел 4. Формулировка диагноза`,
    rationale: `Эталонный диагноз по клиническим рекомендациям: «${cd.diagnosis}».`,
    items: [
      {
        name: "Соответствие клинической нозологии",
        done: isDiagCorrect,
        detail: `Ваш ответ: «${userEnteredSummary || "(не введен)"}» → Эталон: «${cd.diagnosis}»`,
        krStatus: isDiagCorrect ? "success" : "danger",
      }
    ]
  };

  // --- 5. ЛЕЧЕНИЕ ---
  const needTreat = cd.needTreat || [];
  const wrongTreat = cd.wrongTreat || [];
  const contraindicatedTreat = cd.contraindicatedTreat || [];
  const allBadTreat = [...new Set([...wrongTreat, ...contraindicatedTreat])];

  const selTreatSet = new Set(selTreat || []);
  const treatItems = [];

  // Required treatments
  needTreat.forEach(tId => {
    const tDef = TREATMENTS.find(t => t.id === tId) || { id: tId, name: tId };
    const done = selTreatSet.has(tId);
    treatItems.push({
      id: tId,
      name: tDef.name,
      type: "required",
      done,
      krStatus: done ? "success" : "danger",
      rationale: `Показано по КР: препарат/манипуляция первой линии при данной патологии.`
    });
  });

  // Contraindicated / wrong treatments applied
  allBadTreat.forEach(tId => {
    if (selTreatSet.has(tId)) {
      const tDef = TREATMENTS.find(t => t.id === tId) || { id: tId, name: tId };
      treatItems.push({
        id: tId,
        name: tDef.name,
        type: "contraindicated",
        done: false,
        krStatus: "critical_danger",
        rationale: `🚨 ПРОТИВОПОКАЗАНО по КР: применение ухудшает прогноз или несет риск летального исхода!`
      });
    }
  });

  const requiredTreatCount = treatItems.filter(i => i.type === "required").length;
  const doneTreatCount = treatItems.filter(i => i.type === "required" && i.done).length;
  const hasAppliedBadTreat = treatItems.some(i => i.type === "contraindicated");

  const isTreatFullyDone = !hasAppliedBadTreat && requiredTreatCount > 0 && doneTreatCount === requiredTreatCount;
  const isTreatPartial = !hasAppliedBadTreat && doneTreatCount > 0 && doneTreatCount < requiredTreatCount;

  const treatmentStage = {
    id: "treatment",
    stepNumber: 5,
    title: "5. Фармакотерапия и экстренные вмешательства",
    icon: "💊",
    status: isTreatFullyDone ? "done" : isTreatPartial ? "partial" : "missed",
    statusLabel: isTreatFullyDone
      ? "Выполнено корректно (хорошо)"
      : hasAppliedBadTreat
      ? "Критическая ошибка (назначено противопоказанное лечение)"
      : isTreatPartial
      ? `Выполнено частично (${doneTreatCount}/${requiredTreatCount})`
      : "Не выполнено / пропущено лечение",
    statusColor: isTreatFullyDone ? "green" : isTreatPartial ? "yellow" : "red",
    krReference: `${sourceRef} · Раздел 5. Лечение и неотложная помощь`,
    rationale: `В соответствии с КР терапия направлена на устранение жизнеугрожающих нарушений и этиопатогенетическое лечение.`,
    items: treatItems
  };

  // --- 6. МАРШРУТИЗАЦИЯ ---
  let routingStatus = "done";
  let routingLabel = "Выполнено (хорошо)";
  let routingColor = "green";
  let routingDetail = "Тактика госпитализации в ОРИТ обоснована тяжестью состояния.";

  if (cd.department === "outpatient" || cd.department === "admission") {
    const selected = extraResult?.selectedRoute;
    const correct = cd.correctRoute;
    const isRouteMatch = selected === correct;
    const optLabel = cd.routeOptions?.find(o => o.id === selected)?.label || selected || "Не выбрано";
    const correctLabel = cd.routeOptions?.find(o => o.id === correct)?.label || correct || "Госпитализация";

    if (isRouteMatch) {
      routingStatus = "done";
      routingLabel = "Маршрутизация верна (хорошо)";
      routingColor = "green";
      routingDetail = `Выбран верный маршрут: ${optLabel}`;
    } else {
      routingStatus = "missed";
      routingLabel = "Ошибочный маршрут";
      routingColor = "red";
      routingDetail = `Выбрано: «${optLabel}» → По стандарту КР требовалось: «${correctLabel}»`;
    }
  }

  const routingStage = {
    id: "routing",
    stepNumber: 6,
    title: "6. Маршрутизация пациента и исходы",
    icon: "🚶",
    status: routingStatus,
    statusLabel: routingLabel,
    statusColor: routingColor,
    krReference: `${sourceRef} · Раздел 6. Показания к госпитализации и маршрутизация`,
    rationale: routingDetail,
    items: [
      {
        name: "Определение маршрута пациента",
        done: routingStatus === "done",
        detail: routingDetail,
        krStatus: routingStatus === "done" ? "success" : "danger",
      }
    ]
  };

  return [
    anamnesisStage,
    examStage,
    diagnosticsStage,
    diagnosisStage,
    treatmentStage,
    routingStage,
  ];
}
