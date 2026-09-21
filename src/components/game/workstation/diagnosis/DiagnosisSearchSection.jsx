import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTheme } from "../../../../ui/ThemeContext";
import { FONT, CODE } from "../../../../ui/theme";
import { STitle } from "../../../../ui/components";
import { searchICD10 } from "../../../../data/icd10";
import ICDSuggestionsDropdown from "./ICDSuggestionsDropdown";

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

        {showSuggestions && (
          <ICDSuggestionsDropdown
            suggestions={suggestions}
            activeSuggestionIdx={activeSuggestionIdx}
            onSelect={handleSelectICD}
          />
        )}
      </div>
    </div>
  );
}
