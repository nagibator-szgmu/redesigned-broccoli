import React, { useState, useMemo } from "react";
import { FONT, CODE } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import { TREATMENTS } from "../../../data/treatments";
import { IconSearch, IconX, IconCheck, IconPill } from "../../../ui/icons";

const EXCLUDED_INVASIVE = new Set([
  "intubation", "defibrillation", "chest_compressions", "pericardiocentesis", "pci",
  "surgery_consult", "dialysis", "endoscopic_hemostasis", "biliary_decompression",
  "succinylcholine", "warm_iv", "blood_transfusion", "vasopressin", "norepinephrine",
  "epinephrine", "dopamine", "urapidil_iv", "mannitol", "ketamine",
]);

const OUTPATIENT_CATEGORIES = [
  { id: "all", label: "Все" },
  { id: "gastro", label: "Гастроэнтерология" },
  { id: "therapy", label: "Терапия / Кардио" },
  { id: "antimicrobial", label: "Антимикробные" },
  { id: "other", label: "Прочие" },
];

function matchOutpatientCategory(item, catId) {
  if (catId === "all") return true;
  if (catId === "gastro") {
    return item.cat === "gastro" || ["gluten_free_diet", "iron_iv", "spasmolytics"].includes(item.id);
  }
  if (catId === "therapy") {
    return ["cardiac", "antiplatelet", "anticoagulant", "betablocker", "diuretic"].includes(item.cat) ||
      ["metoprolol", "ACE_inhibitor", "aspirin", "furosemide"].includes(item.id);
  }
  if (catId === "antimicrobial") {
    return item.cat === "antibiotic" || item.cat === "antiviral";
  }
  return true;
}

export default function OutpatientTreatPanel({
  selTreat = [], setSelTreat, toggleTreatment, onSubmit, onBack,
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");

  const handleToggle = (id) => {
    if (setSelTreat) {
      setSelTreat((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    } else if (toggleTreatment) {
      toggleTreatment(id);
    }
  };

  const outpatientList = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TREATMENTS.filter((item) => {
      if (EXCLUDED_INVASIVE.has(item.id)) return false;
      if (!matchOutpatientCategory(item, activeCat)) return false;
      if (q && !item.name.toLowerCase().includes(q) && !item.id.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, activeCat]);

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: FONT, display: "flex", alignItems: "center", gap: 6 }}>
          <IconPill size={15} color={C.accent} />
          <span>{t("outpatient.prescribeTitle") || "Амбулаторные назначения и рецептурный лист"}</span>
        </div>
        <span style={{ fontSize: 11, fontFamily: CODE, color: selTreat.length > 0 ? C.green : C.textDim, background: `${C.accent}14`, padding: "2px 8px", borderRadius: 6 }}>
          {selTreat.length > 0 ? `Выписано: ${selTreat.length}` : (t("outpatient.noMedsNeeded") || "Без медикаментов")}
        </span>
      </div>

      <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 6, marginBottom: 8 }}>
        {OUTPATIENT_CATEGORIES.map((cat) => {
          const isActive = activeCat === cat.id;
          return (
            <button key={cat.id} type="button" onClick={() => setActiveCat(cat.id)}
              style={{
                padding: "4px 9px", borderRadius: 6, border: `1px solid ${isActive ? C.accent : C.border}`,
                background: isActive ? `${C.accent}20` : "transparent", color: isActive ? C.accent : C.textDim,
                fontSize: 11, fontWeight: isActive ? 700 : 500, fontFamily: FONT, cursor: "pointer", whiteSpace: "nowrap",
              }}>
              {cat.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.headerBg2 || `${C.border}30`, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 8px", marginBottom: 10 }}>
        <IconSearch size={13} color={C.textDim} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search.placeholderTreat") || "Поиск амбулаторных препаратов и диеты..."}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontFamily: FONT, fontSize: 12 }} />
        {search && (
          <button type="button" onClick={() => setSearch("")} style={{ background: "transparent", border: "none", color: C.textDim, cursor: "pointer", padding: 0 }}>
            <IconX size={12} />
          </button>
        )}
      </div>

      <div style={{ maxHeight: 280, overflowY: "auto", display: "grid", gridTemplateColumns: "1fr", gap: 6, marginBottom: 12, paddingRight: 2 }}>
        {outpatientList.map((item) => {
          const isSelected = selTreat.includes(item.id);
          return (
            <div key={item.id} onClick={() => handleToggle(item.id)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px",
                borderRadius: 8, border: `1px solid ${isSelected ? C.green : C.border}`,
                background: isSelected ? `${C.green}15` : `${C.cardBg || C.panel}`, cursor: "pointer", transition: "all 0.15s ease",
              }}>
              <div style={{ flex: 1, marginRight: 8 }}>
                <div style={{ fontSize: 12.5, fontWeight: isSelected ? 700 : 500, color: isSelected ? C.green : C.text, fontFamily: FONT }}>
                  {item.name}
                </div>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: 6, border: `1px solid ${isSelected ? C.green : C.border}`, background: isSelected ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {isSelected && <IconCheck size={12} color={C.bg} />}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {onBack && (
          <button type="button" onClick={onBack}
            style={{
              padding: "13px 14px", borderRadius: 10,
              background: "transparent", border: `1px solid ${C.border}`,
              fontSize: 13, fontWeight: 600, color: C.textDim,
              cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap",
            }}>
            ← {t("theory.back") || "Назад"}
          </button>
        )}
        <button type="button" onClick={onSubmit}
          style={{
            flex: 1, padding: "13px", borderRadius: 10,
            background: `linear-gradient(135deg,${C.accent},${C.green})`,
            border: "none", fontSize: 14, fontWeight: 700, color: C.bg,
            cursor: "pointer", fontFamily: FONT, boxShadow: `0 2px 8px ${C.accent}33`,
          }}>
          {t("outpatient.finishPrescribe") || "Завершить приём и выписать рецепт"}
        </button>
      </div>
    </div>
  );
}
