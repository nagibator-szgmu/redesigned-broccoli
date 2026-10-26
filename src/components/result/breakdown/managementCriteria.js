import { TREATMENTS } from "../../../data/treatments.js";
import { buildFollowUpCriterion } from "./followUpCriteria.js";
import { buildRxBuilderCriterion } from "./rxCriteria.js";

function computeOutpatientCriteria(cd, result, selTreat, extraResult) {
  const criteria = [];
  const isInteractiveGastro = Boolean(cd.rxPlan || cd.followUpPlan || cd.unjustifiedDiag);
  const selRoute = typeof extraResult === "string" ? extraResult : extraResult?.selectedRoute || result?.selectedRoute;
  const isRouteCorrect = selRoute === cd.correctRoute;
  const correctRouteObj = (cd.routeOptions || []).find((o) => o.id === cd.correctRoute);
  const selectedRouteObj = (cd.routeOptions || []).find((o) => o.id === selRoute);
  const routeMax = isInteractiveGastro ? 10 : 20;
  const routeEarned = isRouteCorrect ? routeMax : 0;

  criteria.push({
    id: "route",
    title: "Маршрутизация пациента",
    max: routeMax,
    earned: routeEarned,
    lost: routeMax - routeEarned,
    status: isRouteCorrect ? "perfect" : "failed",
    details: isRouteCorrect
      ? `Маршрут выбран верно: «${correctRouteObj?.label || cd.correctRoute}»`
      : `Неверный маршрут: «${selectedRouteObj?.label || "Не выбран"}» (требовалось: «${correctRouteObj?.label || cd.correctRoute}»)`,
    recommendation: !isRouteCorrect ? (correctRouteObj?.reason || null) : null,
  });

  if (isInteractiveGastro) {
    const rxCrit = buildRxBuilderCriterion(cd, result, extraResult);
    if (rxCrit) criteria.push(rxCrit);

    const fuCrit = buildFollowUpCriterion(cd, result, extraResult);
    if (fuCrit) criteria.push(fuCrit);
  } else {
    const needTreat = cd.needTreat || [];
    if (!isRouteCorrect) {
      criteria.push({
        id: "outpatient_rx",
        title: "Амбулаторная терапия",
        max: 15,
        earned: 0,
        lost: 15,
        status: "failed",
        details: "Амбулаторная терапия не назначена из-за неверной маршрутизации пациента",
      });
    } else if (needTreat.length === 0) {
      criteria.push({
        id: "outpatient_rx",
        title: "Амбулаторное ведение (диета/режим)",
        max: 15,
        earned: 15,
        lost: 0,
        status: "perfect",
        details: "Обоснованное немедикаментозное ведение: диета и модификация образа жизни",
      });
    } else {
      const th = needTreat.filter((id) => (selTreat || []).includes(id)).length;
      const treatEarned = Math.round((th / needTreat.length) * 15);
      const missedTreat = needTreat.filter((id) => !(selTreat || []).includes(id));
      const missedNames = missedTreat.map((id) => TREATMENTS.find((t) => t.id === id)?.name || id);

      criteria.push({
        id: "outpatient_rx",
        title: "Амбулаторная фармакотерапия",
        max: 15,
        earned: treatEarned,
        lost: 15 - treatEarned,
        status: treatEarned === 15 ? "perfect" : treatEarned > 0 ? "partial" : "failed",
        details: treatEarned === 15
          ? "Все назначенные препараты соответствуют стандартам КР"
          : `Не назначены обязательные препараты: ${missedNames.join(", ")}`,
      });
    }
  }
  return criteria;
}

function computeAcuteCriteria(cd, result, selTreat = []) {
  const criteria = [];
  const needTreat = cd.needTreat || [];
  const th = needTreat.filter((id) => (selTreat || []).includes(id)).length;
  const treatEarned = Math.round((th / Math.max(needTreat.length, 1)) * 20);
  const treatLost = 20 - treatEarned;
  const missedTreat = needTreat.filter((id) => !(selTreat || []).includes(id));
  const missedNames = missedTreat.map((id) => TREATMENTS.find((t) => t.id === id)?.name || id);

  criteria.push({
    id: "treatment",
    title: "Неотложная / базисная терапия",
    max: 20,
    earned: treatEarned,
    lost: treatLost,
    status: treatLost === 0 ? "perfect" : treatEarned > 0 ? "partial" : "failed",
    details: treatLost === 0
      ? "Все неотложные лечебные мероприятия выполнены"
      : `Пропущены назначения: ${missedNames.join(", ")}`,
  });

  const outcome = result?.outcome || "unknown";
  const outcomePoints = {
    stable: 20, stabilized: 20, routed: 15, unstable: 10, transferToICU: 5, critical: 3, timeout_no_route: 0, dead: 0,
  };
  const outcomeEarned = outcomePoints[outcome] ?? 10;
  criteria.push({
    id: "outcome",
    title: "Клинический исход пациента",
    max: 20,
    earned: outcomeEarned,
    lost: 20 - outcomeEarned,
    status: outcomeEarned >= 20 ? "perfect" : outcomeEarned > 0 ? "partial" : "failed",
    details: outcome === "dead"
      ? "Летальный исход в ходе симуляции"
      : outcome === "stable" || outcome === "stabilized"
        ? "Состояние пациента стабилизировано"
        : `Исход: ${outcome}`,
  });
  return criteria;
}

export function computeManagementCriteria({ cd, result, selTreat = [], extraResult }) {
  const criteria = cd.department === "outpatient"
    ? computeOutpatientCriteria(cd, result, selTreat, extraResult)
    : computeAcuteCriteria(cd, result, selTreat);

  const dangerous = result?.dangerous || [];
  if (dangerous.length > 0) {
    const penaltyTotal = dangerous.length * 15;
    const reasons = dangerous.map((dName) => {
      const treatItem = TREATMENTS.find((t) => t.name === dName || t.id === dName);
      const treatId = treatItem?.id || dName;
      const adverseReason = cd.adverseReasons?.[treatId];
      return adverseReason ? `${dName} (${adverseReason})` : dName;
    });
    criteria.push({
      id: "dangerous",
      title: "Опасные назначения (штрафы)",
      max: 0,
      earned: -penaltyTotal,
      lost: penaltyTotal,
      status: "penalty",
      details: `Противопоказано: ${reasons.join("; ")}`,
    });
  }

  return criteria;
}
