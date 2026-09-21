/**
 * Оценивает переходы статусов клинических проблем между двумя контрольными точками.
 * @param {Array<Object>} prevProblems - Проблемы в предыдущей точке
 * @param {Array<Object>} curProblems - Проблемы в текущей точке
 * @returns {Array<Object>} Полный список проблем с динамическими статусами (ACTIVE, IMPROVING, RESOLVED, WORSENING, PERSISTENT)
 */
export function evaluateProblemTransitions(prevProblems = [], curProblems = []) {
  const result = [];
  const curMap = new Map(curProblems.map(p => [p.id, p]));

  prevProblems.forEach(prev => {
    const cur = curMap.get(prev.id);
    if (!cur) {
      result.push({ ...prev, status: "resolved", transitionNote: "Синдром успешно купирован / разрешён" });
    } else {
      let status = "persistent";
      let transitionNote = "Синдром сохраняется";
      if (prev.severity === "critical" && cur.severity === "moderate") {
        status = "improving";
        transitionNote = "Тяжесть снизилась с критической до умеренной";
      } else if (prev.severity === "moderate" && cur.severity === "critical") {
        status = "worsening";
        transitionNote = "Нарастание тяжести синдрома до критической";
      }
      result.push({ ...cur, status, transitionNote });
      curMap.delete(prev.id);
    }
  });

  curMap.forEach(newProb => {
    result.push({ ...newProb, status: "active", transitionNote: "Вновь возникший синдром" });
  });

  return result;
}
