import { FONT, CODE } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { DIAGNOSTICS, CAT_COLOR } from "../../data/diagnostics";
import { TREATMENTS } from "../../data/treatments";
import TooltipBtn from "../../components/game/TooltipBtn";

const DAY_COLORS = ["#e8e8e8", "#4fc3f7", "#81c784", "#ffcc02", "#ffb74d", "#ef5350", "#ce93d8", "#4dd0e1"];

/** Patient vitals card with day history */
export function PatientCard({ cd, currentPs, cycle }) {
  const C = useTheme();
  const { t } = useTranslate();
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${DAY_COLORS[cycle.currentDay % 7]}15`, border: `1px solid ${DAY_COLORS[cycle.currentDay % 7]}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 16 }}>🏨</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: FONT }}>{cd.name}</div>
          <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT }}>{cd.age} {t("cases.ageSuffix")} · {cd.gender} · {t("department.stationary")}</div>
        </div>
        <span style={{ background: `${DAY_COLORS[cycle.currentDay % 7]}20`, border: `1px solid ${DAY_COLORS[cycle.currentDay % 7]}44`, borderRadius: 5, padding: "2px 8px", fontSize: 10, color: DAY_COLORS[cycle.currentDay % 7], fontWeight: 700, fontFamily: FONT }}>
          {t("stationary.dayN", { n: cycle.currentDay + 1, max: cycle.maxDays })}
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { label: t("vitals.sbp"), value: currentPs.bp || `${currentPs.sbp}/${currentPs.dbp || "?"}`, warn: currentPs.sbp < 90 || currentPs.sbp > 200 },
          { label: t("vitals.hr"), value: currentPs.hr, warn: currentPs.hr > 110 || currentPs.hr < 50 },
          { label: t("vitals.spo2"), value: `${currentPs.spo2}%`, warn: currentPs.spo2 < 92 },
          { label: t("vitals.temp"), value: `${currentPs.temp}°C`, warn: currentPs.temp > 38 },
          { label: t("vitals.gcs"), value: currentPs.gcs, warn: currentPs.gcs < 13 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{ padding: "6px 10px", borderRadius: 8, background: warn ? `${C.red}10` : `${C.textDim}08`, border: `1px solid ${warn ? `${C.red}33` : C.border}`, textAlign: "center", minWidth: 56 }}>
            <div style={{ fontSize: 9, color: C.textDim, fontFamily: FONT, textTransform: "uppercase" }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: warn ? C.red : C.white, fontFamily: CODE }}>{value}</div>
          </div>
        ))}
      </div>
      {cycle.dayHistory.length > 0 && (
        <div style={{ marginTop: 10, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginBottom: 4 }}>{t("stationary.dayHistory")}</div>
          {cycle.dayHistory.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
              <span style={{ fontSize: 10, color: DAY_COLORS[i % 7], fontFamily: FONT, fontWeight: 600 }}>{t("stationary.day", { n: h.day })}:</span>
              <span style={{ fontSize: 10, color: C.textDim, fontFamily: FONT }}>
                {h.treatments.length > 0 ? h.treatments.join(", ") : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Step indicator bar */
export function StepBar({ steps, activeStep, currentDay }) {
  const C = useTheme();
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
      {steps.map((s, i) => (
        <div key={s.key} style={{ flex: 1, padding: "8px 6px", borderRadius: 8, background: i === activeStep ? `${DAY_COLORS[currentDay % 7]}15` : "transparent", border: `1px solid ${i === activeStep ? DAY_COLORS[currentDay % 7] : C.border}`, textAlign: "center", cursor: i <= activeStep ? "pointer" : "default", opacity: i > activeStep ? 0.4 : 1 }}>
          <div style={{ fontSize: 12 }}>{s.icon}</div>
          <div style={{ fontSize: 10, color: i === activeStep ? DAY_COLORS[currentDay % 7] : C.textDim, fontFamily: FONT, marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/** Morning phase panel */
export function MorningPanel({ morningInfo, cycle, setLocalPhase, currentPs }) {
  const C = useTheme();
  const { t } = useTranslate();
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: DAY_COLORS[cycle.currentDay % 7], fontFamily: FONT, marginBottom: 6 }}>{t("stationary.morningDay", { n: cycle.currentDay + 1 })}</div>
      {currentPs && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {[
            { label: t("vitals.sbp"), value: `${Math.round(currentPs.sbp)}/${Math.round(currentPs.dbp)}`, warn: currentPs.sbp < 90 || currentPs.sbp > 200 },
            { label: t("vitals.hr"), value: `${Math.round(currentPs.hr)}`, warn: currentPs.hr > 110 || currentPs.hr < 50 },
            { label: t("vitals.spo2"), value: `${currentPs.spo2}%`, warn: currentPs.spo2 < 92 },
            { label: t("vitals.temp"), value: `${currentPs.temp}°C`, warn: currentPs.temp > 38 },
            { label: t("vitals.gcs"), value: `${Math.round(currentPs.gcs)}`, warn: currentPs.gcs < 13 },
          ].map(({ label, value, warn }) => (
            <div key={label} style={{ padding: "4px 8px", borderRadius: 6, background: warn ? `${C.red}10` : `${C.textDim}08`, border: `1px solid ${warn ? `${C.red}33` : C.border}`, textAlign: "center", minWidth: 50 }}>
              <div style={{ fontSize: 8, color: C.textDim, fontFamily: FONT, textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: warn ? C.red : C.white, fontFamily: CODE, lineHeight: 1.2 }}>{value}</div>
            </div>
          ))}
        </div>
      )}
      {morningInfo ? (
        <>
          <p style={{ fontSize: 12, color: C.text, fontFamily: FONT, lineHeight: 1.5, marginBottom: 10, padding: "8px 10px", background: `${C.textDim}08`, borderRadius: 8, borderLeft: `3px solid ${DAY_COLORS[cycle.currentDay % 7]}`, margin: 0 }}>{morningInfo.morningStatus}</p>
          {morningInfo.tasks?.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginBottom: 4 }}>{t("stationary.tasksOfDay")}</div>
              {morningInfo.tasks.map((task, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: DAY_COLORS[cycle.currentDay % 7], marginTop: 1 }}>▸</span>
                  <span style={{ fontSize: 11, color: C.text, fontFamily: FONT, lineHeight: 1.4 }}>{task}</span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : <p style={{ fontSize: 12, color: C.textDim, fontFamily: FONT, fontStyle: "italic", margin: 0 }}>—</p>}
      {cycle.dischargeCriteria.length > 0 && <div style={{ padding: "8px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}22`, fontSize: 10, color: C.green, fontFamily: FONT, textAlign: "center", marginTop: 8 }}>{t("stationary.dischargeReady", { n: cycle.dischargeCriteria.length })}</div>}
      <button onClick={() => setLocalPhase("order_tests")}
        style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 10, background: `linear-gradient(135deg,${DAY_COLORS[cycle.currentDay % 7]},${C.accent})`, border: "none", fontSize: 13, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT }}>
        {t("stationary.startDay")}
      </button>
    </div>
  );
}

/** Test ordering panel */
export function TestSelection({ cd, selDiag, setSelDiag, handleOrderTests, cycle }) {
  const C = useTheme();
  const { t } = useTranslate();
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: DAY_COLORS[cycle.currentDay % 7], fontFamily: FONT, marginBottom: 8 }}>{t("stationary.day", { n: cycle.currentDay + 1 })} — {t("phases.order_tests")}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {DIAGNOSTICS.map(item => {
          const selected = selDiag.includes(item.id);
          const hasResult = cd.testResults[item.id];
          const color = CAT_COLOR[item.cat] || C.green;
          return (
            <div key={item.id} onClick={() => hasResult && setSelDiag(prev => selected ? prev.filter(x => x !== item.id) : [...prev, item.id])}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 10px", borderRadius: 8, cursor: hasResult ? "pointer" : "default", opacity: hasResult ? 1 : 0.35, background: selected ? `${color}12` : "transparent", border: `1px solid ${selected ? color : C.border}` }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, border: `2px solid ${selected ? color : C.textDim}`, background: selected ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {selected && <span style={{ fontSize: 8, color: C.bg, fontWeight: 900 }}>✓</span>}
              </div>
              <span style={{ fontSize: 12, color: selected ? C.white : C.text, fontFamily: FONT, flex: 1 }}>{item.name}</span>
              {!hasResult && <span style={{ fontSize: 9, color: C.textDim, fontFamily: FONT }}>—</span>}
            </div>
          );
        })}
      </div>
      {selDiag.length > 0 && (
        <button onClick={handleOrderTests}
          style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 10, background: `linear-gradient(135deg,${DAY_COLORS[cycle.currentDay % 7]},${C.accent})`, border: "none", fontSize: 13, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT }}>
          {t("outpatient.send", { n: selDiag.length })}
        </button>
      )}
    </div>
  );
}

/** Test results panel */
export function ResultsPanel({ orderedDiag, revealedResults, processingTests, setLocalPhase, cycle }) {
  const C = useTheme();
  const { t } = useTranslate();
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: DAY_COLORS[cycle.currentDay % 7], fontFamily: FONT, marginBottom: 8 }}>{t("results.title", { n: orderedDiag.length })}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {orderedDiag.map(id => {
          const text = revealedResults[id];
          if (!text) return (
            <div key={id} style={{ padding: "8px 10px", borderRadius: 8, background: `${C.textDim}08`, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, border: `2px solid ${C.yellow}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <span style={{ fontSize: 12, color: C.textDim, fontFamily: FONT }}>{id} — loading...</span>
            </div>
          );
          const isCrit = text.startsWith("🔴");
          return (
            <div key={id} style={{ padding: "8px 10px", borderRadius: 8, background: isCrit ? `${C.red}0a` : `${C.textDim}08`, borderLeft: `3px solid ${isCrit ? C.red : DAY_COLORS[cycle.currentDay % 7]}` }}>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, textTransform: "uppercase", marginBottom: 2 }}>{id}</div>
              <div style={{ fontSize: 12, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>{text}</div>
            </div>
          );
        })}
      </div>
      {processingTests && <div style={{ textAlign: "center", padding: 8, fontSize: 12, color: C.textDim, fontFamily: FONT }}>⏳...</div>}
      {orderedDiag.length > 0 && orderedDiag.every(id => revealedResults[id]) && (
        <button onClick={() => setLocalPhase("treat")}
          style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 10, background: `linear-gradient(135deg,${DAY_COLORS[cycle.currentDay % 7]},${C.accent})`, border: "none", fontSize: 13, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT }}>
          → {t("stationary.treat")}
        </button>
      )}
    </div>
  );
}

/** Treatment selection panel */
export function TreatPanel({ cd, selTreat, toggleTreatment, handleEndDay, canProceedFromTreat, cycle, appliedFx, pendingFx, treatCat, setTreatCat }) {
  const C = useTheme();
  const { t } = useTranslate();
  const treatCats = ["all", ...new Set(TREATMENTS.map(item => item.cat))];
  const filtTreat = treatCat === "all" ? TREATMENTS : TREATMENTS.filter(item => item.cat === treatCat);
  const TREAT_CAT_LABELS = { all: t("treatCat.all"), antiplatelet: t("treatCat.antiplatelet"), anticoagulant: t("treatCat.anticoagulant"), intervention: t("treatCat.intervention"), supportive: t("treatCat.supportive"), cardiac: t("treatCat.cardiac"), analgesic: t("treatCat.analgesic"), betablocker: t("treatCat.betablocker"), diuretic: t("treatCat.diuretic"), antibiotic: t("treatCat.antibiotic"), steroid: t("treatCat.steroid"), endocrine: t("treatCat.endocrine"), antidote: t("treatCat.antidote"), vasopressor: t("treatCat.vasopressor"), anticonvulsant: t("treatCat.anticonvulsant"), antiarrhythmic: t("treatCat.antiarrhythmic"), neuro: t("treatCat.neuro"), antiviral: t("treatCat.antiviral"), renal: t("treatCat.renal") };

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: DAY_COLORS[cycle.currentDay % 7], fontFamily: FONT }}>{t("treatment.title")} ({t("stationary.day", { n: cycle.currentDay + 1 })})</div>
        <TooltipBtn text={t("onboarding.tooltipTreatDelay")} C={C} />
        <TooltipBtn text={t("onboarding.tooltipContinuous")} C={C} />
      </div>
      <div style={{ background: C.redDim, border: "1px solid rgba(255,61,90,0.12)", borderRadius: 8, padding: "7px 10px", marginBottom: 10, fontSize: 12, color: C.red, fontFamily: FONT }}>{t("treatment.dangerous")}</div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
        {treatCats.map(cat => (
          <button key={cat} onClick={() => setTreatCat(cat)} className="filter-pill" style={{
            background: treatCat === cat ? `${C.green}1a` : "transparent",
            border: `1px solid ${treatCat === cat ? C.green : C.border}`,
            borderRadius: 10, padding: "3px 10px", cursor: "pointer", fontFamily: FONT,
            fontSize: 12, color: treatCat === cat ? C.green : C.textDim,
          }}>{TREAT_CAT_LABELS[cat] ?? cat}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {filtTreat.map(item => {
          const selected = selTreat.includes(item.id);
          const isPending = pendingFx?.has(item.id);
          const isApplied = appliedFx?.has(item.id);
          const isDanger = cd?.wrongTreat?.includes(item.id);
          const color = isDanger && selected ? C.red : (CAT_COLOR[item.cat] || DAY_COLORS[cycle.currentDay % 7]);
          return (
            <div key={item.id} onClick={() => toggleTreatment(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, cursor: "pointer", background: selected ? (isDanger ? `${C.red}18` : `${color}18`) : "transparent", border: `1px solid ${selected ? color : C.border}` }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${selected ? color : C.textDim}`, background: selected ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {selected && <span style={{ fontSize: 10, color: "#000", fontWeight: 900 }}>✓</span>}
              </div>
              <span style={{ fontSize: 13, color: selected ? C.white : isDanger ? `${C.red}cc` : C.text, fontFamily: FONT, flex: 1, lineHeight: 1.4 }}>{item.name}</span>
              {isPending && <div style={{ width: 8, height: 8, border: `2px solid ${C.yellow}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />}
              {isApplied && !isDanger && <span style={{ fontSize: 12, color: C.green, flexShrink: 0 }}>✓</span>}
              {isApplied && isDanger && <span style={{ fontSize: 12, color: C.red, flexShrink: 0 }}>🚨</span>}
              {!selected && isDanger && <span style={{ fontSize: 12, color: `${C.red}88`, flexShrink: 0 }}>⚠</span>}
            </div>
          );
        })}
      </div>
      {selTreat.length > 0 && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(0,230,200,0.06)", fontSize: 12, color: C.textDim, fontFamily: FONT }}>
          {appliedFx?.size > 0 && <div style={{ color: C.green, marginBottom: 2 }}>{t("treatment.applied", { n: appliedFx.size })}</div>}
          {pendingFx?.size > 0 && <div style={{ color: C.yellow }}>{t("treatment.inProgress", { n: pendingFx.size })}</div>}
        </div>
      )}
      <button onClick={handleEndDay} disabled={!canProceedFromTreat}
        style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 10, background: canProceedFromTreat ? `linear-gradient(135deg,${DAY_COLORS[cycle.currentDay % 7]},${C.accent})` : `${C.textDim}30`, border: "none", fontSize: 13, fontWeight: 700, color: canProceedFromTreat ? C.bg : C.textDim, cursor: canProceedFromTreat ? "pointer" : "not-allowed", fontFamily: FONT }}>
        {t("stationary.endDay")}
      </button>
    </div>
  );
}
