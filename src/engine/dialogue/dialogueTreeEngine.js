/**
 * dialogueTreeEngine.js
 * Локальный детерминированный движок распознавания клинических интентов.
 * Сопоставляет вопросы врача с фактами карточки кейса и возвращает ответ + ключ для скоринга.
 */

const INTENT_PATTERNS = {
  complaint: /(бол(ит|ь|и)|беспокоит|жалоб|плохо|тошн|рвот|жжет|давит|режет|локализ|иррад|отдает|симмптом|где болит)/i,
  historyOfIllness: /(когда|начал|давно|как долго|время|часов|минут|вчера|сегодня|развива|провоцир|купир|приступ)/i,
  lifeHistory: /(аллерг|хронич|болезн|давлен|диабет|язв|инфаркт.*раньше|операци|наследствен|родител|курен|курит|алкогол)/i,
  medications: /(лекарств|таблет|препарат|принимает|пьете|капли|уколы|терапи)/i,
  exam: /(дыхан|дышать|воздух|задыха|пульс|сердцебиен|слабост|круж.*голов|холодный пот|состоян)/i,
};

/**
 * Сопоставляет произвольный текстовый вопрос врача с фактами кейса.
 * @param {string} rawQuestion - Вопрос врача
 * @param {Object} caseData - Карточка клинического кейса
 * @returns {{ text: string, revealedKey: string|null, category: string }}
 */
export function matchQuestionToCaseFact(rawQuestion = "", caseData = {}) {
  const q = String(rawQuestion || "").trim();
  if (!q) {
    return {
      text: "Доктор, я вас слушаю...",
      revealedKey: null,
      category: "empty",
    };
  }

  // 1. Анамнез жизни, аллергии, постоянные препараты
  if (INTENT_PATTERNS.lifeHistory.test(q) || INTENT_PATTERNS.medications.test(q)) {
    const text = caseData.lifeHistory || caseData.anamnesis || "Аллергий на лекарства вроде нет, хроническими болезнями особо не страдал.";
    return { text, revealedKey: "lifeHistory", category: "lifeHistory" };
  }

  // 2. Анамнез заболевания (когда началось, как развивалось)
  if (INTENT_PATTERNS.historyOfIllness.test(q)) {
    const text = caseData.historyOfIllness || caseData.shortHistory || caseData.anamnesis || "Началось внезапно около двух часов назад, постепенно нарастало.";
    const key = caseData.shortHistory ? "shortHistory" : "historyOfIllness";
    return { text, revealedKey: key, category: "historyOfIllness" };
  }

  // 3. Объективные ощущения / дыхание
  if (INTENT_PATTERNS.exam.test(q) && caseData.exam) {
    return { text: caseData.exam, revealedKey: "exam", category: "exam" };
  }

  // 4. Жалобы и локализация
  if (INTENT_PATTERNS.complaint.test(q) || !caseData.complaint) {
    const text = caseData.complaint || "Мне очень плохо, всё болит...";
    return { text, revealedKey: "complaint", category: "complaint" };
  }

  // Дефолтный ответ с фокусировкой на главной жалобе
  const firstSentence = (caseData.complaint || "").split(".")[0];
  return {
    text: `Доктор, мне тяжело сосредоточиться. Больше всего меня беспокоит: ${firstSentence || "сильная слабость"}.`,
    revealedKey: "complaint",
    category: "general",
  };
}

/**
 * Возвращает структурированный набор быстрых клинических чипсов для кейса.
 * @param {Object} cd - Данные кейса
 * @returns {Array<{ categoryId: string, label: string, questions: Array<{ label: string, key: string, getAnswer: (cd: Object) => string }> }>}
 */
export function getCategorizedChips(cd = {}) {
  return [
    {
      id: "complaints",
      title: "🩺 Жалобы",
      questions: [
        { label: "Где именно болит?", key: "complaint", answer: cd.complaint || "Болит здесь, не переставая..." },
        { label: "Какой характер боли?", key: "complaint", answer: cd.complaint ? `Боль ${cd.complaint.toLowerCase()}` : "Давит и жжёт..." },
        { label: "Есть ли одышка или тошнота?", key: "complaint", answer: cd.complaint || "Тяжело дышать, подташнивает..." },
      ],
    },
    {
      id: "history",
      title: "⏱️ Анамнез болезни",
      questions: [
        { label: "Когда именно началось?", key: "historyOfIllness", answer: cd.shortHistory || cd.anamnesis || "Около двух часов назад..." },
        { label: "С чем связываете приступ?", key: "historyOfIllness", answer: cd.anamnesis || "Всё началось в покое, без нагрузки..." },
        { label: "Принимали ли лекарства?", key: "historyOfIllness", answer: cd.anamnesis || "Принял таблетку, но не помогло..." },
      ],
    },
    {
      id: "allergies",
      title: "🧬 Аллергии и хроника",
      questions: [
        { label: "Аллергии на лекарства?", key: "lifeHistory", answer: cd.lifeHistory || "Аллергических реакций на препараты не припомню." },
        { label: "Хронические заболевания?", key: "lifeHistory", answer: cd.lifeHistory || cd.anamnesis || "Особо ничем серьезным не болел..." },
      ],
    },
    {
      id: "meds",
      title: "💊 Препараты и привычки",
      questions: [
        { label: "Что принимаете регулярно?", key: "lifeHistory", answer: cd.lifeHistory || "Постоянно таблеток не принимаю..." },
        { label: "Курите ли вы?", key: "lifeHistory", answer: cd.lifeHistory || cd.anamnesis || "Курю иногда..." },
      ],
    },
  ];
}
