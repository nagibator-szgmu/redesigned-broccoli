import React, { useState } from "react";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";
import { CAT_COLOR } from "../../data/diagnostics";
import { TREATMENTS } from "../../data/treatments";
import { IconAlertTriangle } from "../../ui/icons";
import TooltipBtn from "./TooltipBtn";
import SearchableCombobox from "../ui/SearchableCombobox";

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
          placeholder={t("search.placeholderTreat") || "Фильтр списка..."}
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

      {/* List of Treatments */}
      <div className="no-scrollbar" style={{
        flex: 1, overflowY: "auto", display: "flex", flexDirection: "column",
        gap: 5, paddingRight: 2
      }}>
        {filtTreat.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: C.textDim, fontSize: 12 }}>
            Ничего не найдено
          </div>
        ) : (
          filtTreat.map(item => {
            const isSelected = selTreat.includes(item.id);
            const isPending = pendingFx?.has(item.id);
            const isApplied = appliedFx?.has(item.id);
            const isDangerous = cd?.wrongTreat?.includes(item.id);
            const isContraindicated = cd?.contraindicatedTreat?.includes(item.id);
            const isBad = isDangerous || isContraindicated;

            return (
              <div
                key={item.id}
                onClick={() => toggleTreatment(item.id)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: isMobile ? "8px 10px" : "8px 12px",
                  borderRadius: 10,
                  background: isSelected
                    ? isBad && !hideWarnings ? `${C.red}18` : `${C.green}15`
                    : C.panelBg,
                  border: `1px solid ${
                    isSelected
                      ? isBad && !hideWarnings ? C.red : C.green
                      : C.border
                  }`,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  userSelect: "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 4,
                    border: `1.5px solid ${isSelected ? (isBad && !hideWarnings ? C.red : C.green) : C.border}`,
                    background: isSelected ? (isBad && !hideWarnings ? C.red : C.green) : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {isSelected && <span style={{ color: C.bg, fontSize: 10, fontWeight: 900 }}>✓</span>}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 12.5, fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? C.white : C.text,
                      lineHeight: 1.3,
                      display: "flex", alignItems: "center", gap: 6
                    }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name}
                      </span>
                      {isBad && isSelected && !hideWarnings && (
                        <IconAlertTriangle size={13} color={C.red} />
                      )}
                    </div>
                    {item.desc && (
                      <div style={{ fontSize: 10, color: C.textDim, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.desc}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badges */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  {isPending && (
                    <span style={{
                      fontSize: 9.5, color: C.yellow, background: `${C.yellow}15`,
                      border: `1px solid ${C.yellow}33`, padding: "1px 6px", borderRadius: 4,
                      display: "flex", alignItems: "center", gap: 3
                    }}>
                      <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span>
                      {item.delaySec ? `${item.delaySec}с` : "..."}
                    </span>
                  )}
                  {isApplied && (
                    <span style={{
                      fontSize: 9.5, color: C.green, background: `${C.green}15`,
                      border: `1px solid ${C.green}33`, padding: "1px 6px", borderRadius: 4,
                      fontWeight: 600
                    }}>
                      Активно
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
