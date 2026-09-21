import React from "react";
import { TOPICS } from "../../data/topics";
import {
  IconCardiac, IconNeuro, IconRespiratory, IconInfectious,
  IconEndocrine, IconToxicology, IconTrophy,
  IconGraduationCap, IconStethoscope, IconTarget,
} from "../../ui/icons";

export const CAT_META = {
  cardiac: { icon: <IconCardiac size={18} color="#ff3d5a" />, color: "#ff3d5a" },
  neuro: { icon: <IconNeuro size={18} color="#9d6ff5" />, color: "#9d6ff5" },
  respiratory: { icon: <IconRespiratory size={18} color="#00e5a0" />, color: "#00e5a0" },
  infectious: { icon: <IconInfectious size={18} color="#f57c42" />, color: "#f57c42" },
  endocrine: { icon: <IconEndocrine size={18} color="#f5c842" />, color: "#f5c842" },
  toxicology: { icon: <IconToxicology size={18} color="#f57c42" />, color: "#f57c42" },
};

export function renderCertIcon(cert, isEarned) {
  const color = isEarned ? cert.color : "#666";
  const size = 20;
  switch (cert.iconKey) {
    case "cardiac": return <IconCardiac size={size} color={color} />;
    case "neuro": return <IconNeuro size={size} color={color} />;
    case "respiratory": return <IconRespiratory size={size} color={color} />;
    case "infectious": return <IconInfectious size={size} color={color} />;
    case "endocrine": return <IconEndocrine size={size} color={color} />;
    case "toxicology": return <IconToxicology size={size} color={color} />;
    case "graduationCap": return <IconGraduationCap size={size} color={color} />;
    case "target": return <IconTarget size={size} color={color} />;
    default: return <IconTrophy size={size} color={color} />;
  }
}

export function aggregateStats(history = []) {
  const stats = {};
  for (const s of (history || [])) {
    if (!s) continue;
    const cat = s.category || "other";
    if (!stats[cat]) stats[cat] = { played: 0, totalScore: 0, best: 0, deaths: 0 };
    const st = stats[cat];
    st.played++;
    const scoreVal = typeof s.score === "number" ? s.score : 0;
    st.totalScore += scoreVal;
    st.best = Math.max(st.best, scoreVal);
    if (s.died) st.deaths++;
  }
  return stats;
}

export function getGlobalRank(history = []) {
  if (!history || history.length === 0) return null;
  const validScores = history.map((s) => (typeof s?.score === "number" ? s.score : 0));
  const avg = validScores.length ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;
  if (avg >= 90) return { title: "Элита", icon: <IconTrophy size={48} color="#f5c842" />, color: "#f5c842" };
  if (avg >= 75) return { title: "Опытный врач", icon: <IconStethoscope size={48} color="#00e6c8" />, color: "#00e6c8" };
  if (avg >= 60) return { title: "Ординатор", icon: <IconTarget size={48} color="#00e5a0" />, color: "#00e5a0" };
  if (avg >= 40) return { title: "Интерн", icon: <IconGraduationCap size={48} color="#f57c42" />, color: "#f57c42" };
  return { title: "Стажёр", icon: <IconGraduationCap size={48} color="#ff3d5a" />, color: "#ff3d5a" };
}

export function getErrorAnalysis(history = [], t) {
  if (!history || history.length === 0) return null;
  const errors = [];
  const lowScoreSessions = history.filter((s) => (s?.score || 0) < 70);

  const catScores = {};
  history.forEach((s) => {
    if (!s || !s.category) return;
    if (!catScores[s.category]) catScores[s.category] = { total: 0, count: 0 };
    catScores[s.category].total += s.score || 0;
    catScores[s.category].count++;
  });

  const lowCats = [];
  Object.entries(catScores).forEach(([cat, data]) => {
    if (data.count > 0) {
      const avg = data.total / data.count;
      if (avg < 70) {
        lowCats.push({ cat, avg: Math.round(avg) });
      }
    }
  });

  if (lowCats.length > 0) {
    const catLabels = lowCats.map((lc) => t(`spec.${lc.cat}`) || lc.cat).join(", ");
    errors.push({
      type: "warning",
      title: "Слабые направления (балл < 70)",
      desc: `В категориях «${catLabels}» у вас низкая успеваемость. Повторите теоретический материал по этим разделам.`,
    });
  }

  const failedCases = lowScoreSessions.slice(0, 3);
  failedCases.forEach((s) => {
    if (!s || !s.caseId) return;
    const related = TOPICS.flatMap((cat) =>
      cat.children.filter((tItem) => tItem.cases.includes(s.caseId)).map((tItem) => ({ name: tItem.name, id: tItem.id }))
    );
    if (related.length > 0) {
      const nameSnippet = s.caseName ? s.caseName.split(" ").slice(0, 2).join(" ") : s.caseId;
      errors.push({
        type: "info",
        title: `Рекомендация по случаю: ${nameSnippet}`,
        desc: `Вы набрали ${s.score || 0} б. Рекомендуется повторить главу теории «${related[0].name}».`,
      });
    }
  });

  return errors;
}
