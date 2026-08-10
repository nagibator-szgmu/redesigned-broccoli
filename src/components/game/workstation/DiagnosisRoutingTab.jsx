import React, { useMemo } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import { STitle, Btn } from "../../../ui/components";
import { ROUTE_ICONS } from "../../../screens/game/OutpatientPanels";
import { DIAGNOSTICS } from "../../../data/diagnostics";
import { createDifferentialEngine, addClinicalEvidence, getRankedHypotheses, getLeadingHypothesis } from "../../../engine/differentialEngine";

/**
 * Diagnosis entry, differential reasoning workspace & patient routing tab.
 * Deterministic Differential Ranking model (Heuristic clinical weights, non-Bayesian).
 */
export default function DiagnosisRoutingTab({
  diagText,
  setDiagText,
  selTreat = [],
  pendingFx,
  handleSubmit,
  cd,
  selectedRoute,
  setSelectedRoute,
  setExtraResult,
  orderedDiag = [],
  t,
}) {
  const C = useTheme();

  const isAdmission = cd?.department === "admission";
  const canSubmit = isAdmission ? selTreat.length > 0 && selectedRoute !== null : selTreat.length > 0;

  // Compute deterministic differential ranking
  const { leading, alternatives, supporting, missing } = useMemo(() => {
    if (!cd) return { leading: null, alternatives: [], supporting: [], missing: [] };
    let engine = createDifferentialEngine(cd);
    if (!engine) return { leading: null, alternatives: [], supporting: [], missing: [] };

    orderedDiag.forEach(testId => {
      engine = addClinicalEvidence(engine, testId);
    });

    const ranked = getRankedHypotheses(engine);
    const lead = getLeadingHypothesis(engine);
    const alts = ranked.filter(h => h.id !== lead?.id);

    const needed = cd.needDiag || [];
    const sup = needed.filter(id => orderedDiag.includes(id)).map(id => DIAGNOSTICS.find(d => d.id === id)?.name || id);
    const mis = needed.filter(id => !orderedDiag.includes(id)).map(id => DIAGNOSTICS.find(d => d.id === id)?.name || id);

    return { leading: lead, alternatives: alts, supporting: sup, missing: mis };
  }, [cd, orderedDiag]);

  const doSubmit = () => {
    if (isAdmission && setExtraResult) {
      setExtraResult({ selectedRoute, routeOptions: cd.routeOptions, correctRoute: cd.correctRoute });
    }
    handleSubmit(false);
  };

  return (
    <div style={{ height: "100%", padding: "12px 14px", overflowY: "auto", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Diagnosis Textarea Entry */}
      <div style={{ background: C.panelBg, border: `1px solid ${C.purple}33`, borderRadius: 12, padding: "12px 14px" }}>
        <STitle icon="🩺" label={t("diagnose.title")} color={C.purple} />
        <textarea
          value={diagText}
          onChange={e => setDiagText(e.target.value)}
          placeholder={t("diagnose.placeholder")}
          style={{
            width: "100%",
            minHeight: 70,
            background: C.headerBg2,
            border: `1px solid ${diagText ? `${C.purple}55` : "rgba(0,230,200,0.1)"}`,
            borderRadius: 10,
            padding: "10px 12px",
            color: C.white,
            fontSize: 13,
            fontFamily: FONT,
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            lineHeight: 1.5,
          }}
        />

        {/* Deterministic Differential Ranking Workspace */}
        {leading && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
              <span style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, fontWeight: 600 }}>
                Дифференциальный ряд (эвристический индекс):
              </span>
              <span style={{ fontSize: 9, color: C.textDim, opacity: 0.85, fontStyle: "italic" }}>
                Учебный эвристический рейтинг, не клиническая вероятность.
              </span>
            </div>

            {/* Leading Hypothesis (Most Likely) */}
            <div
              onClick={() => setDiagText(leading.name)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                borderRadius: 8,
                background: `${C.accent}18`,
                border: `1px solid ${C.accent}55`,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9.5, padding: "2px 5px", borderRadius: 4, background: C.accent, color: "#000", fontWeight: 700, fontFamily: FONT }}>
                  ВЕДУЩИЙ
                </span>
                <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, fontFamily: FONT }}>{leading.name}</span>
              </div>
              <strong style={{ fontSize: 13, fontFamily: CODE, color: C.accent }}>{leading.probabilityPct}%</strong>
            </div>

            {/* Supporting vs Missing Clinical Evidence */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 10.5, fontFamily: FONT }}>
              <div style={{ padding: "6px 8px", borderRadius: 6, background: C.btnBg, border: `1px solid ${C.btnBorder}` }}>
                <div style={{ color: C.green, fontWeight: 600, marginBottom: 2 }}>✓ Подтверждено ({supporting.length}):</div>
                {supporting.length > 0 ? (
                  <div style={{ color: C.textDim, lineHeight: 1.4 }}>{supporting.join(", ")}</div>
                ) : (
                  <div style={{ color: C.textDim, fontStyle: "italic" }}>Нет выполненных тестов</div>
                )}
              </div>
              <div style={{ padding: "6px 8px", borderRadius: 6, background: C.btnBg, border: `1px solid ${C.btnBorder}` }}>
                <div style={{ color: C.yellow, fontWeight: 600, marginBottom: 2 }}>○ Требуется ({missing.length}):</div>
                {missing.length > 0 ? (
                  <div style={{ color: C.textDim, lineHeight: 1.4 }}>{missing.join(", ")}</div>
                ) : (
                  <div style={{ color: C.green, fontStyle: "italic" }}>Все ключевые тесты выполнены</div>
                )}
              </div>
            </div>

            {/* Alternative Hypotheses */}
            {alternatives.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {alternatives.map(alt => (
                  <button
                    key={alt.id}
                    onClick={() => setDiagText(alt.name)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 6,
                      background: C.btnBg,
                      border: `1px solid ${C.btnBorder}`,
                      color: C.text,
                      fontSize: 11,
                      fontFamily: FONT,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>{alt.name}</span>
                    <strong style={{ fontSize: 10, fontFamily: CODE, opacity: 0.8 }}>{alt.probabilityPct}%</strong>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Patient Routing (Admission / Outpatient Mode) */}
      {isAdmission && (
        <div style={{ background: C.panelBg, border: `1px solid ${selectedRoute ? `${C.green}44` : `${C.yellow}33`}`, borderRadius: 12, padding: "12px 14px" }}>
          <STitle icon="🚶" label={t("outpatient.routeTitle")} color={selectedRoute ? C.green : C.yellow} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {(cd.routeOptions || []).map(opt => {
              const sel = selectedRoute === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedRoute(opt.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    borderRadius: 10,
                    cursor: "pointer",
                    background: sel ? `${C.green}18` : "transparent",
                    border: `1px solid ${sel ? C.green : C.border}`,
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{ROUTE_ICONS[opt.id] || "📋"}</span>
                  <span style={{ fontSize: 13, color: sel ? C.green : C.text, fontWeight: sel ? 600 : 400, fontFamily: FONT, flex: 1 }}>
                    {opt.label}
                  </span>
                  {sel && <span style={{ fontSize: 14, color: C.green }}>✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary & Submit Action */}
      <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <div style={{ fontSize: 12, fontFamily: FONT }}>
          {selTreat.length > 0 ? (
            <span style={{ color: C.green }}>{t("diagnose.prescribed", { n: selTreat.length })}</span>
          ) : (
            <span style={{ color: C.yellow }}>{t("diagnose.treatTab")}</span>
          )}
          {pendingFx?.size > 0 && (
            <span style={{ color: C.yellow, marginLeft: 8 }}>
              {t("diagnose.active", { n: pendingFx.size })}
            </span>
          )}
        </div>
        <Btn
          onClick={doSubmit}
          disabled={!canSubmit}
          color={C.green}
          style={{ padding: "10px 24px", fontSize: 13 }}
        >
          {t("diagnose.complete")}
        </Btn>
      </div>
    </div>
  );
}
