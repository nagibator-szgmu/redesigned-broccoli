/**
 * studentSessionFormatter.js
 * Generates mock student performance history and formats real student session records.
 */

export function generateMockStudentsData() {
  const names = [
    "Алексеев Даниил Валерьевич",
    "Борисова Екатерина Дмитриевна",
    "Васильев Артем Сергеевич",
    "Григорьева Анна Николаевна",
    "Дмитриев Максим Александрович",
    "Егорова Мария Владимировна",
    "Зайцев Никита Игоревич",
    "Иванова Софья Андреевна",
    "Козлов Кирилл Петрович",
    "Лебедева Дарья Алексеевна",
    "Морозов Александр Сергеевич",
    "Новикова Анастасия Павловна",
    "Петров Дмитрий Олегович",
    "Смирнова Ольга Викторовна",
    "Федоров Егор Антонович",
  ];

  return names.map((name, index) => {
    const casesPlayed = 5 + (index % 4);
    const totalScore = Math.floor(casesPlayed * (72 + ((index * 1.7) % 25)));
    const avgScore = Math.round(totalScore / casesPlayed);

    const history = Array.from({ length: casesPlayed }, (_, i) => {
      const caseId = ((i * 7 + index) % 10) + 1;
      const score = Math.floor(60 + Math.random() * 40);
      const passed = score >= 70;

      return {
        id: Date.now() - i * 86400000 - index * 100000,
        caseId: `emergency_${caseId}`,
        caseTitle: `Кейс №${caseId}: Пациент с кардиопатологией`,
        score,
        date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
        passed,
        criticalErrorsCount: score < 75 ? 1 : 0,
        cognitiveErrors: {
          anchoring: score < 70 && Math.random() > 0.5,
          prematureClosure: score < 75 && Math.random() > 0.6,
          diagnosticBlindness: score < 65 && Math.random() > 0.4,
        },
      };
    });

    return {
      id: `stud_${index + 1}`,
      name,
      casesPlayed,
      avgScore,
      status: avgScore >= 85 ? "excellent" : avgScore >= 70 ? "good" : "warning",
      history,
    };
  });
}

export function formatRealSessionsToStudents(
  sessionHistory = [],
  userName = "Студент-Медик (Текущий профиль)"
) {
  if (!sessionHistory || sessionHistory.length === 0) return [];

  const formattedHistory = sessionHistory.map((s, idx) => {
    const rawErrors = s.cogAnalysis?.cognitiveErrors || {};
    const critErrorsList = s.cogAnalysis?.criticalErrors || [];
    const critCount = critErrorsList.length + (s.died ? 1 : 0);

    let dateFormatted = "Сессия";
    if (s.date) {
      const d = new Date(s.date);
      dateFormatted = isNaN(d.getTime())
        ? String(s.date)
        : d.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
    }

    return {
      id: s.id || `real_${idx}`,
      caseId: s.caseId || `case_${idx}`,
      caseTitle: s.caseName || s.caseId || `Клинический случай #${idx + 1}`,
      score: typeof s.score === "number" ? s.score : 0,
      date: dateFormatted,
      passed: !s.died && s.score >= 70,
      died: !!s.died,
      difficulty: s.difficulty || "нормальная",
      criticalErrorsCount: critCount,
      cognitiveErrors: {
        anchoring: !!rawErrors.anchoring,
        prematureClosure: !!rawErrors.prematureClosure,
        diagnosticBlindness: !!rawErrors.diagnosticBlindness,
      },
      checklist: s.cogAnalysis?.checklist,
      aiFeedback: s.aiFeedback,
      aiErrors: s.aiErrors,
    };
  });

  const totalScore = formattedHistory.reduce((acc, h) => acc + h.score, 0);
  const avgScore = Math.round(totalScore / formattedHistory.length) || 0;
  const status = avgScore >= 85 ? "excellent" : avgScore >= 70 ? "good" : "warning";

  return [
    {
      id: "real_user_student",
      name: userName,
      casesPlayed: formattedHistory.length,
      avgScore,
      status,
      accuracy: Math.min(100, Math.max(40, avgScore + 5)),
      history: formattedHistory,
      isReal: true,
    },
  ];
}
