export const CERTIFICATE_THRESHOLDS = [
  {id:"first_case",cases:1,iconKey:"graduationCap",title:"Первый шаг",desc:"Завершите первый клинический случай",color:"#2563EB"},
  {id:"five_cases",cases:5,iconKey:"target",title:"Начинающий врач",desc:"Завершите 5 клинических случаев",color:"#10B981"},
  {id:"ten_cases",cases:10,iconKey:"trophy",title:"Опытный клиницист",desc:"Завершите 10 клинических случаев",color:"#F59E0B"},
  {id:"twenty_cases",cases:20,iconKey:"trophy",title:"Мастер диагностики",desc:"Завершите 20 клинических случаев",color:"#F97316"},
  {id:"all_cases",cases:40,iconKey:"trophy",title:"Полное покрытие",desc:"Завершите все 40 клинических случаев",color:"#F43F5E"},
];

export const SCORE_THRESHOLDS = [
  {id:"first_perfect",minScore:95,iconKey:"sparkles",title:"Перфекционист",desc:"Наберите 95+ баллов в одном случае",color:"#F59E0B"},
  {id:"streak_3",consecutiveGood:3,iconKey:"pulse",title:"Серия успехов",desc:"3 случая подряд с оценкой «Хорошо» или выше",color:"#F97316"},
  {id:"streak_5",consecutiveGood:5,iconKey:"pulse",title:"Безупречная серия",desc:"5 случаев подряд с оценкой «Хорошо» или выше",color:"#F43F5E"},
];

export const MODE_CERTIFICATES = [
  {id:"all_excellent",iconKey:"trophy",title:"Все на отлично",desc:"Завершите все 40 случаев с оценкой «Отлично»",color:"#F59E0B",
    check:(h)=>h.length>=40&&h.every(s=>s.gradeId==="excellent")},
];

export const SPEC_CERTIFICATES = [
  {id:"cardiac_master",category:"cardiac",required:5,iconKey:"cardiac",title:"Кардиолог",desc:"Завершите 5 случаев по кардиологии",color:"#F43F5E"},
  {id:"neuro_master",category:"neuro",required:5,iconKey:"neuro",title:"Невролог",desc:"Завершите 5 случаев по неврологии",color:"#8B5CF6"},
  {id:"resp_master",category:"respiratory",required:5,iconKey:"respiratory",title:"Пульмонолог",desc:"Завершите 5 случаев по пульмонологии",color:"#10B981"},
  {id:"infect_master",category:"infectious",required:3,iconKey:"infectious",title:"Инфекционист",desc:"Завершите 3 случая по инфекционным болезням",color:"#F97316"},
  {id:"endo_master",category:"endocrine",required:3,iconKey:"endocrine",title:"Эндокринолог",desc:"Завершите 3 случая по эндокринологии",color:"#F59E0B"},
  {id:"tox_master",category:"toxicology",required:3,iconKey:"toxicology",title:"Токсиколог",desc:"Завершите 3 случая по токсикологии",color:"#F97316"},
];

export function computeEarnedCertificates(sessionHistory) {
  const earned = new Set();
  const history = Array.isArray(sessionHistory) ? sessionHistory : [];
  const totalCases = history.length;

  for (const th of CERTIFICATE_THRESHOLDS) {
    if (totalCases >= th.cases) earned.add(th.id);
  }

  const scores = history.map(s => (typeof s?.score === "number" ? s.score : 0));
  const bestScore = scores.length ? Math.max(...scores) : 0;
  for (const th of SCORE_THRESHOLDS) {
    if (th.minScore && bestScore >= th.minScore) earned.add(th.id);
  }

  const recentGrades = history.slice(0, 5).map(s => s?.gradeId);
  const streakGood = recentGrades.filter(g => g === "excellent" || g === "good").length;
  for (const th of SCORE_THRESHOLDS) {
    if (th.consecutiveGood && streakGood >= th.consecutiveGood) earned.add(th.id);
  }

  const catCounts = {};
  for (const s of history) {
    if (s && s.category) {
      catCounts[s.category] = (catCounts[s.category] || 0) + 1;
    }
  }
  for (const cert of SPEC_CERTIFICATES) {
    if ((catCounts[cert.category] || 0) >= cert.required) earned.add(cert.id);
  }

  for (const cert of MODE_CERTIFICATES) {
    try {
      if (cert.check && cert.check(history)) earned.add(cert.id);
    } catch {
      // ignore
    }
  }

  return earned;
}

export function getCertificateById(id) {
  return [...CERTIFICATE_THRESHOLDS, ...SCORE_THRESHOLDS, ...MODE_CERTIFICATES, ...SPEC_CERTIFICATES].find(c => c.id === id);
}
