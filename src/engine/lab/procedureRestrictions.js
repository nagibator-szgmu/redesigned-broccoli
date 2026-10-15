/**
 * procedureRestrictions.js
 * Клиническая валидация субстрата и процедурных ограничений диагностических исследований.
 * Реализует аутентичную логику отмены процедур при отсутствии субстрата или прямых противопоказаниях.
 */

export const PROCEDURE_CANCELLATIONS = {
  paracentesis:
    "Лапароцентез не выполнен: свободная жидкость в брюшной полости физически отсутствует (по данным осмотра и УЗИ асцит не определяется, пункция не показана).",
  pcr_stool:
    "ПЦР кала: забор биоматериала невозможен — дефекация отсутствует (стул оформлен / задержка стула; анализ на токсины C. difficile валидирован только на жидком стуле).",
  colonoscopy:
    "Колоноскопия прекращена: толстая кишка не подготовлена, просвет обтурирован плотными каловыми массами (экстренная тотальная колоноскопия невыполнима).",
  ph_impedance:
    "Суточная рН-импедансометрия: исследование отменено — 24-часовой мониторинг зондом несовместим с экстренным статусом пациента.",
  lumbar_herniation:
    "Люмбальная пункция отменена: по данным нейровизуализации выявлен масс-эффект и дислокация срединных структур мозга (абсолютное противопоказание из-за риска вклинения ствола).",
};

/**
 * Проверка наличия масс-эффекта, внутричерепной гематомы или угрозы дислокации/вклинения головного мозга.
 * @param {Object} cd - Клинический кейс
 * @returns {boolean}
 */
export function hasIntracranialHerniationRisk(cd = {}) {
  // Если люмбальная пункция прямо указана как необходимая (менингит/энцефалит/СГБ),
  // то противопоказания дислокации нет
  if (cd?.needDiag?.includes("lumbar")) {
    return false;
  }

  const diag = (cd?.diagnosis || "").toLowerCase();
  const ct = (cd?.testResults?.ct_head || "").toLowerCase();
  const mri = (cd?.testResults?.mri || "").toLowerCase();

  // Прямое выявление масс-эффекта или дислокации срединных структур по КТ/МРТ
  const hasNeuroimagingMassEffect =
    ct.includes("смещен") ||
    ct.includes("дислокац") ||
    ct.includes("масс-эффект") ||
    ct.includes("вклинен") ||
    mri.includes("смещен") ||
    mri.includes("дислокац") ||
    mri.includes("масс-эффект") ||
    mri.includes("вклинен");

  // Внутричерепная гематома / геморрагический инсульт (исключаем "геморрагический шок" и ложные подстроки)
  const hasIntracranialBleed =
    diag.includes("геморрагический инсульт") ||
    diag.includes("внутримозгов") ||
    diag.includes("внутричерепн") ||
    (diag.includes("гематом") && !diag.includes("шок")) ||
    ct.includes("внутримозгов") ||
    ct.includes("массивное вк") ||
    ct.includes("гиперденсный очаг") ||
    ct.includes("гематом");

  return hasNeuroimagingMassEffect || (hasIntracranialBleed && ct.length > 0);
}

/**
 * Проверяет, является ли текст уведомлением об отмене процедуры / невозможности забора субстрата.
 * @param {string} text
 * @returns {boolean}
 */
export function isProcedureCancelled(text = "") {
  if (!text) return false;
  const s = text.toLowerCase().replace(/ё/g, "е");
  return (
    s.includes("не выполнен") ||
    s.includes("невозможен") ||
    s.includes("невозможн") ||
    s.includes("прекращен") ||
    s.includes("отменен") ||
    s.includes("невыполним")
  );
}

/**
 * Возвращает текст отказа / отмены процедуры при отсутствии субстрата или противопоказаниях.
 * @param {string} testId - ID исследования
 * @param {Object} cd - Клинический кейс
 * @returns {string|null}
 */
export function getRestrictedProcedureNotice(testId, cd = {}) {
  if (testId === "paracentesis" && !cd?.testResults?.paracentesis) {
    return PROCEDURE_CANCELLATIONS.paracentesis;
  }
  if (testId === "pcr_stool" && !cd?.testResults?.pcr_stool) {
    return PROCEDURE_CANCELLATIONS.pcr_stool;
  }
  if (testId === "colonoscopy" && !cd?.testResults?.colonoscopy) {
    return PROCEDURE_CANCELLATIONS.colonoscopy;
  }
  if (testId === "ph_impedance" && !cd?.testResults?.ph_impedance) {
    return PROCEDURE_CANCELLATIONS.ph_impedance;
  }
  if (testId === "lumbar" && hasIntracranialHerniationRisk(cd)) {
    return PROCEDURE_CANCELLATIONS.lumbar_herniation;
  }
  return null;
}

/**
 * Единая точка резолва результата теста с учетом субстратной валидации и ограничений.
 * @param {string} testId
 * @param {Object} cd
 * @returns {string}
 */
export function resolveDiagnosticResult(testId, cd = {}) {
  const notice = getRestrictedProcedureNotice(testId, cd);
  if (notice) {
    return notice;
  }
  if (cd?.testResults?.[testId]) {
    return cd.testResults[testId];
  }
  return `${testId}: в пределах нормы.`;
}
