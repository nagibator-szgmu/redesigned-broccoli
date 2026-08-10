import React, { useState } from "react";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";
import { CAT_COLOR } from "../../data/diagnostics";
import { TREATMENTS } from "../../data/treatments";
import { IconAlertTriangle } from "../../ui/icons";
import TooltipBtn from "./TooltipBtn";

/** Helper to match treatments to clinical groups */
function matchGroup(item, cat) {
  if (!cat || cat === "all") return true;
  if (cat === "emergency") {
    return ["intubation", "defibrillation", "chest_compressions", "pericardiocentesis", "epinephrine_im", "naloxone", "atropine", "activated_charcoal", "gastric_lavage", "succinylcholine"].includes(item.id) || item.cat === "intervention";
  }
  if (cat === "analgesia") {
    return ["morphine", "ketamine", "diazepam", "levetiracetam"].includes(item.id) || item.cat === "analgesic" || item.cat === "anticonvulsant";
  }
  if (cat === "cardiovascular") {
    return ["aspirin", "heparin", "thrombolysis", "nitroglycerin", "metoprolol", "amiodarone", "pci", "ACE_inhibitor", "digoxin", "nimodipine", "magnesium", "dopamine", "vasopressin", "norepinephrine", "epinephrine"].includes(item.id) || ["cardiac", "antiplatelet", "anticoagulant", "betablocker", "antiarrhythmic", "vasopressor"].includes(item.cat);
  }
  if (cat === "respiratory") {
    return ["oxygen", "steroids", "intubation"].includes(item.id) || item.cat === "supportive" || item.cat === "steroid";
  }
  if (cat === "antimicrobial") {
    return ["antibiotics_broad", "acyclovir"].includes(item.id) || item.cat === "antibiotic" || item.cat === "antiviral";
  }
  if (cat === "fluid") {
    return ["iv_fluids", "warm_iv", "blood_transfusion", "furosemide", "mannitol", "dialysis", "aminocaproic_acid"].includes(item.id) || item.cat === "diuretic" || item.cat === "renal";
  }
  if (cat === "other") {
    return ["insulin", "dextrose", "thyroxine", "surgery_consult"].includes(item.id) || item.cat === "endocrine";
  }
  // Fallbacks for legacy category strings
  if (cat === "meds") return item.cat !== "intervention";
  if (cat === "invasive") return item.cat === "intervention";
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
    { id: "all", label: "Все" },
    { id: "emergency", label: "Экстренные" },
    { id: "cardiovascular", label: "Кардио" },
    { id: "analgesia", label: "Анальгезия" },
    { id: "respiratory", label: "Дыхание" },
    { id: "antimicrobial", label: "Антимикробные" },
    { id: "fluid", label: "Инфузии" },
    { id: "other", label: "Прочие" }
  ];

  const q = searchQuery.trim().toLowerCase();
  const filtTreat = TREATMENTS.filter(item => {
    const groupMatch = matchGroup(item, treatCat);
    const searchMatch = !q || item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
    return groupMatch && searchMatch;
  });

  const hideWarnings = localStorage.getItem("ms_hideWarnings") === "true";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {showHeader && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, ...(isMobile ? { marginBottom: 4 } : {}) }}>
          <STitle icon="💊" label={t("treatment.title") || "Назначения"} color={C.green} />
          {!isMobile && (
            <>
              <TooltipBtn text={t("onboarding.tooltipTreatDelay") || "Время до начала действия"} C={C} />
              <TooltipBtn text={t("onboarding.tooltipContinuous") || "Непрерывный эффект"} C={C} />
            </>
          )}
        </div>
      )}

      {/* Search Bar with clear button */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: C.headerBg2, border: `1px solid ${C.border}`,
        borderRadius: 10, padding: "6px 12px", marginBottom: 8, backdropFilter: "blur(8px)"
      }}>
        <span style={{ fontSize: 13, color: C.textDim }}>🔍</span>
        <input
          className="seamless-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("search.placeholderTreat") || "Поиск препаратов и процедур..."}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontFamily: FONT, fontSize: 13 }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} style={{ background: "transparent", border: "none", color: C.textDim, cursor: "pointer", padding: "2px 4px", fontSize: 13 }}>
            ✕
          </button>
        )}
      </div>

      {/* Clinical Category Filter Chips */}
      <div className="no-scrollbar" style={{
        display: "flex", gap: 4, overflowX: "auto", paddingBottom: 6, marginBottom: 8,
        flexShrink: 0, WebkitOverflowScrolling: "touch"
      }}>
        {GROUPS.map(g => {
          const isActive = (treatCat || "all") === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setTreatCat?.(g.id)}
              style={{
                padding: "4px 10px",
                borderRadius: 8,
                border: `1px solid ${isActive ? C.green : C.btnBorder}`,
                background: isActive ? `${C.green}20` : C.btnBg,
                color: isActive ? C.green : C.textDim,
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                fontFamily: FONT,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s"
              }}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      {/* Closed-Loop Clinical Nudge Reminder */}
      {selTreat.length >= 3 && (
        <div style={{
          padding: "6px 10px", borderRadius: 8, marginBottom: 8,
          background: `${C.accent}12`, border: `1px solid ${C.accent}40`,
          display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: C.text, fontFamily: FONT
        }}>
          <span>🔄</span>
          <span><strong>Контроль ответа:</strong> Назначено {selTreat.length} вмешательств. Оцените физиологический ответ (Reassessment) для проверки эффекта.</span>
        </div>
      )}

      {/* Treatments List Grid */}
      <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, paddingBottom: 8 }}>
        {filtTreat.map(item => {
          const isSelected = selTreat.includes(item.id);
          const isApplied = appliedFx?.has(item.id);
          const isPending = pendingFx?.has(item.id);
          const isWrong = cd?.wrongTreat?.includes(item.id);
          const color = CAT_COLOR[item.cat] || C.accent;

          return (
            <button
              key={item.id}
              onClick={() => toggleTreatment(item.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: "8px 10px",
                borderRadius: 10,
                minHeight: 64,
                background: isApplied ? `${C.green}18` : isPending ? `${C.yellow}18` : isSelected ? `${color}18` : C.btnBg,
                border: `1px solid ${isApplied ? C.green : isPending ? C.yellow : isSelected ? color : C.btnBorder}`,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                position: "relative"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", width: "100%", justifyContent: "space-between", gap: 4 }}>
                <span style={{ fontSize: 11.5, fontFamily: FONT, fontWeight: isSelected ? 700 : 500, color: isSelected ? C.white : C.text, lineHeight: 1.3 }}>
                  {item.name}
                </span>
                {!hideWarnings && isWrong && isSelected && (
                  <span title="Высокий риск осложнений" style={{ color: C.red, display: "inline-flex", flexShrink: 0 }}>
                    <IconAlertTriangle size={12} color="currentColor" />
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: 4 }}>
                <span style={{ fontSize: 9.5, color: isApplied ? C.green : isPending ? C.yellow : C.textDim, fontFamily: FONT }}>
                  {isApplied ? "✓ Введено" : isPending ? "⏳ Действует..." : isSelected ? "Назначено" : item.cat}
                </span>
                {isSelected && (
                  <span style={{ fontSize: 10, color: isApplied ? C.green : isPending ? C.yellow : color, fontWeight: 700 }}>
                    ●
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
