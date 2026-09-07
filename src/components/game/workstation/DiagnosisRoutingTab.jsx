import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import { STitle, Btn } from "../../../ui/components";
import { ROUTE_ICONS } from "../../../screens/game/OutpatientPanels";
import { DIAGNOSTICS } from "../../../data/diagnostics";
import { searchICD10 } from "../../../data/icd10";

/**
 * Вкладка формулировки клинического диагноза, обоснования (опорные критерии),
 * интерактивного поиска МКБ-10 и маршрутизации.
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
  const [selectedCriteria, setSelectedCriteria] = useState(new Set());
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(-1);
  const searchContainerRef = useRef(null);

  const isAdmission = cd?.department === "admission";
  const hasRouteOptions = Boolean(cd?.routeOptions && cd.routeOptions.length > 0);
  const canSubmit = isAdmission && hasRouteOptions
    ? selTreat.length > 0 && selectedRoute !== null
    : selTreat.length > 0;

  // Поиск по МКБ-10
  const suggestions = useMemo(() => {
    if (!diagText || diagText.trim().length < 2) return [];
    return searchICD10(diagText, 7);
  }, [diagText]);

  // Закрытие выпадающего списка при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectICD = (item) => {
    // Вставляем клиническую формулировку с кодом МКБ-10
    const formatted = `${item.name} (${item.code})`;
    setDiagText(formatted);
    setShowSuggestions(false);
    setActiveSuggestionIdx(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIdx(prev => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIdx(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeSuggestionIdx >= 0 && activeSuggestionIdx < suggestions.length) {
      e.preventDefault();
      handleSelectICD(suggestions[activeSuggestionIdx]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Извлечение клинических критериев (анамнез, физикальные данные, выполненные исследования)
  const availableCriteria = useMemo(() => {
    if (!cd) return [];
    const items = [];

    // 1. Жалобы и ведущие симптомы
    if (cd.complaint) {
      items.push({
        id: "complaint",
        category: "Жалобы",
        icon: "💬",
        label: cd.complaint,
      });
    }

    // 2. Гемодинамические и витальные маркеры
    if (cd.vitals) {
      const sbp = parseInt(String(cd.vitals.bp || "").split("/")[0], 10);
      if (sbp && sbp < 90) {
        items.push({
          id: "vital_hypotension",
          category: "Гемодинамика",
          icon: "🚨",
          label: `Гипотензия / шок (АД ${cd.vitals.bp} мм рт. ст.)`,
        });
      }
      if (cd.vitals.hr >= 100) {
        items.push({
          id: "vital_tachycardia",
          category: "Гемодинамика",
          icon: "⚡",
          label: `Тахикардия (ЧСС ${cd.vitals.hr} уд/мин)`,
        });
      } else if (cd.vitals.hr < 50) {
        items.push({
          id: "vital_bradycardia",
          category: "Гемодинамика",
          icon: "⚡",
          label: `Брадикардия (ЧСС ${cd.vitals.hr} уд/мин)`,
        });
      }
      if (cd.vitals.spo2 && cd.vitals.spo2 < 93) {
        items.push({
          id: "vital_hypoxia",
          category: "Дыхание",
          icon: "🫁",
          label: `Острая гипоксемия (SpO₂ ${cd.vitals.spo2}%)`,
        });
      }
      if (cd.vitals.rr && cd.vitals.rr >= 24) {
        items.push({
          id: "vital_tachypnea",
          category: "Дыхание",
          icon: "🫁",
          label: `Тахипноэ / одышка (ЧД ${cd.vitals.rr} в мин)`,
        });
      }
    }

    // 3. Выполненные исследования и их результаты
    orderedDiag.forEach(testId => {
      const diagInfo = DIAGNOSTICS.find(d => d.id === testId);
      const testName = diagInfo?.name || testId;
      const resultText = cd.testResults?.[testId];

      if (resultText) {
        items.push({
          id: `test_${testId}`,
          category: "Исследования",
          icon: "🔬",
          label: `${testName}: ${resultText}`,
        });
      }
    });

    return items;
  }, [cd, orderedDiag]);

  const toggleCriterion = (id) => {
    setSelectedCriteria(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const doSubmit = () => {
    if (isAdmission && setExtraResult) {
      setExtraResult({
        selectedRoute,
        routeOptions: cd.routeOptions,
        correctRoute: cd.correctRoute,
        selectedCriteria: Array.from(selectedCriteria),
      });
    }
    handleSubmit(false);
  };

  return (
    <div style={{ height: "100%", padding: "12px 14px", overflowY: "auto", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Секция 1: Формулировка клинического диагноза и поиск МКБ-10 */}
      <div
        ref={searchContainerRef}
        style={{
          background: C.panelBg,
          border: `1px solid ${C.purple}33`,
          borderRadius: 12,
          padding: "12px 14px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <STitle icon="🩺" label={t("diagnose.title")} color={C.purple} />
          <span style={{ fontSize: 10, color: C.textDim, fontFamily: CODE }}>МКБ-10 поиск активен</span>
        </div>
        <p style={{ margin: "0 0 8px 0", fontSize: 11, color: C.textDim, fontFamily: FONT, lineHeight: 1.4 }}>
          Сформулируйте основной клинический диагноз или начните вводить для подсказки по МКБ-10:
        </p>

        <div style={{ position: "relative" }}>
          <textarea
            value={diagText}
            onChange={e => {
              setDiagText(e.target.value);
              setShowSuggestions(true);
              setActiveSuggestionIdx(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={t("diagnose.placeholder")}
            style={{
              width: "100%",
              minHeight: 75,
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

          {/* Выпадающий список подсказок МКБ-10 */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: 6,
                background: "#0d131f",
                border: `1px solid ${C.accent}`,
                borderRadius: 10,
                boxShadow: "0 12px 36px rgba(0,0,0,0.9), 0 0 15px rgba(0,230,200,0.15)",
                zIndex: 100,
                overflow: "hidden",
                maxHeight: 250,
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  padding: "6px 12px",
                  background: `${C.accent}18`,
                  borderBottom: `1px solid ${C.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 10.5,
                  fontFamily: FONT,
                  color: C.accent,
                  fontWeight: 600,
                }}
              >
                <span>Подсказки нозологий и кодов МКБ-10:</span>
                <span style={{ fontSize: 9.5, color: C.textDim }}>Нажмите для выбора (или Enter)</span>
              </div>
              {suggestions.map((item, idx) => {
                const isSelected = idx === activeSuggestionIdx;
                return (
                  <div
                    key={`${item.code}-${idx}`}
                    onClick={() => handleSelectICD(item)}
                    style={{
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      cursor: "pointer",
                      background: isSelected ? `${C.accent}22` : "transparent",
                      borderBottom: `1px solid ${C.border}22`,
                      transition: "background 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <span
                        style={{
                          background: `${C.purple}33`,
                          border: `1px solid ${C.purple}77`,
                          color: C.purple,
                          fontSize: 10,
                          fontWeight: 700,
                          fontFamily: CODE,
                          padding: "2px 6px",
                          borderRadius: 4,
                          flexShrink: 0,
                        }}
                      >
                        {item.code}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: isSelected ? C.accent : C.white,
                          fontFamily: FONT,
                          fontWeight: 500,
                          lineHeight: 1.3,
                          wordBreak: "break-word",
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 9.5,
                        color: C.textDim,
                        fontFamily: FONT,
                        flexShrink: 0,
                        background: C.btnBg,
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Секция 2: Клиническое обоснование диагноза (Опорные критерии) */}
      <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
          <STitle icon="📋" label="Опорные диагностические критерии" color={C.accent} />
          <span style={{ fontSize: 11, color: selectedCriteria.size > 0 ? C.green : C.textDim, fontFamily: FONT, fontWeight: 600 }}>
            Выбрано: {selectedCriteria.size} из {availableCriteria.length}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 11, color: C.textDim, fontFamily: FONT, lineHeight: 1.4 }}>
          Отметьте данные анамнеза, осмотра и исследований, на которых базируется ваш диагноз:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
          {availableCriteria.length === 0 ? (
            <div style={{ padding: "12px", textAlign: "center", color: C.textDim, fontSize: 12, fontStyle: "italic", background: C.headerBg2, borderRadius: 8 }}>
              Назначьте исследования во вкладке «Исследования», чтобы получить объективные данные для обоснования.
            </div>
          ) : (
            availableCriteria.map(crit => {
              const isChecked = selectedCriteria.has(crit.id);
              return (
                <div
                  key={crit.id}
                  onClick={() => toggleCriterion(crit.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                    background: isChecked ? `${C.accent}14` : C.btnBg,
                    border: `1px solid ${isChecked ? `${C.accent}66` : C.btnBorder}`,
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: `1.5px solid ${isChecked ? C.accent : C.textDim}`,
                      background: isChecked ? C.accent : "transparent",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      marginTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    {isChecked ? "✓" : ""}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 12 }}>{crit.icon}</span>
                      <span style={{ fontSize: 10, color: isChecked ? C.accent : C.textDim, textTransform: "uppercase", fontWeight: 700, fontFamily: CODE, letterSpacing: 0.5 }}>
                        {crit.category}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: isChecked ? C.white : C.text, fontFamily: FONT, lineHeight: 1.4, wordBreak: "break-word" }}>
                      {crit.label}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Секция 3: Маршрутизация пациента (только если доступна для отделения) */}
      {hasRouteOptions && (
        <div style={{ background: C.panelBg, border: `1px solid ${selectedRoute ? `${C.green}44` : `${C.yellow}33`}`, borderRadius: 12, padding: "12px 14px" }}>
          <STitle icon="🚶" label={t("outpatient.routeTitle")} color={selectedRoute ? C.green : C.yellow} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
            {cd.routeOptions.map(opt => {
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

      {/* Секция 4: Сводка и завершение */}
      <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 12, fontFamily: FONT, display: "flex", flexDirection: "column", gap: 2 }}>
          <div>
            {selTreat.length > 0 ? (
              <span style={{ color: C.green }}>{t("diagnose.prescribed", { n: selTreat.length })}</span>
            ) : (
              <span style={{ color: C.yellow }}>{t("diagnose.treatTab")}</span>
            )}
          </div>
          {pendingFx?.size > 0 && (
            <div style={{ color: C.yellow, fontSize: 11 }}>
              {t("diagnose.active", { n: pendingFx.size })}
            </div>
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
