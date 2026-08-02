import { CASES } from "../../data/cases";

/**
 * Creates category metadata with icons, labels, and colors.
 * @param {Function} t - Translate function
 * @returns {Record<string, {icon: string, label: string, color: string}>}
 */
export const makeCatMeta = (t) => ({
  cardiac: { icon: "❤️", label: t("spec.cardiac"), color: "#ff3d5a" },
  neuro: { icon: "🧠", label: t("spec.neuro"), color: "#9d6ff5" },
  respiratory: { icon: "🫁", label: t("spec.respiratory"), color: "#00e5a0" },
  infectious: { icon: "🦠", label: t("spec.infectious"), color: "#f57c42" },
  endocrine: { icon: "⚗️", label: t("spec.endocrine"), color: "#f5c842" },
  toxicology: { icon: "☠️", label: t("spec.toxicology"), color: "#f57c42" },
  abdominal: { icon: "🔬", label: t("spec.abdominal"), color: "#00e6c8" },
});

/**
 * Creates list of specializations for navigation.
 * @param {Function} t - Translate function
 * @returns {Array<{icon: string, label: string, cat: string}>}
 */
export const makeNavSpec = (t) => [
  { icon: "❤️", label: t("spec.cardiac"), cat: "cardiac" },
  { icon: "🧠", label: t("spec.neuro"), cat: "neuro" },
  { icon: "🫁", label: t("spec.respiratory"), cat: "respiratory" },
  { icon: "🦠", label: t("spec.infectious"), cat: "infectious" },
  { icon: "⚗️", label: t("spec.endocrine"), cat: "endocrine" },
  { icon: "☠️", label: t("spec.toxicology"), cat: "toxicology" },
  { icon: "🔬", label: t("spec.abdominal"), cat: "abdominal" },
];

/**
 * Creates list of department filters.
 * @param {Function} t - Translate function
 * @returns {Array<{key: string, label: string, icon: string}>}
 */
export const DEPT_FILTERS = (t) => [
  { key: "all", label: t("department.all"), icon: "🏥" },
  { key: "icu", label: t("department.icu"), icon: "🚑" },
  { key: "admission", label: t("department.admission"), icon: "🩻" },
  { key: "outpatient", label: t("department.outpatient"), icon: "🩺" },
  { key: "stationary", label: t("department.stationary"), icon: "🛏️" },
];

/**
 * Builds array of notification cards based on user history and progress.
 * @param {Array} sessionHistory - Past played sessions
 * @param {number} casesPlayed - Total cases played
 * @param {number} totalScore - Total score accumulated
 * @param {Function} t - Translate function
 * @param {Record<string, any>} catMeta - Category metadata
 * @returns {Array<{id: string, icon: string, text: string, sub: string}>}
 */
export function buildNotifications(sessionHistory, casesPlayed, totalScore, t, catMeta) {
  const notifs = [];
  const avgScore = casesPlayed ? Math.round(totalScore / casesPlayed) : 0;

  if (casesPlayed === 0) {
    notifs.push({ id: "welcome", icon: "👋", text: t("notifications.welcome"), sub: t("notifications.welcomeSub") });
    notifs.push({ id: "info_cases", icon: "🏥", text: t("notifications.casesAvailable", { n: CASES.length }), sub: t("notifications.casesSub") });
    return notifs;
  }

  // Last session result
  const last = sessionHistory[0];
  if (last) {
    const gradeEmoji = t(`gradeEmoji.${last.gradeId}`) || "📊";
    const d = new Date(last.date);
    const dateStr = d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    const shortName = last.caseName.split(" ").slice(0, 2).join(" ");
    notifs.push({
      id: `ses_${last.id}`,
      icon: gradeEmoji,
      text: t("notifications.sessionResult", { name: shortName, score: last.score }),
      sub: `${t(`grades.${last.gradeId}`)} · ${dateStr}`,
    });
  }

  // Died recently
  const diedRecent = sessionHistory.slice(0, 3).find((s) => s.died);
  if (diedRecent) {
    const shortName = diedRecent.caseName.split(" ").slice(0, 2).join(" ");
    notifs.push({
      id: `died_${diedRecent.id}`,
      icon: "💀",
      text: t("notifications.died"),
      sub: `${shortName} — ${t("notifications.repeatCase")}`,
    });
  }

  // Milestones
  const milestones = [
    { n: 20, icon: "🌟", text: t("notifications.milestone20") },
    { n: 10, icon: "⭐", text: t("notifications.milestone10") },
    { n: 5, icon: "🎯", text: t("notifications.milestone5") },
    { n: 1, icon: "🎓", text: t("notifications.milestone1") },
  ];
  const hit = milestones.find((m) => casesPlayed >= m.n);
  if (hit) {
    notifs.push({
      id: `ms_${hit.n}`,
      icon: hit.icon,
      text: hit.text,
      sub: t("notifications.avgScore", { avg: avgScore, total: totalScore }),
    });
  }

  // Perfect score
  const best = sessionHistory.find((s) => s.score >= 95);
  if (best) {
    const shortName = best.caseName.split(" ").slice(0, 2).join(" ");
    notifs.push({
      id: `perf_${best.id}`,
      icon: "💎",
      text: t("notifications.perfect", { score: best.score }),
      sub: shortName,
    });
  }

  // Unplayed category suggestion
  const playedCats = new Set(sessionHistory.map((s) => s.category));
  const unplayed = Object.entries(catMeta).find(([cat]) => !playedCats.has(cat));
  if (unplayed) {
    const [cat, cm] = unplayed;
    notifs.push({
      id: `explore_${cat}`,
      icon: cm.icon,
      text: t("notifications.tryCategory", { name: cm.label }),
      sub: t("notifications.notPlayedYet"),
    });
  }

  // Low avg score tip
  if (casesPlayed >= 3 && avgScore < 55) {
    notifs.push({
      id: "tip_debrief",
      icon: "💡",
      text: t("notifications.readDebrief"),
      sub: t("notifications.debriefSub"),
    });
  }

  return notifs.slice(0, 5);
}
