import React, { useEffect, useRef } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import { useTranslate } from "../../../locale/useTranslate";
import { STitle, ResultCard } from "../../../ui/components";
import HistoryPanel from "../HistoryPanel";
import ProblemListPanel from "../ProblemListPanel";
import PatientDialogueWidget from "../chat/PatientDialogueWidget";
import { IconUser } from "../../../ui/icons";

/** Левая колонка: данные пациента, опрос (ИИ-пациент), анамнез, статус и результаты тестов */
export default function PatientRecordColumn({
  cd,
  ps,
  orderedDiag = [],
  revealedResults = {},
  newResultIds = [],
  onRevealAnamnesis,
  patientDialogueMode = "hybrid",
  isMobile = false,
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const containerRef = useRef(null);

  // Сброс прокрутки к началу при смене пациента
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [cd?.id]);

  const sevColor = cd?.severity === "critical" ? C.red : cd?.severity === "moderate" ? C.yellow : C.green;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        boxSizing: "border-box",
      }}
    >
      {/* Карточка пациента и жалоб */}
      <div
        style={{
          background: C.panelBg,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `${sevColor}15`,
                border: `1.5px solid ${sevColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IconUser size={18} color={sevColor} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: C.white, fontFamily: FONT, lineHeight: 1.2 }}>
                {cd?.name}
              </div>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>
                {cd?.gender === "М" ? "Мужчина" : "Женщина"}, {cd?.age} {t("cases.ageSuffix")}
              </div>
            </div>
          </div>
          <span
            style={{
              background: `${sevColor}20`,
              border: `1px solid ${sevColor}44`,
              borderRadius: 6,
              padding: "2px 8px",
              fontSize: 10,
              color: sevColor,
              fontWeight: 700,
              fontFamily: FONT,
            }}
          >
            {cd?.severity ? t(`severity.${cd.severity}`) : ""}
          </span>
        </div>

        {/* Текст ведущей жалобы */}
        <div
          style={{
            fontSize: 12,
            color: C.text,
            fontFamily: FONT,
            lineHeight: 1.5,
            background: `${C.accent}08`,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "8px 10px",
          }}
        >
          <span style={{ fontWeight: 600, color: C.accent, marginRight: 4 }}>Жалобы:</span>
          {cd?.complaint}
        </div>
      </div>

      {/* Интерактивный диалог / опрос пациента (ИИ-пациент + чипсы) */}
      <PatientDialogueWidget
        caseData={cd}
        patientState={ps}
        mode={patientDialogueMode}
        onRevealAnamnesis={onRevealAnamnesis}
        isMobile={isMobile}
      />

      {/* Структурированный осмотр и анамнез */}
      <HistoryPanel
        cd={cd}
        onRevealAnamnesis={onRevealAnamnesis}
        isMobile={isMobile}
      />

      {/* Клинический список проблем */}
      <ProblemListPanel cd={cd} ps={ps} revealedResults={revealedResults} />

      {/* Результаты назначенных исследований */}
      {orderedDiag.length > 0 && (
        <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px" }}>
          <STitle icon="📋" label={t("results.title", { n: orderedDiag.length })} color={C.accent} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {orderedDiag.map((id) => {
              const text = revealedResults[id];
              return (
                <ResultCard
                  key={id}
                  id={id}
                  text={text || t("awaiting.pending") || "Выполняется..."}
                  isNew={newResultIds.includes(id)}
                  cd={cd}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
