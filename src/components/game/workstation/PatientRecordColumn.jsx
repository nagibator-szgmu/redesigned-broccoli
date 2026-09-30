import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import HistoryPanel from "../HistoryPanel";
import ProblemListPanel from "../ProblemListPanel";
import PatientDialogueWidget from "../chat/PatientDialogueWidget";
import WorkstationAccordionSection from "./WorkstationAccordionSection";
import PatientIdentityCard from "./PatientIdentityCard";
import ComplaintsCard from "./ComplaintsCard";
import MobilePatientSummary from "./MobilePatientSummary";
import { IconClipboard, IconAlertTriangle } from "../../../ui/icons";

/**
 * Колонка досье пациента:
 * 1. Карточка пациента (компактная на мобильном)
 * 2. Жалобы и статус
 * 3. Диалог с пациентом
 * 4. Сводка результатов обследований и назначенной терапии (на мобильном)
 * 5. Анамнез и объективный осмотр (аккордеон)
 * 6. Клинические проблемы (аккордеон)
 */
export default function PatientRecordColumn({
  cd,
  ps,
  orderedDiag = [],
  revealedResults = {},
  newResultIds = [],
  selTreat = [],
  onRevealAnamnesis,
  patientDialogueMode = "hybrid",
  isMobile = false,
  onOpenDiag,
  onOpenTreat,
}) {
  const C = useTheme();
  const containerRef = useRef(null);
  const [openSections, setOpenSections] = useState(() => new Set());

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [cd?.id]);

  const toggleSection = (key) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        padding: "4px 2px",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 8 : 14,
        boxSizing: "border-box",
      }}
      className="no-scrollbar"
    >
      {/* 1. Паспортная карточка пациента */}
      <PatientIdentityCard cd={cd} compact={isMobile} />

      {/* 2. Секция: Жалобы и статус */}
      <ComplaintsCard complaint={cd?.complaint} compact={isMobile} />

      {/* 3. Секция: Диалог с пациентом (ИИ-опрос) */}
      <div
        style={{
          background: C.panelBg,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: isMobile ? "8px" : "14px",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <PatientDialogueWidget
          caseData={cd}
          patientState={ps}
          mode={patientDialogueMode}
          onRevealAnamnesis={onRevealAnamnesis}
          isMobile={isMobile}
        />
      </div>

      {/* 4. Результаты обследований и терапия (в контексте пациента) */}
      {isMobile && (
        <MobilePatientSummary
          orderedDiag={orderedDiag}
          revealedResults={revealedResults}
          newResultIds={newResultIds}
          selTreat={selTreat}
          onOpenDiag={onOpenDiag}
          onOpenTreat={onOpenTreat}
        />
      )}

      {/* 5. Секция: Анамнез и объективный осмотр */}
      <WorkstationAccordionSection
        id="history"
        isOpen={openSections.has("history")}
        onToggle={() => toggleSection("history")}
        icon={<IconClipboard size={14} color="currentColor" />}
        title="Анамнез и осмотр"
        subtitle="История заболевания, жизни, статус органов"
        accentColor={C.green}
      >
        <div style={{ padding: "4px 6px" }}>
          <HistoryPanel cd={cd} onRevealAnamnesis={onRevealAnamnesis} isMobile={isMobile} />
        </div>
      </WorkstationAccordionSection>

      {/* 6. Секция: Клинические проблемы */}
      <WorkstationAccordionSection
        id="problems"
        isOpen={openSections.has("problems")}
        onToggle={() => toggleSection("problems")}
        icon={<IconAlertTriangle size={14} color="currentColor" />}
        title="Клинические проблемы"
        subtitle="Ведущие синдромы и нарушения"
        accentColor={C.red}
      >
        <div style={{ padding: "4px 6px" }}>
          <ProblemListPanel cd={cd} ps={ps} revealedResults={revealedResults} />
        </div>
      </WorkstationAccordionSection>
    </div>
  );
}
