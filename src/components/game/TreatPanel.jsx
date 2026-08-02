import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";
import { CAT_COLOR } from "../../data/diagnostics";
import { TREATMENTS } from "../../data/treatments";
import TooltipBtn from "./TooltipBtn";

export default function TreatPanel({ cd, selTreat, toggleTreatment, appliedFx, pendingFx, treatCat, setTreatCat, isMobile, showHeader = true }) {
  const C = useTheme();
  const { t } = useTranslate();

  const treatCats = ["all", ...new Set(TREATMENTS.map(t => t.cat))];
  const filtTreat = treatCat === "all" ? TREATMENTS : TREATMENTS.filter(t => t.cat === treatCat);
  const TREAT_CAT_LABELS = { all: t("treatCat.all"), antiplatelet: t("treatCat.antiplatelet"), anticoagulant: t("treatCat.anticoagulant"), intervention: t("treatCat.intervention"), supportive: t("treatCat.supportive"), cardiac: t("treatCat.cardiac"), analgesic: t("treatCat.analgesic"), betablocker: t("treatCat.betablocker"), diuretic: t("treatCat.diuretic"), antibiotic: t("treatCat.antibiotic"), steroid: t("treatCat.steroid"), endocrine: t("treatCat.endocrine"), antidote: t("treatCat.antidote"), vasopressor: t("treatCat.vasopressor"), anticonvulsant: t("treatCat.anticonvulsant"), antiarrhythmic: t("treatCat.antiarrhythmic"), neuro: t("treatCat.neuro"), antiviral: t("treatCat.antiviral"), renal: t("treatCat.renal") };

  return (
    <>
      {showHeader && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, ...(isMobile ? { marginBottom: 4 } : {}) }}>
          <STitle icon="💊" label={t("treatment.title")} color={C.green} />
          {!isMobile && <>
            <TooltipBtn text={t("onboarding.tooltipTreatDelay")} C={C} />
            <TooltipBtn text={t("onboarding.tooltipContinuous")} C={C} />
          </>}
        </div>
      )}
      {!isMobile && <div style={{ background: C.accentDim, border: "1px solid rgba(0,230,200,0.12)", borderRadius: 8, padding: "8px 10px", marginBottom: 10, fontSize: 12, color: C.accent, lineHeight: 1.6, fontFamily: FONT }}>{t("treatment.canStart")}</div>}
      <div style={{ background: C.redDim, border: "1px solid rgba(255,61,90,0.12)", borderRadius: 8, padding: isMobile ? "8px 12px" : "7px 10px", marginBottom: 10, fontSize: 12, color: C.red, fontFamily: FONT }}>{t("treatment.dangerous")}</div>
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
      {filtTreat.map(item => {
        const selected = selTreat.includes(item.id);
        const isPending = pendingFx.has(item.id);
        const isApplied = appliedFx.has(item.id);
        const hideWarnings = localStorage.getItem("ms_hideWarnings") === "true";
        const isDanger = !hideWarnings && cd.wrongTreat.includes(item.id);
        const color = isDanger && selected ? C.red : (CAT_COLOR[item.cat] || C.green);
        return (
          <div key={item.id} onClick={() => toggleTreatment(item.id)} className="treat-row" style={{
            display: "flex", alignItems: "center", gap: 8,
            background: selected ? (isDanger ? `${C.red}18` : `${color}18`) : "transparent",
            border: `1px solid ${selected ? color : C.border}`,
            borderRadius: 8, padding: isMobile ? "9px 12px" : "9px 12px", cursor: "pointer", marginBottom: 4,
          }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${selected ? color : C.textDim}`,
              background: selected ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {selected && <span style={{ fontSize: 10, color: "#000", fontWeight: 900 }}>✓</span>}
            </div>
            <span style={{ color: selected ? C.white : isDanger ? `${C.red}cc` : C.text, fontSize: 13, fontFamily: FONT, flex: 1, lineHeight: 1.4 }}>{item.name}</span>
            {isPending && <div style={{ width: 8, height: 8, border: `2px solid ${C.yellow}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />}
            {isApplied && !isDanger && <span style={{ fontSize: 12, color: C.green, flexShrink: 0 }}>✓</span>}
            {isApplied && isDanger && <span style={{ fontSize: 12, color: C.red, flexShrink: 0 }}>🚨</span>}
            {!selected && isDanger && <span style={{ fontSize: 12, color: `${C.red}88`, flexShrink: 0 }}>⚠</span>}
          </div>
        );
      })}
      {selTreat.length > 0 && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(0,230,200,0.06)", fontSize: 12, color: C.textDim, fontFamily: FONT }}>
          {appliedFx.size > 0 && <div style={{ color: C.green, marginBottom: 2 }}>{t("treatment.applied", { n: appliedFx.size })}</div>}
          {pendingFx.size > 0 && <div style={{ color: C.yellow }}>{t("treatment.inProgress", { n: pendingFx.size })}</div>}
        </div>
      )}
    </>
  );
}
