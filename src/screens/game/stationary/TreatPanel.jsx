import React from "react";
import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import { TREATMENTS } from "../../../data/treatments";
import { CAT_COLOR } from "../../../data/diagnostics";
import TooltipBtn from "../../../components/game/TooltipBtn";
import SearchableCombobox from "../../../components/ui/SearchableCombobox";
import { DAY_COLORS } from "./constants";

/** Treatment selection panel in stationary game */
export default function TreatPanel({
  cd,
  selTreat,
  toggleTreatment,
  handleEndDay,
  canProceedFromTreat,
  cycle,
  appliedFx,
  pendingFx,
  treatCat,
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const dayColor = DAY_COLORS[cycle.currentDay % 7];

  const treatCats = [
    { id: "all", label: "Все" },
    { id: "emergency", label: "Экстренные" },
    { id: "cardiac", label: "Кардио" },
    { id: "analgesic", label: "Анальгезия" },
    { id: "supportive", label: "Дыхание / Оксигено" },
    { id: "antibiotic", label: "Антибиотики" },
    { id: "diuretic", label: "Диуретики" },
    { id: "steroid", label: "Гормоны" },
  ];

  const filtTreat = treatCat === "all" ? TREATMENTS : TREATMENTS.filter((item) => item.cat === treatCat);

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: dayColor, fontFamily: FONT }}>
          {t("treatment.title")} ({t("stationary.day", { n: cycle.currentDay + 1 })})
        </div>
        <TooltipBtn text={t("onboarding.tooltipTreatDelay")} C={C} />
        <TooltipBtn text={t("onboarding.tooltipContinuous")} C={C} />
      </div>
      <div style={{ background: C.redDim, border: "1px solid rgba(255,61,90,0.12)", borderRadius: 8, padding: "7px 10px", marginBottom: 10, fontSize: 12, color: C.red, fontFamily: FONT }}>
        {t("treatment.dangerous")}
      </div>

      <SearchableCombobox
        items={TREATMENTS}
        selectedIds={selTreat}
        onToggle={toggleTreatment}
        placeholder="Поиск препаратов и процедур..."
        categories={treatCats}
        catColors={CAT_COLOR}
        badgeColor={dayColor}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 220, overflowY: "auto", marginTop: 8 }}>
        {filtTreat.map((item) => {
          const selected = selTreat.includes(item.id);
          const isPending = pendingFx?.has(item.id);
          const isApplied = appliedFx?.has(item.id);
          const isDanger = cd?.wrongTreat?.includes(item.id);
          const color = isDanger && selected ? C.red : (CAT_COLOR[item.cat] || dayColor);
          return (
            <div
              key={item.id}
              onClick={() => toggleTreatment(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 12px",
                borderRadius: 8,
                cursor: "pointer",
                background: selected ? (isDanger ? `${C.red}18` : `${color}18`) : "transparent",
                border: `1px solid ${selected ? color : C.border}`,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  border: `2px solid ${selected ? color : C.textDim}`,
                  background: selected ? color : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {selected && <span style={{ fontSize: 10, color: "#000", fontWeight: 900 }}>✓</span>}
              </div>
              <span style={{ fontSize: 13, color: selected ? C.white : isDanger ? `${C.red}cc` : C.text, fontFamily: FONT, flex: 1, lineHeight: 1.4 }}>
                {item.name}
              </span>
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
      <button
        onClick={handleEndDay}
        disabled={!canProceedFromTreat}
        style={{
          width: "100%",
          marginTop: 10,
          padding: "10px",
          borderRadius: 10,
          background: canProceedFromTreat ? `linear-gradient(135deg,${dayColor},${C.accent})` : `${C.textDim}30`,
          border: "none",
          fontSize: 13,
          fontWeight: 700,
          color: canProceedFromTreat ? C.bg : C.textDim,
          cursor: canProceedFromTreat ? "pointer" : "not-allowed",
          fontFamily: FONT,
        }}
      >
        {t("stationary.endDay")}
      </button>
    </div>
  );
}
