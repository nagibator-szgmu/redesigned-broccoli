import React, { useState, useMemo } from "react";
import { FONT, CODE } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import { TREATMENTS } from "../../../data/treatments";
import { CAT_COLOR } from "../../../data/diagnostics";
import { IconCheck, IconSiren, IconAlertTriangle, IconSearch, IconX, IconRefresh } from "../../../ui/icons";
import { TREAT_GROUPS, matchTreatGroup } from "../../../components/game/treat/treatGroups";
import TooltipBtn from "../../../components/game/TooltipBtn";
import { DAY_COLORS } from "./constants";

/** Treatment selection panel in stationary game with ICU-like category tabs and search */
export default function TreatPanel({
  cd, selTreat = [], setSelTreat, toggleTreatment, handleEndDay, canProceedFromTreat,
  cycle, appliedFx, pendingFx, treatCat = "all", setTreatCat,
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const dayColor = DAY_COLORS[cycle.currentDay % 7];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState(treatCat || "all");

  const q = searchQuery.trim().toLowerCase();
  const lastTreatments = cycle?.dayHistory?.[cycle.dayHistory.length - 1]?.treatments;
  const canRepeat = cycle?.currentDay > 0 && Array.isArray(lastTreatments) && lastTreatments.length > 0;

  const handleRepeatYesterday = () => {
    if (!canRepeat) return;
    if (setSelTreat) setSelTreat([...lastTreatments]);
    else if (toggleTreatment) lastTreatments.forEach((tId) => { if (!selTreat.includes(tId)) toggleTreatment(tId); });
  };

  const handleGroupChange = (gid) => { setActiveGroup(gid); setTreatCat?.(gid); };

  const filteredTreatments = useMemo(() => {
    return TREATMENTS.filter((item) => {
      const matchesGrp = matchTreatGroup(item, activeGroup);
      const matchesQ = !q || item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
      return matchesGrp && matchesQ;
    });
  }, [activeGroup, q]);

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px" }}>
      {/* Шапка с подсказками */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: dayColor, fontFamily: FONT }}>
          {t("treatment.title")} ({t("stationary.day", { n: cycle.currentDay + 1 })})
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <TooltipBtn text={t("onboarding.tooltipTreatDelay")} C={C} />
          <TooltipBtn text={t("onboarding.tooltipContinuous")} C={C} />
        </div>
      </div>

      {/* Кнопка повтора вчерашнего курса */}
      {canRepeat && (
        <button
          type="button"
          onClick={handleRepeatYesterday}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            width: "100%", padding: "5px 10px", marginBottom: 6, borderRadius: 6,
            border: `1px solid ${C.accent}44`, background: `${C.accent}14`,
            color: C.accent, fontSize: 11.5, fontWeight: 600, fontFamily: FONT, cursor: "pointer",
          }}
        >
          <IconRefresh size={12} color={C.accent} />
          <span>Повторить вчерашний курс ({lastTreatments.length})</span>
        </button>
      )}

      {/* Горизонтальные вкладки категорий как в ОРИТ */}
      <div className="no-scrollbar" style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4, marginBottom: 6, flexShrink: 0, WebkitOverflowScrolling: "touch" }}>
        {TREAT_GROUPS.map((g) => {
          const isActive = activeGroup === g.id;
          const groupSelCount = selTreat.filter((id) => {
            const tr = TREATMENTS.find((x) => x.id === id);
            return tr && matchTreatGroup(tr, g.id);
          }).length;
          return (
            <button
              key={g.id} type="button" onClick={() => handleGroupChange(g.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6,
                border: `1px solid ${isActive ? C.green : C.btnBorder || C.border}`,
                background: isActive ? `${C.green}20` : C.panelBg2,
                color: isActive ? C.green : C.textDim, fontSize: 11, fontWeight: isActive ? 700 : 500,
                fontFamily: FONT, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              <span>{g.label}</span>
              {groupSelCount > 0 && (
                <span style={{ background: `${C.green}30`, color: C.green, borderRadius: 9999, fontSize: 9, fontWeight: 700, fontFamily: CODE, padding: "0 4px" }}>
                  {groupSelCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Компактный поиск */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.headerBg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 8px", marginBottom: 6 }}>
        <IconSearch size={12} color={C.textDim} />
        <input
          type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("search.placeholderTreat") || "Поиск препаратов..."}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontFamily: FONT, fontSize: 11.5 }}
        />
        {searchQuery && (
          <button type="button" onClick={() => setSearchQuery("")} style={{ background: "transparent", border: "none", color: C.textDim, cursor: "pointer", padding: 0 }}>
            <IconX size={11} />
          </button>
        )}
      </div>

      {/* Предупреждение об опасности */}
      <div style={{ background: C.redDim, border: `1px solid ${C.red}33`, borderRadius: 6, padding: "4px 8px", marginBottom: 6, fontSize: 11, color: C.red, fontFamily: FONT }}>
        {t("treatment.dangerous")}
      </div>

      {/* Список препаратов выбранной вкладки со скроллом */}
      <div className="no-scrollbar" style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 180, overflowY: "auto", paddingRight: 2 }}>
        {filteredTreatments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "12px", color: C.textDim, fontSize: 11, fontFamily: FONT }}>{t("cases.empty")}</div>
        ) : (
          filteredTreatments.map((item) => {
            const selected = selTreat.includes(item.id);
            const isPending = pendingFx?.has(item.id);
            const isApplied = appliedFx?.has(item.id);
            const isDanger = cd?.wrongTreat?.includes(item.id);
            const color = isDanger && selected ? C.red : (CAT_COLOR[item.cat] || dayColor);
            return (
              <div
                key={item.id} onClick={() => toggleTreatment(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6,
                  cursor: "pointer", background: selected ? (isDanger ? `${C.red}18` : `${color}18`) : "transparent",
                  border: `1px solid ${selected ? color : C.border}`,
                }}
              >
                <div style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${selected ? color : C.textDim}`, background: selected ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {selected && <IconCheck size={10} color="#000" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: 12, color: selected ? C.white : isDanger ? `${C.red}cc` : C.text, fontFamily: FONT, flex: 1, lineHeight: 1.3 }}>
                  {item.name}
                </span>
                {isPending && <div style={{ width: 8, height: 8, border: `2px solid ${C.yellow}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />}
                {isApplied && !isDanger && <IconCheck size={13} color={C.green} />}
                {isApplied && isDanger && <IconSiren size={13} color={C.red} />}
                {!selected && isDanger && <IconAlertTriangle size={13} color={`${C.red}88`} />}
              </div>
            );
          })
        )}
      </div>

      {/* Кнопка завершения дня */}
      <button
        onClick={handleEndDay} disabled={!canProceedFromTreat}
        style={{
          width: "100%", marginTop: 8, padding: "9px", borderRadius: 8,
          background: canProceedFromTreat ? `linear-gradient(135deg,${dayColor},${C.accent})` : `${C.textDim}30`,
          border: "none", fontSize: 12.5, fontWeight: 700, color: canProceedFromTreat ? C.bg : C.textDim,
          cursor: canProceedFromTreat ? "pointer" : "not-allowed", fontFamily: FONT,
        }}
      >
        {t("stationary.endDay")} ({selTreat.length})
      </button>
    </div>
  );
}
