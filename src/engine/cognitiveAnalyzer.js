/**
 * cognitiveAnalyzer.js
 * 
 * Модуль для анализа когнитивных ошибок и соответствия стандартам ОСКЭ.
 * Используется в панели преподавателя для детального разбора симуляций.
 */

/**
 * Анализирует сессию на наличие когнитивных ошибок.
 * 
 * @param {Object} caseData - Данные клинического случая
 * @param {Array<string>} orderedDiag - Список назначенных диагностических тестов (ID)
 * @param {Array<string>} selTreat - Список назначенных лечений (ID)
 * @param {string} diagText - Текст диагноза, введенный студентом
 * @param {Object} finalPS - Конечные показатели состояния пациента
 * @param {number} elapsedSec - Время прохождения в секундах
 * @returns {Object} Результаты анализа
 */
export function analyzeCognitiveErrors(caseData, orderedDiag = [], selTreat = [], diagText = "", finalPS = {}, elapsedSec = 0) {
  const errors = {
    anchoring: false,
    prematureClosure: false,
    diagnosticBlindness: false
  };

  const complaint = (caseData.complaint || "").toLowerCase();
  const diagnosis = (caseData.diagnosis || "").toLowerCase();
  const enteredDiag = (diagText || "").toLowerCase();

  // 1. Диагностическая слепота (Diagnostic Blindness)
  // Пропуск критических базовых обследований при специфических симптомах
  const hasChestPain = complaint.includes("груд") || complaint.includes("сердц") || complaint.includes("стенокард");
  const hasAlteredMental = complaint.includes("сознан") || complaint.includes("кома") || complaint.includes("сопор") || complaint.includes("путает");
  const hasAbdominalPain = complaint.includes("живот") || complaint.includes("эпигастр") || complaint.includes("рвот");

  // Проверка пропуска ЭКГ при боли в груди
  if (hasChestPain && !orderedDiag.includes("ecg")) {
    errors.diagnosticBlindness = true;
  }
  // Проверка пропуска глюкометрии при угнетении сознания
  if (hasAlteredMental && !orderedDiag.includes("glucose") && !orderedDiag.includes("glu")) {
    errors.diagnosticBlindness = true;
  }
  // Проверка пропуска УЗИ/КТ при подозрении на острую хирургию живота
  if (hasAbdominalPain && !orderedDiag.includes("us_abd") && !orderedDiag.includes("ct_abd") && !orderedDiag.includes("ultrasound_abdomen")) {
    errors.diagnosticBlindness = true;
  }

  // 2. Эффект якоря (Anchoring Effect)
  // Студент настаивает на неверном диагнозе и назначает избыточное нерелевантное лечение
  const wordsEntered = enteredDiag.split(/[\s,.-]+/).filter(w => w.length > 3);
  let matchCount = 0;
  wordsEntered.forEach(word => {
    if (diagnosis.includes(word)) matchCount++;
  });
  const isDiagCorrect = wordsEntered.length > 0 && (matchCount / wordsEntered.length) >= 0.3;

  // Если диагноз неверный, но назначено много специфического неверного лечения (более 2 из категории wrongTreat)
  const wrongTreatsCount = selTreat.filter(t => (caseData.wrongTreat || []).includes(t)).length;
  if (!isDiagCorrect && wrongTreatsCount >= 1) {
    errors.anchoring = true;
  }

  // 3. Преждевременное закрытие (Premature Closure)
  // Диагностика прекращена до выполнения хотя бы половины необходимых тестов
  const neededDiagCount = (caseData.needDiag || []).length;
  const performedNeededCount = orderedDiag.filter(d => (caseData.needDiag || []).includes(d)).length;
  
  if (neededDiagCount > 0 && (performedNeededCount / neededDiagCount) < 0.5 && elapsedSec < 120) {
    errors.prematureClosure = true;
  }

  // Расчет чек-листа ОСКЭ
  const diagTotal = (caseData.needDiag || []).length;
  const diagPassed = orderedDiag.filter(d => (caseData.needDiag || []).includes(d)).length;
  const treatTotal = (caseData.needTreat || []).length;
  const treatPassed = selTreat.filter(t => (caseData.needTreat || []).includes(t)).length;

  // Опасные действия
  const criticalErrors = [];
  selTreat.forEach(t => {
    if ((caseData.wrongTreat || []).includes(t)) {
      criticalErrors.push(t);
    }
  });
  if (finalPS.status === "dead") {
    criticalErrors.push("death");
  }

  return {
    cognitiveErrors: errors,
    checklist: {
      diagPassed,
      diagTotal,
      treatPassed,
      treatTotal
    },
    criticalErrors,
    timeToAction: Math.max(15, Math.min(180, Math.floor(elapsedSec * 0.4))) // Симулируем или берем долю от общего времени
  };
}

/**
 * Генерирует мок-данные студентов группы для панели преподавателя.
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
    "Федоров Егор Антонович"
  ];

  return names.map((name, index) => {
    const casesPlayed = 5 + (index % 4);
    const totalScore = Math.floor(casesPlayed * (72 + (index * 1.7) % 25));
    const avgScore = Math.round(totalScore / casesPlayed);
    
    // Генерируем историю прохождений
    const history = Array.from({ length: casesPlayed }, (_, i) => {
      const caseId = (i * 7 + index) % 10 + 1; // ID кейсов
      const score = Math.floor(60 + Math.random() * 40);
      const passed = score >= 70;
      
      return {
        id: Date.now() - i * 86400000 - index * 100000,
        caseId: `emergency_${caseId}`,
        caseTitle: `Кейс №${caseId}: Пациент с кардиопатологией`,
        score,
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        passed,
        criticalErrorsCount: score < 75 ? 1 : 0,
        cognitiveErrors: {
          anchoring: score < 70 && Math.random() > 0.5,
          prematureClosure: score < 75 && Math.random() > 0.6,
          diagnosticBlindness: score < 65 && Math.random() > 0.4
        }
      };
    });

    return {
      id: `stud_${index + 1}`,
      name,
      casesPlayed,
      avgScore,
      status: avgScore >= 85 ? "excellent" : avgScore >= 70 ? "good" : "warning",
      history
    };
  });
}
