import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import { useTranslate } from "../../../locale/useTranslate";
import { ResultCard } from "../../../ui/components";

/** Список назначенных диагностических тестов и результатов */
export default function PatientResultsSection({
  orderedDiag = [],
  revealedResults = {},
  newResultIds = [],
  cd,
}) {
  const C = useTheme();
  const { t } = useTranslate();

  if (orderedDiag.length === 0) {
    return (
      <div
        style={{
          padding: "14px 10px",
          textAlign: "center",
          fontSize: 11.5,
          color: C.textDim,
          fontFamily: FONT,
        }}
      >
        Пока нет назначенных исследований. Назначьте анализы в правой панели.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {orderedDiag.map((id) => (
        <ResultCard
          key={id}
          id={id}
          text={revealedResults[id] || t("awaiting.pending") || "Выполняется..."}
          isNew={newResultIds.includes(id)}
          cd={cd}
        />
      ))}
    </div>
  );
}
