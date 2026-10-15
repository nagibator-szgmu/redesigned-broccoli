import React from "react";
import { FONT, CODE } from "../../../ui/theme";
import { IconCheck, IconX, IconAlertTriangle } from "../../../ui/icons";

/** Строка показателя с кнопками самостоятельной оценки врача */
export default function LabParamRow({ item, userChoice, onSelectChoice, isChecked, mistake, C }) {
  const isCorrect = isChecked && !mistake && !!userChoice;
  const isWrong = isChecked && !!mistake;

  return (
    <div
      style={{
        padding: "8px 10px",
        borderRadius: 8,
        background: isWrong ? `${C.red}10` : isCorrect ? `${C.green}0c` : `${C.border}10`,
        border: `1px solid ${isWrong ? `${C.red}50` : isCorrect ? `${C.green}50` : C.border}`,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        transition: "all 0.15s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        {/* Название и референс */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text, fontFamily: FONT }}>
            {item.name}
          </div>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: CODE }}>
            Референс: {item.refRange} {item.unit}
          </div>
        </div>

        {/* Значение пациента */}
        <div style={{ padding: "3px 8px", borderRadius: 6, background: C.headerBg2, border: `1px solid ${C.border}`, fontFamily: CODE, fontSize: 12, fontWeight: 700, color: C.text }}>
          {item.displayValue}
        </div>

        {/* Кнопки оценки или вердикт после проверки */}
        {!isChecked ? (
          <div style={{ display: "flex", gap: 5 }}>
            <button
              type="button"
              onClick={() => onSelectChoice(item.id, "normal")}
              style={btnChoiceStyle(userChoice === "normal", C.green, C)}
            >
              В норме
            </button>
            <button
              type="button"
              onClick={() => onSelectChoice(item.id, "abnormal")}
              style={btnChoiceStyle(userChoice === "abnormal", C.red, C)}
            >
              Отклонение
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontFamily: FONT, fontWeight: 700 }}>
            {isCorrect && (
              <span style={{ color: C.green, background: `${C.green}18`, padding: "2px 8px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <IconCheck size={12} color={C.green} />
                {userChoice === "normal" ? "Верно: Норма" : "Верно: Патология"}
              </span>
            )}
            {isWrong && (
              <span style={{ color: C.red, background: `${C.red}18`, padding: "2px 8px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <IconX size={12} color={C.red} />
                {mistake.type === "missed_pathology" ? "Пропущена патология" : "Ложная тревога"}
              </span>
            )}
            {!userChoice && (
              <span style={{ color: C.yellow, background: `${C.yellow}18`, padding: "2px 8px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <IconAlertTriangle size={12} color={C.yellow} />
                Не оценено
              </span>
            )}
          </div>
        )}
      </div>

      {/* Клинический комментарий при ошибке */}
      {isChecked && isWrong && (
        <div style={{ fontSize: 10.5, color: C.red, fontFamily: FONT, lineHeight: 1.35, paddingTop: 3, borderTop: `1px solid ${C.red}30` }}>
          {mistake.explanation}
        </div>
      )}
    </div>
  );
}

function btnChoiceStyle(active, color, C) {
  return {
    padding: "3px 8px",
    borderRadius: 6,
    border: `1px solid ${active ? color : C.border}`,
    background: active ? `${color}20` : "transparent",
    color: active ? color : C.textDim,
    fontSize: 11,
    fontFamily: FONT,
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
    transition: "all 0.12s ease",
  };
}
