import { FONT } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import { useTranslate } from "../locale/useTranslate";
import { STitle } from "../ui/components";
import { getTopicsForCase } from "../data/topics";
import { getRelatedProtocols } from "../engine/protocols";
import useIsMobile from "../hooks/useIsMobile";
import ScoringBreakdown from "../components/result/ScoringBreakdown";
import { WRONG_TREATMENT_PENALTY } from "../engine/scoring";
import {
  ResultHeader, ScoreCard, VitalsDelta, computeVitalDeltas,
  DiagnosisBlock, OutpatientRouteResult, StationaryDaySummary,
  ChecklistBlock, TestAnalysis, TreatmentAnalysis, DocLayer,
  ProtocolReferences, RelatedTheory, EventLog, ResultActions,
} from "../components/result";

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
const DIAG_ALIASES = { ct: ["ct_head", "ct_chest"], blood: ["cbc", "bmp"], antibiotic: ["antibiotics_broad"],
  epinephrine: ["epinephrine", "epinephrine_im"], "iv fluid": ["iv_fluids"] };

export default function ResultScreen({ result, cd, ps, orderedDiag, selTreat, diagText, eventLog, setPhase, startGame, assessmentMode, curriculum, advanceCurriculum, getNextCurriculumCase, clearCurriculum, getNextCurriculumTopic, extraResult, tutorialMode, elapsedSec, revealedAnamnesis }) {
  const C = useTheme();
  const isMobile = useIsMobile();
  const { t } = useTranslate();

  const relatedTopics = getTopicsForCase(cd.id);
  const relatedProtocols = getRelatedProtocols(cd.id);
  const vitalDeltas = computeVitalDeltas(cd, ps, t);

  const isChecklistDone = (item) => {
    const lc = item.toLowerCase();
    for (const [keyword, id] of Object.entries(CHECKLIST_MAP)) {
      if (lc.includes(keyword) && (orderedDiag.includes(id) || selTreat.includes(id))) return true;
    }
    for (const [keyword, ids] of Object.entries(DIAG_ALIASES)) {
      if (lc.includes(keyword) && ids.some(id => orderedDiag.includes(id) || selTreat.includes(id))) return true;
    }
    return false;
  };

  const checklistItems = assessmentMode && cd.checklistItems ? cd.checklistItems : [];
  const checklistDone = checklistItems.filter(isChecklistDone).length;

  return (
    <div style={{ position: "fixed", inset: 0, overflowY: "auto", background: C.bg, fontFamily: FONT }}>
      <ResultHeader setPhase={setPhase} isMobile={isMobile} />
      <div style={isMobile ? { padding: "14px 14px 80px" } : { maxWidth: 900, margin: "0 auto", padding: "24px 20px 80px" }}>
        {tutorialMode && (
          <>
            <div style={{ background: C.green + "18", border: `1px solid ${C.green}44`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>🎉</span>
                <div>
                  <div style={{ fontSize: 13, color: C.green, fontWeight: 700, marginBottom: 6 }}>Обучение пройдено!</div>
                  <div style={{ fontSize: 12, color: C.text, lineHeight: 1.7, marginBottom: 10 }}>
                    Вы ознакомились с основными механиками симулятора. Теперь вы готовы к самостоятельной работе.
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text }}>
                      <span style={{ fontSize: 14 }}>▶</span> Выберите любой кейс и начните симуляцию
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text }}>
                      <span style={{ fontSize: 14 }}>📚</span> Изучайте теорию и протоколы в разделе «Теория»
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text }}>
                      <span style={{ fontSize: 14 }}>⚙️</span> В настройках доступны режимы обучения и оценки
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ background: C.accent + "12", border: `1px solid ${C.accent}33`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>📖</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: C.accent, fontWeight: 700, marginBottom: 6 }}>Разбор случая и оценка</div>
                <div style={{ fontSize: 12, color: C.text, lineHeight: 1.7, marginBottom: 10 }}>
                  На этом экране показан детальный разбор вашего решения. Оценка (0–100 баллов) складывается из следующих показателей:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: C.text, lineHeight: 1.5 }}>
                  <div>
                    <strong style={{ color: C.white }}>🩺 Диагноз (до 35 б.):</strong> Степень совпадения вашего диагноза с эталонным («Гипогликемия»).
                  </div>
                  <div>
                    <strong style={{ color: C.white }}>🔬 Исследования (до 20 б.):</strong> Пропорционально числу назначенных обязательных тестов (глюкоза и биохимия).
                  </div>
                  <div>
                    <strong style={{ color: C.white }}>💊 Лечение (до 25 б.):</strong> Пропорционально числу назначенных верных препаратов (декстроза).
                  </div>
                  <div>
                    <strong style={{ color: C.red }}>⚠️ Опасные назначения (штраф):</strong> Каждое противопоказанное лечение (например, инсулин) вычитает {WRONG_TREATMENT_PENALTY} баллов.
                  </div>
                  <div>
                    <strong style={{ color: C.white }}>❤️ Исход (до 20 б.):</strong> Бонус за стабильное состояние пациента в конце. При гибели вычитается 20 баллов.
                  </div>
                  <div>
                    <strong style={{ color: C.white }}>⏱️ Время (до 15 б.):</strong> Дополнительные баллы за быстроту принятия решений в экстренных ситуациях.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <ScoreCard result={result} cd={cd} isMobile={isMobile} />
        <ScoringBreakdown cd={cd} selDiag={orderedDiag} selTreat={selTreat} diagText={diagText} ps={ps} elapsedSec={elapsedSec} revealedAnamnesis={revealedAnamnesis} />
        <VitalsDelta cd={cd} ps={ps} isMobile={isMobile} />
        <DiagnosisBlock result={result} cd={cd} diagText={diagText} isMobile={isMobile} />
        <OutpatientRouteResult cd={cd} extraResult={extraResult} isMobile={isMobile} />
        <StationaryDaySummary cd={cd} extraResult={extraResult} isMobile={isMobile} />
        <div style={{
          background: C.panel,
          border: `1px solid ${result.aiEvaluated ? C.green + "40" : C.yellow + "40"}`,
          borderRadius: isMobile ? 12 : 14,
          padding: isMobile ? 14 : 16,
          marginBottom: 10
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🤖</span>
              <strong style={{ fontSize: 13.5, color: C.white, textTransform: "uppercase", letterSpacing: 0.5 }}>
                ИИ-Анализ ответа
              </strong>
            </div>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 6,
              background: result.aiEvaluated ? C.green + "15" : C.yellow + "15",
              color: result.aiEvaluated ? C.green : C.yellow,
              border: `1px solid ${result.aiEvaluated ? C.green : C.yellow}`
            }}>
              {result.aiEvaluated ? "Анализ завершен" : "Анализ выполняется..."}
            </span>
          </div>

          {result.aiEvaluated ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                <strong>Оценка диагноза:</strong> <span style={{ color: C.accent, fontWeight: 700 }}>{result.aiDiagScore} из 35 баллов</span> 
                <span style={{ color: C.textDim, fontSize: 11.5, marginLeft: 6 }}>
                  (локальный скор был: {result.localDiagScore})
                </span>
              </div>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                <strong>Комментарий ИИ:</strong> {result.aiFeedback}
              </div>
              {result.aiErrors && result.aiErrors.length > 0 && (
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: C.red, marginBottom: 6 }}>Замечания ИИ:</div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: C.text, display: "flex", flexDirection: "column", gap: 4 }}>
                    {result.aiErrors.map((err, idx) => (
                      <li key={idx} style={{ lineHeight: 1.5 }}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: 12.5, color: C.textDim, fontStyle: "italic" }}>
              <span>⏳</span> Оцениваем ваш диагноз и терапию с помощью искусственного интеллекта...
            </div>
          )}
        </div>

        {cd.debrief?.explain && (
          <div style={{ background: C.panel, border: `1px solid ${C.accentDim}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
            <STitle icon="🔬" label={t("result.pathophys")} color={C.accent} />
            <p style={{ color: C.text, fontSize: 13, lineHeight: isMobile ? 1.8 : 1.85, margin: 0 }}>{cd.debrief.explain}</p>
          </div>
        )}
        <ChecklistBlock assessmentMode={assessmentMode} checklistItems={checklistItems} checklistDone={checklistDone} isChecklistDone={isChecklistDone} isMobile={isMobile} />
        <TestAnalysis cd={cd} orderedDiag={orderedDiag} isMobile={isMobile} />
        <TreatmentAnalysis cd={cd} selTreat={selTreat} isMobile={isMobile} />
        <div data-tutorial="result_screen" style={{ background: C.panel, border: `1px solid ${C.accentDim}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 18, marginBottom: 10 }}>
          <STitle icon="💡" label={t("result.debrief")} color={C.accent} />
          <p style={{ color: C.text, fontSize: 13, lineHeight: 1.9, margin: 0 }}>{cd.tip}</p>
        </div>
        {cd.sourceReference && (
          <div style={{ background: C.panel, border: `1px solid ${C.accentDim}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
            <STitle icon="📖" label={t("sourceRef.title")} color={C.accent} />
            <div style={{ fontSize: isMobile ? 12 : 13, color: C.text, fontFamily: FONT, lineHeight: 1.6 }}>
              {t("sourceRef.label")}: <span style={{ color: C.accent, fontWeight: 600 }}>{cd.sourceReference.name}</span>
              {cd.sourceReference.year ? <span style={{ color: C.textDim }}>, {cd.sourceReference.year}</span> : null}
            </div>
          </div>
        )}
        <DocLayer cd={cd} extraResult={extraResult} vitalDeltas={vitalDeltas} selTreat={selTreat} isMobile={isMobile} />
        <ProtocolReferences protocols={relatedProtocols} setPhase={setPhase} isMobile={isMobile} />
        <RelatedTheory topics={relatedTopics} setPhase={setPhase} isMobile={isMobile} />
        <EventLog eventLog={eventLog} isMobile={isMobile} />
        <ResultActions curriculum={curriculum} advanceCurriculum={advanceCurriculum} getNextCurriculumCase={getNextCurriculumCase} clearCurriculum={clearCurriculum} startGame={startGame} setPhase={setPhase} getNextCurriculumTopic={getNextCurriculumTopic} />
      </div>
    </div>
  );
}
