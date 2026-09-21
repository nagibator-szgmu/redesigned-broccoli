import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTheme } from "../../../../ui/ThemeContext";
import { FONT, CODE } from "../../../../ui/theme";
import { STitle } from "../../../../ui/components";
import { searchICD10 } from "../../../../data/icd10";

/**
 * Секция ввода клинического диагноза с интерактивным поиском и автодополнением по МКБ-10.
 */
export default function DiagnosisSearchSection({ diagText, setDiagText, t }) {
  const C = useTheme();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(-1);
  const searchContainerRef = useRef(null);

  const suggestions = useMemo(() => {
    if (!diagText || diagText.trim().length < 2) return [];
    return searchICD10(diagText, 7);
  }, [diagText]);

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
    const formatted = `${item.name} (${item.code})`;
    setDiagText(formatted);
    setShowSuggestions(false);
    setActiveSuggestionIdx(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIdx((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIdx((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeSuggestionIdx >= 0 && activeSuggestionIdx < suggestions.length) {
      e.preventDefault();
      handleSelectICD(suggestions[activeSuggestionIdx]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
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
          onChange={(e) => {
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
  );
}
