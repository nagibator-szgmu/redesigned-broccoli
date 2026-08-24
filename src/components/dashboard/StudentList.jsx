import React from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT, CODE, RADIUS } from "../../ui/theme";
import useIsMobile from "../../hooks/useIsMobile";
import { Tooltip } from "../../ui/components";

export default function StudentList({ students, onSelectStudent }) {
  const C = useTheme();
  const isMobile = useIsMobile(768);

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {students.map((student) => {
          const hasCrit = student.history.some(h => h.criticalErrorsCount > 0);
          return (
            <Tooltip
              key={student.id}
              title={`ПРОФИЛЬ: ${student.name.toUpperCase()}`}
              refRange={`Ср. балл: ${student.avgScore} б. | Пройдено: ${student.casesPlayed} кейсов`}
              text={student.status === "excellent" ? "Высокий уровень клинической квалификации." : student.status === "good" ? "Уверенный базовый уровень." : "Требуются повторные тренировки по гайдлайнам."}
              position="top"
              style={{ width: "100%" }}
            >
              <div
                onClick={() => onSelectStudent(student)}
                style={{
                  background: C.panel2,
                  border: `1px solid ${C.border}`,
                  borderRadius: RADIUS.sm,
                  padding: "12px 14px",
                  cursor: "pointer",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{student.name}</span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: RADIUS.xs,
                    background: student.status === "excellent" ? `${C.green}20` : student.status === "good" ? `${C.yellow}20` : `${C.red}20`,
                    color: student.status === "excellent" ? C.green : student.status === "good" ? C.yellow : C.red
                  }}>
                    {student.status === "excellent" ? "Отлично" : student.status === "good" ? "Хорошо" : "Варнинг"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textDim, fontFamily: CODE }}>
                  <span>Кейсов: <strong style={{ color: C.white }}>{student.casesPlayed}</strong></span>
                  <span>Ср. балл: <strong style={{ color: student.avgScore >= 85 ? C.green : student.avgScore >= 70 ? C.yellow : C.red }}>{student.avgScore}</strong></span>
                  {hasCrit && <span style={{ color: C.red, fontWeight: 700 }}>Ошибок: {student.history.filter(h => h.criticalErrorsCount > 0).length}</span>}
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT, textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${C.border}` }}>
            <th style={{ padding: "12px 8px", fontSize: 12, color: C.textDim, fontWeight: 700, textTransform: "uppercase" }}>
              <Tooltip title="ПРОФИЛЬ ОБУЧАЮЩЕГОСЯ" text="ФИО студента или профиль доктора в системе симулятора" indicator="underline">
                <span>ФИО Студента</span>
              </Tooltip>
            </th>
            <th style={{ padding: "12px 8px", fontSize: 12, color: C.textDim, fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>
              <Tooltip title="ОБЪЕМ СИМУЛЯЦИЙ" text="Количество пройденных сценариев клиники в текущем учебном периоде" indicator="underline">
                <span>Кейсов</span>
              </Tooltip>
            </th>
            <th style={{ padding: "12px 8px", fontSize: 12, color: C.textDim, fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>
              <Tooltip title="ОЦЕНКА ОСКЭ" refRange="Норма: >= 70 б." text="Среднеарифметическая оценка за диагностику и терапию по 100-балльной шкале" indicator="underline">
                <span>Ср. Балл</span>
              </Tooltip>
            </th>
            <th style={{ padding: "12px 8px", fontSize: 12, color: C.textDim, fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>
              <Tooltip title="FAILS / ОШИБКИ" refRange="Норма: 0 ошибок" text="Количество жизнеугрожающих или фатальных клинических нарушений" indicator="underline">
                <span>Крит. Ошибки</span>
              </Tooltip>
            </th>
            <th style={{ padding: "12px 8px", fontSize: 12, color: C.textDim, fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>
              <Tooltip title="КЛАССИФИКАЦИЯ УСПЕВАЕМОСТИ" refRange="Отлично >=85 | Хорошо >=70 | Варнинг <70" text="Итоговый статус освоения клинических компетенций" indicator="underline">
                <span>Статус</span>
              </Tooltip>
            </th>
            <th style={{ padding: "12px 8px", fontSize: 12, color: C.textDim, fontWeight: 700, textTransform: "uppercase", textAlign: "right" }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const hasCrit = student.history.some(h => h.criticalErrorsCount > 0);
            return (
              <tr 
                key={student.id} 
                style={{ 
                  borderBottom: `1px solid ${C.border}`,
                  transition: "background 0.2s",
                  cursor: "pointer"
                }}
                onClick={() => onSelectStudent(student)}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <td style={{ padding: "16px 8px", fontSize: 13.5, fontWeight: 600, color: C.white }}>
                  {student.name}
                </td>
                <td style={{ padding: "16px 8px", fontSize: 13, color: C.text, textAlign: "center", fontFamily: CODE }}>
                  {student.casesPlayed}
                </td>
                <td style={{ 
                  padding: "16px 8px", 
                  fontSize: 13, 
                  fontWeight: 700, 
                  color: student.avgScore >= 85 ? C.green : student.avgScore >= 70 ? C.yellow : C.red,
                  textAlign: "center",
                  fontFamily: CODE 
                }}>
                  {student.avgScore}
                </td>
                <td style={{ 
                  padding: "16px 8px", 
                  fontSize: 13, 
                  color: hasCrit ? C.red : C.textDim, 
                  textAlign: "center",
                  fontWeight: hasCrit ? 700 : 400,
                  fontFamily: CODE 
                }}>
                  {student.history.filter(h => h.criticalErrorsCount > 0).length}
                </td>
                <td style={{ padding: "16px 8px", textAlign: "center" }}>
                  <Tooltip
                    title={`УРОВЕНЬ: ${student.status === "excellent" ? "ОТЛИЧНО" : student.status === "good" ? "ХОРОШО" : "ВАРНИНГ"}`}
                    refRange={student.status === "excellent" ? "Средний балл >= 85" : student.status === "good" ? "Средний балл 70-84" : "Средний балл < 70"}
                    text={student.status === "excellent" ? "Высокий уровень клинического мышления и следования гайдлайнам" : student.status === "good" ? "Уверенный базовый уровень, есть отдельные замечания" : "Требуется повторное изучение темы и контроль алгоритмов"}
                  >
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 6,
                      background: student.status === "excellent" ? `${C.green}18` : student.status === "good" ? `${C.yellow}18` : `${C.red}18`,
                      border: `1px solid ${student.status === "excellent" ? C.green : student.status === "good" ? C.yellow : C.red}`,
                      color: student.status === "excellent" ? C.green : student.status === "good" ? C.yellow : C.red,
                      textTransform: "uppercase"
                    }}>
                      {student.status === "excellent" ? "Отлично" : student.status === "good" ? "Хорошо" : "Варнинг"}
                    </span>
                  </Tooltip>
                </td>
                <td style={{ padding: "16px 8px", textAlign: "right" }}>
                  <button style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "6px 12px",
                    color: C.accent,
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontFamily: FONT
                  }}>
                    Подробнее →
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
