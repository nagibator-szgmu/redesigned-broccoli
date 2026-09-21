export function buildAnamnesisStage({
  cd,
  sourceRef,
  revealedAnamnesis,
  trajectory,
}) {
  const rev =
    revealedAnamnesis instanceof Set
      ? revealedAnamnesis
      : new Set(revealedAnamnesis || []);
  const hasHistory = cd.shortHistory || cd.historyOfIllness || cd.anamnesis;
  const isAnamnesisDone =
    rev.size > 0 ||
    rev.has("shortHistory") ||
    rev.has("complaints") ||
    rev.has("historyOfIllness") ||
    (trajectory && trajectory.length > 1);

  return {
    id: "anamnesis",
    stepNumber: 1,
    title: "1. Сбор жалоб и анамнеза заболевания",
    icon: "📋",
    status: isAnamnesisDone ? "done" : "missed",
    statusLabel: isAnamnesisDone ? "Выполнено (хорошо)" : "Не выполнено (пропущено)",
    statusColor: isAnamnesisDone ? "green" : "red",
    krReference: `${sourceRef} · Раздел 1. Жалобы и анамнез`,
    rationale: `Согласно клиническим рекомендациям, сбор детального анамнеза (время манифестации, провоцирующие факторы, сопутствующая терапия) является ключом к стратификации неотложного состояния. Жалоба пациента: «${
      cd.complaint || "острое ухудшение состояния"
    }».`,
    items: [
      {
        name: "Выяснение анамнеза и триггеров",
        done: isAnamnesisDone,
        detail: hasHistory
          ? cd.shortHistory || cd.historyOfIllness || cd.anamnesis
          : "Анамнез со слов бригады СМП / сопровождающих",
        krStatus: isAnamnesisDone ? "success" : "danger",
      },
    ],
  };
}

export function buildExamStage({ cd, sourceRef }) {
  const hasVitalsCheck = true; // Telemetry monitor is active from t=0
  return {
    id: "exam",
    stepNumber: 2,
    title: "2. Физикальный осмотр и витальный мониторинг",
    icon: "🩺",
    status: hasVitalsCheck ? "done" : "missed",
    statusLabel: "Выполнено (хорошо)",
    statusColor: "green",
    krReference: `${sourceRef} · Раздел 2. Физикальное обследование`,
    rationale: `Оценка проходимости дыхательных путей, паттерна дыхания (ЧДД ${
      cd.vitals?.rr || 18
    }), гемодинамики (АД ${cd.vitals?.bp || "---/---"}, ЧСС ${
      cd.vitals?.hr || 80
    }) и сознания (ШКГ ${cd.vitals?.gcs || 15}) по протоколу ABCDE.`,
    items: [
      {
        name: "Физикальный статус при поступлении",
        done: true,
        detail:
          cd.exam ||
          `АД ${cd.vitals?.bp || "---/---"}, ЧСС ${cd.vitals?.hr || 80}, SpO2 ${
            cd.vitals?.spo2 || 98
          }%`,
        krStatus: "success",
      },
    ],
  };
}
