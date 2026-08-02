import { useState } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import { CAT_COLOR, DIAGNOSTICS } from "../../../data/diagnostics";
import { STitle, Btn, CheckRow } from "../../../ui/components";
import DiagFilterBar from "../DiagFilterBar";

/** Diagnostics selection tab component */
export default function DiagTab({
  selDiag,
  setSelDiag,
  orderedDiag = [],
  diagCat,
  setDiagCat,
  handleOrderTests,
  processingTests,
  t
}) {
  const C = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDiagnostics = DIAGNOSTICS.filter(item => {
    const matchesCat = !diagCat || diagCat === "all" || item.cat === diagCat;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery = !q || item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const toggleDiag = (id) => {
    setSelDiag(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "12px 14px", boxSizing: "border-box" }}>
      <STitle icon="🔬" label={t("orderTests.title")} color={C.accent} />

      <div style={{ marginBottom: 10 }}>
        <DiagFilterBar
          diagCat={diagCat}
          setDiagCat={setDiagCat}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          matchCount={filteredDiagnostics.length}
          totalCount={DIAGNOSTICS.length}
          t={t}
        />
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", paddingRight: 4, display: "flex", flexDirection: "column", gap: 4 }}>
        {filteredDiagnostics.map(item => (
          <CheckRow
            key={item.id}
            item={item}
            selected={selDiag.includes(item.id)}
            onToggle={toggleDiag}
            color={CAT_COLOR[item.cat] || C.accent}
            disabled={processingTests || orderedDiag.includes(item.id)}
          />
        ))}
      </div>

      <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: C.textDim, fontFamily: FONT }}>
          {t("orderTests.selected", { n: selDiag.length })}
        </span>
        <Btn
          onClick={handleOrderTests}
          disabled={selDiag.length === 0 || processingTests}
          color={C.accent}
          style={{ padding: "8px 20px", fontSize: 13 }}
        >
          {t("orderTests.send")}
        </Btn>
      </div>
    </div>
  );
}
