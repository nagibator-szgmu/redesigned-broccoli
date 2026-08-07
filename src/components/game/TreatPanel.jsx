import { useState } from "react";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";
import { CAT_COLOR } from "../../data/diagnostics";
import { TREATMENTS } from "../../data/treatments";
import { IconAlertTriangle } from "../../ui/icons";
import TooltipBtn from "./TooltipBtn";

/** Helper to match treatments to 6 high-level groups or legacy category strings */
function matchGroup(item, cat) {
  if (!cat || cat === "all") return true;
  if (cat === "meds") {
    return ["antiplatelet", "anticoagulant", "cardiac", "analgesic", "betablocker", "diuretic", "antibiotic", "steroid", "endocrine", "antidote", "vasopressor", "anticonvulsant", "antiarrhythmic", "neuro", "antiviral", "renal"].includes(item.cat);
  }
  if (cat === "invasive") {
    return item.cat === "intervention" || ["thrombolysis", "defibrillation", "intubation", "pci", "surgery_consult", "pericardiocentesis", "chest_compressions", "gastric_lavage", "succinylcholine"].includes(item.id);
  }
  if (cat === "airway") {
    return ["oxygen", "intubation", "chest_compressions", "epinephrine_im", "steroids"].includes(item.id);
  }
  if (cat === "fluid") {
    return ["iv_fluids", "blood_transfusion", "warm_iv", "dextrose", "dialysis", "mannitol", "furosemide"].includes(item.id) || item.cat === "renal";
  }
  if (cat === "surgery") {
    return ["surgery_consult", "pci", "pericardiocentesis", "gastric_lavage"].includes(item.id);
  }
  return item.cat === cat;
}

export default function TreatPanel({
  cd,
  selTreat = [],
  toggleTreatment,
  appliedFx,
  pendingFx,
  treatCat = "all",
  setTreatCat,
  searchQuery: extQuery,
  setSearchQuery: extSetQuery,
  isMobile,
  showHeader = true
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const [intQuery, setIntQuery] = useState("");

  const searchQuery = extQuery !== undefined ? extQuery : intQuery;
  const setSearchQuery = extSetQuery || setIntQuery;

  const GROUPS = [
    { id: "all", label: t("treatGroup.all") || "Все" },
    { id: "meds", label: t("treatGroup.meds") || "Медикаменты" },
    { id: "invasive", label: t("treatGroup.invasive") || "Процедуры" },
    { id: "airway", label: t("treatGroup.airway") || "Дыхание" },
    { id: "fluid", label: t("treatGroup.fluid") || "Инфузии" },
    { id: "surgery", label: t("treatGroup.surgery") || "Хирургия" }
  ];

  const q = searchQuery.trim().toLowerCase();
  const filtTreat = TREATMENTS.filter(item => {
    const groupMatch = matchGroup(item, treatCat);
    const searchMatch = !q || item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
    return groupMatch && searchMatch;
  });

  const hideWarnings = localStorage.getItem("ms_hideWarnings") === "true";

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

      {/* Search Bar with match count */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: C.inputBg || "rgba(7,13,24,0.6)", border: `1px solid ${C.border}`,
        borderRadius: 10, padding: "6px 12px", marginBottom: 8, backdropFilter: "blur(8px)"
      }}>
        <span style={{ fontSize: 14, color: C.textDim }}>🔍</span>
        <input
          className="seamless-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("search.placeholderTreat") || "Поиск препаратов..."}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontFamily: FONT, fontSize: 13 }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} style={{ background: "transparent", border: "none", color: C.textDim, cursor: "pointer", padding: "2px 4px", fontSize: 13 }}>
            ✕
          </button>
        )}
        <span style={{ fontSize: 11, color: C.green, fontFamily: FONT, background: `${C.green}15`, border: `1px solid ${C.green}33`, borderRadius: 6, padding: "2px 6px" }}>
          {filtTreat.length} / {TREATMENTS.length}
        </span>
      </div>

      {!isMobile && <div style={{ background: C.accentDim, border: "1px solid rgba(0,230,200,0.12)", borderRadius: 8, padding: "8px 10px", marginBottom: 8, fontSize: 12, color: C.accent, lineHeight: 1.5, fontFamily: FONT }}>{t("treatment.canStart")}</div>}
      <div style={{ background: C.redDim, border: "1px solid rgba(255,61,90,0.12)", borderRadius: 8, padding: isMobile ? "8px 12px" : "7px 10px", marginBottom: 10, fontSize: 12, color: C.red, fontFamily: FONT }}>{t("treatment.dangerous")}</div>

      {/* 6 Group Chips */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
        {GROUPS.map(grp => {
          const active = treatCat === grp.id;
          return (
            <button key={grp.id} onClick={() => setTreatCat && setTreatCat(grp.id)} className="filter-pill" style={{
              background: active ? `${C.green}1a` : "transparent",
              border: `1px solid ${active ? C.green : C.border}`,
              borderRadius: 10, padding: "4px 10px", cursor: "pointer", fontFamily: FONT,
              fontSize: 12, color: active ? C.green : C.textDim, fontWeight: active ? 700 : 500
            }}>{grp.label}</button>
          );
        })}
      </div>

      {/* Treatments list with danger badges & match row */}
      {filtTreat.map(item => {
        const selected = selTreat.includes(item.id);
        const isPending = pendingFx?.has(item.id);
        const isApplied = appliedFx?.has(item.id);
        const isDanger = !hideWarnings && cd?.wrongTreat?.includes(item.id);
        const color = isDanger && selected ? C.red : (CAT_COLOR[item.cat] || C.green);

        return (
          <div key={item.id} onClick={() => toggleTreatment(item.id)} className="treat-row" style={{
            display: "flex", alignItems: "center", gap: 8,
            background: selected ? (isDanger ? `${C.red}18` : `${color}18`) : "transparent",
            border: `1px solid ${selected ? color : C.border}`,
            borderRadius: 8, padding: "9px 12px", cursor: "pointer", marginBottom: 4
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: 4, border: `2px solid ${selected ? color : C.textDim}`,
              background: selected ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              {selected && <span style={{ fontSize: 10, color: "#000", fontWeight: 900 }}>✓</span>}
            </div>
            <span style={{ color: selected ? C.white : isDanger ? `${C.red}cc` : C.text, fontSize: 13, fontFamily: FONT, flex: 1, lineHeight: 1.4 }}>
              {item.name}
            </span>
            {isDanger && (
              <span style={{
                fontSize: 10, color: C.red, background: `${C.red}20`, border: `1px solid ${C.red}44`,
                borderRadius: 4, padding: "1px 5px", fontWeight: 600, fontFamily: FONT, flexShrink: 0
              }}>
                {t("treatment.dangerBadge") || "⚠ dangerous"}
              </span>
            )}
            {isPending && <div style={{ width: 8, height: 8, border: `2px solid ${C.yellow}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />}
            {isApplied && !isDanger && <span style={{ fontSize: 12, color: C.green, flexShrink: 0 }}>✓</span>}
            {isApplied && isDanger && <IconAlertTriangle size={14} color={C.red} />}
          </div>
        );
      })}

      {selTreat.length > 0 && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}`, fontSize: 12, color: C.textDim, fontFamily: FONT }}>
          {appliedFx?.size > 0 && <div style={{ color: C.green, marginBottom: 2 }}>{t("treatment.applied", { n: appliedFx.size })}</div>}
          {pendingFx?.size > 0 && <div style={{ color: C.yellow }}>{t("treatment.inProgress", { n: pendingFx.size })}</div>}
        </div>
      )}
    </>
  );
}
