import React, { useState } from "react";
import { FONT, RADIUS } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import { useTranslate } from "../locale/useTranslate";
import { getTopicsForCase } from "../data/topics";
import { getRelatedProtocols } from "../engine/protocols";
import useIsMobile from "../hooks/useIsMobile";
import { ResultHeader, computeVitalDeltas, ResultActions } from "../components/result";
import {
  ResultSummaryTab,
  ResultErrorsTab,
  ResultTheoryTab,
  ResultTimelineTab,
} from "../components/result/tabs";
import { IconParty, IconPlay, IconBook, IconGear } from "../ui/icons";

const CHECKLIST_MAP = {
  ecg: "ecg", troponin: "troponin", тропонин: "troponin", aspirin: "aspirin",
  heparin: "heparin", oxygen: "oxygen", intubation: "intubation", mri: "mri",
  "x-ray": "xray", lumbar: "lumbar", echocardiograph: "echo", glucose: "glucose",
  culture: "culture", spo2: "spo2", bnp: "bnp", "d-dimer": "d_dimer",
  abg: "abg", urine: "urine", crp: "crp", insulin: "insulin",
  furosemide: "furosemide", metoprolol: "metoprolol", nitroglycerin: "nitroglycerin",
  morphine: "morphine", dextrose: "dextrose", naloxone: "naloxone",
  defibrillat: "defibrillation", catheter: "pci", surgery: "surgery_consult",
  steroid: "steroids", dopamine: "dopamine", amiodarone: "amiodarone",
  mannitol: "mannitol", acyclovir: "acyclovir", dialysis: "dialysis",
  "blood transfusion": "blood_transfusion", coagulation: "coag", lipid: "lipid",
  thyroid: "thyroid", eeg: "eeg", usg: "usg_abdo", cohb: "cohb",
  ketone: "ketones", lactate: "lactate", toxicol: "tox_screen", type: "type_cross",
};
const DIAG_ALIASES = {
  ct: ["ct_head", "ct_chest"], blood: ["cbc", "bmp"], antibiotic: ["antibiotics_broad"],
  epinephrine: ["epinephrine", "epinephrine_im"], "iv fluid": ["iv_fluids"]
};

export default function ResultScreen({
  result, cd, ps, trajectory = [], orderedDiag, selTreat, diagText,
  eventLog, setPhase, startGame, assessmentMode, curriculum, advanceCurriculum,
  getNextCurriculumCase, clearCurriculum, getNextCurriculumTopic, extraResult,
  tutorialMode, elapsedSec, revealedAnamnesis,
}) {
  const C = useTheme();
  const isMobile = useIsMobile();
  const { t } = useTranslate();
  const [activeTab, setActiveTab] = useState("summary");

  const relatedTopics = getTopicsForCase(cd?.id);
  const relatedProtocols = getRelatedProtocols(cd?.id);
  const vitalDeltas = computeVitalDeltas(cd, ps, t);

  const isChecklistDone = (item) => {
    const lc = item.toLowerCase();
    for (const [keyword, id] of Object.entries(CHECKLIST_MAP)) {
      if (lc.includes(keyword) && ((orderedDiag || []).includes(id) || (selTreat || []).includes(id))) return true;
    }
    for (const [keyword, ids] of Object.entries(DIAG_ALIASES)) {
      if (lc.includes(keyword) && ids.some(id => (orderedDiag || []).includes(id) || (selTreat || []).includes(id))) return true;
    }
    return false;
  };

  const checklistItems = assessmentMode && cd?.checklistItems ? cd.checklistItems : [];
  const checklistDone = checklistItems.filter(isChecklistDone).length;

  const tabs = [
    { id: "summary", label: "Итог и оценка", icon: "📊" },
    { id: "errors", label: "Разбор ошибок", icon: "🚨" },
    { id: "theory", label: "Обоснование и КР", icon: "📖" },
    { id: "timeline", label: "Хронология", icon: "⏱️" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, overflowY: "auto", background: C.bg, fontFamily: FONT }}>
      <ResultHeader setPhase={setPhase} isMobile={isMobile} />
      <div style={isMobile ? { padding: "14px 14px 80px" } : { maxWidth: 900, margin: "0 auto", padding: "24px 20px 80px" }}>
        
        {/* Баннер завершения туториала */}
        {tutorialMode && (
          <div style={{ background: `${C.green}18`, border: `1px solid ${C.green}44`, borderRadius: isMobile ? RADIUS.sm : RADIUS.md, padding: isMobile ? 14 : 16, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <IconParty size={24} color={C.green} />
              <div>
                <div style={{ fontSize: 13, color: C.green, fontWeight: 700, marginBottom: 6 }}>Обучение пройдено!</div>
                <div style={{ fontSize: 12, color: C.text, lineHeight: 1.7, marginBottom: 10 }}>
                  Вы ознакомились с основными механиками симулятора. Теперь вы готовы к самостоятельной работе.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text }}>
                    <IconPlay size={12} color={C.accent} /> <span>Выберите любой кейс и начните симуляцию</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text }}>
                    <IconBook size={12} color={C.accent} /> <span>Изучайте теорию и протоколы в разделе «Теория»</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text }}>
                    <IconGear size={12} color={C.accent} /> <span>В настройках доступны режимы обучения и оценки</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Таб-навигация */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 16,
            padding: 4,
            background: C.panel,
            border: `1px solid ${C.border}`,
            borderRadius: RADIUS.md,
            overflowX: "auto",
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: isMobile ? "8px 10px" : "10px 14px",
                  borderRadius: RADIUS.xs,
                  border: isActive ? `1px solid ${C.accent}` : "1px solid transparent",
                  background: isActive ? `${C.accent}18` : "transparent",
                  color: isActive ? C.accent : C.textDim,
                  fontSize: isMobile ? 12 : 13,
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  fontFamily: FONT,
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Контент активной вкладки */}
        <div style={{ marginBottom: 20 }}>
          {activeTab === "summary" && (
            <ResultSummaryTab
              result={result}
              cd={cd}
              ps={ps}
              diagText={diagText}
              vitalDeltas={vitalDeltas}
              isMobile={isMobile}
              extraResult={extraResult}
            />
          )}

          {activeTab === "errors" && (
            <ResultErrorsTab
              result={result}
              cd={cd}
              orderedDiag={orderedDiag}
              selTreat={selTreat}
              isMobile={isMobile}
              assessmentMode={assessmentMode}
              checklistItems={checklistItems}
              checklistDone={checklistDone}
              isChecklistDone={isChecklistDone}
              revealedAnamnesis={revealedAnamnesis}
            />
          )}

          {activeTab === "theory" && (
            <ResultTheoryTab
              cd={cd}
              extraResult={extraResult}
              vitalDeltas={vitalDeltas}
              selTreat={selTreat}
              relatedProtocols={relatedProtocols}
              relatedTopics={relatedTopics}
              setPhase={setPhase}
              isMobile={isMobile}
            />
          )}

          {activeTab === "timeline" && (
            <ResultTimelineTab
              eventLog={eventLog}
              trajectory={trajectory}
              elapsedSec={elapsedSec}
              isMobile={isMobile}
            />
          )}
        </div>

        {/* Действия по завершении кейса */}
        <ResultActions
          curriculum={curriculum}
          advanceCurriculum={advanceCurriculum}
          getNextCurriculumCase={getNextCurriculumCase}
          clearCurriculum={clearCurriculum}
          startGame={startGame}
          setPhase={setPhase}
          getNextCurriculumTopic={getNextCurriculumTopic}
        />
      </div>
    </div>
  );
}
