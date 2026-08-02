export const CERTIFICATE_THRESHOLDS = [
  {id:"first_case",cases:1,iconKey:"graduationCap",title:"Первый шаг",desc:"Завершите первый клинический случай",color:"#00e6c8"},
  {id:"five_cases",cases:5,iconKey:"target",title:"Начинающий врач",desc:"Завершите 5 клинических случаев",color:"#00e5a0"},
  {id:"ten_cases",cases:10,iconKey:"trophy",title:"Опытный клиницист",desc:"Завершите 10 клинических случаев",color:"#f5c842"},
  {id:"twenty_cases",cases:20,iconKey:"trophy",title:"Мастер диагностики",desc:"Завершите 20 клинических случаев",color:"#f57c42"},
  {id:"all_cases",cases:40,iconKey:"trophy",title:"Полное покрытие",desc:"Завершите все 40 клинических случаев",color:"#ff3d5a"},
];

export const SCORE_THRESHOLDS = [
  {id:"first_perfect",minScore:95,iconKey:"sparkles",title:"Перфекционист",desc:"Наберите 95+ баллов в одном случае",color:"#f5c842"},
  {id:"streak_3",consecutiveGood:3,iconKey:"pulse",title:"Серия успехов",desc:"3 случая подряд с оценкой «Хорошо» или выше",color:"#f57c42"},
  {id:"streak_5",consecutiveGood:5,iconKey:"pulse",title:"Безупречная серия",desc:"5 случаев подряд с оценкой «Хорошо» или выше",color:"#ff3d5a"},
];

export const MODE_CERTIFICATES = [
  {id:"all_excellent",iconKey:"trophy",title:"Все на отлично",desc:"Завершите все 40 случаев с оценкой «Отлично»",color:"#f5c842",
    check:(h)=>h.length>=40&&h.every(s=>s.gradeId==="excellent")},
  {id:"stress_master",iconKey:"warning",title:"Мастер стресса",desc:"Завершите 5 случаев в стресс-режиме",color:"#ff3d5a",
    check:(h)=>h.filter(s=>s.gameMode==="stress").length>=5},
];

export const SPEC_CERTIFICATES = [
  {id:"cardiac_master",category:"cardiac",required:5,iconKey:"cardiac",title:"Кардиолог",desc:"Завершите 5 случаев по кардиологии",color:"#ff3d5a"},
  {id:"neuro_master",category:"neuro",required:5,iconKey:"neuro",title:"Невролог",desc:"Завершите 5 случаев по неврологии",color:"#9d6ff5"},
  {id:"resp_master",category:"respiratory",required:5,iconKey:"respiratory",title:"Пульмонолог",desc:"Завершите 5 случаев по пульмонологии",color:"#00e5a0"},
  {id:"infect_master",category:"infectious",required:3,iconKey:"infectious",title:"Инфекционист",desc:"Завершите 3 случая по инфекционным болезням",color:"#f57c42"},
  {id:"endo_master",category:"endocrine",required:3,iconKey:"endocrine",title:"Эндокринолог",desc:"Завершите 3 случая по эндокринологии",color:"#f5c842"},
  {id:"tox_master",category:"toxicology",required:3,iconKey:"toxicology",title:"Токсиколог",desc:"Завершите 3 случая по токсикологии",color:"#f57c42"},
  {id:"surg_master",category:"abdominal",required:3,iconKey:"abdominal",title:"Хирург",desc:"Завершите 3 случая по хирургии",color:"#00e6c8"},
];

export function computeEarnedCertificates(sessionHistory) {
  const earned = new Set();
  const totalCases = sessionHistory.length;

  for (const th of CERTIFICATE_THRESHOLDS) {
    if (totalCases >= th.cases) earned.add(th.id);
  }

  const bestScore = totalCases ? Math.max(...sessionHistory.map(s => s.score)) : 0;
  for (const th of SCORE_THRESHOLDS) {
    if (th.minScore && bestScore >= th.minScore) earned.add(th.id);
  }

  const recentGrades = sessionHistory.slice(0, 5).map(s => s.gradeId);
  const streakGood = recentGrades.filter(g => g === "excellent" || g === "good").length;
  for (const th of SCORE_THRESHOLDS) {
    if (th.consecutiveGood && streakGood >= th.consecutiveGood) earned.add(th.id);
  }

  const catCounts = {};
  for (const s of sessionHistory) {
    catCounts[s.category] = (catCounts[s.category] || 0) + 1;
  }
  for (const cert of SPEC_CERTIFICATES) {
    if ((catCounts[cert.category] || 0) >= cert.required) earned.add(cert.id);
  }

  for (const cert of MODE_CERTIFICATES) {
    if (cert.check(sessionHistory)) earned.add(cert.id);
  }

  return earned;
}

export function getCertificateById(id) {
  return [...CERTIFICATE_THRESHOLDS, ...SCORE_THRESHOLDS, ...MODE_CERTIFICATES, ...SPEC_CERTIFICATES].find(c => c.id === id);
}
