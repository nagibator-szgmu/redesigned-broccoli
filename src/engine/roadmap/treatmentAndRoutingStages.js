import { TREATMENTS } from "../../data/treatments.js";

export function buildTreatmentStage({ cd, sourceRef, selTreat = [] }) {
  const needTreat = cd.needTreat || [];
  const wrongTreat = cd.wrongTreat || [];
  const contraindicatedTreat = cd.contraindicatedTreat || [];
  const allBadTreat = [...new Set([...wrongTreat, ...contraindicatedTreat])];

  const selTreatSet = new Set(selTreat || []);
  const treatItems = [];

  // Required treatments
  needTreat.forEach((tId) => {
    const tDef = TREATMENTS.find((t) => t.id === tId) || { id: tId, name: tId };
    const done = selTreatSet.has(tId);
    treatItems.push({
      id: tId,
      name: tDef.name,
      type: "required",
      done,
      krStatus: done ? "success" : "danger",
      rationale: "Показано по КР: препарат/манипуляция первой линии при данной патологии.",
    });
  });

  // Contraindicated / wrong treatments applied
  allBadTreat.forEach((tId) => {
    if (selTreatSet.has(tId)) {
      const tDef = TREATMENTS.find((t) => t.id === tId) || { id: tId, name: tId };
      treatItems.push({
        id: tId,
        name: tDef.name,
        type: "contraindicated",
        done: false,
        krStatus: "critical_danger",
        rationale:
          "🚨 ПРОТИВОПОКАЗАНО по КР: применение ухудшает прогноз или несет риск летального исхода!",
      });
    }
  });

  const requiredTreatCount = treatItems.filter((i) => i.type === "required").length;
  const doneTreatCount = treatItems.filter((i) => i.type === "required" && i.done).length;
  const hasAppliedBadTreat = treatItems.some((i) => i.type === "contraindicated");

  const isTreatFullyDone =
    !hasAppliedBadTreat && requiredTreatCount > 0 && doneTreatCount === requiredTreatCount;
  const isTreatPartial =
    !hasAppliedBadTreat && doneTreatCount > 0 && doneTreatCount < requiredTreatCount;

  return {
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
    rationale:
      "В соответствии с КР терапия направлена на устранение жизнеугрожающих нарушений и этиопатогенетическое лечение.",
    items: treatItems,
  };
}

export function buildRoutingStage({ cd, sourceRef, extraResult }) {
  let routingStatus = "done";
  let routingLabel = "Выполнено (хорошо)";
  let routingColor = "green";
  let routingDetail = "Тактика госпитализации в ОРИТ обоснована тяжестью состояния.";

  if (cd.department === "outpatient" || cd.department === "admission") {
    const selected = extraResult?.selectedRoute;
    const correct = cd.correctRoute;
    const isRouteMatch = selected === correct;
    const optLabel =
      cd.routeOptions?.find((o) => o.id === selected)?.label || selected || "Не выбрано";
    const correctLabel =
      cd.routeOptions?.find((o) => o.id === correct)?.label || correct || "Госпитализация";

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

  return {
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
      },
    ],
  };
}
