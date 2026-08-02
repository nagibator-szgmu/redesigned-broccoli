import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { DIAGNOSTICS } from "../../data/diagnostics";

export default function DiagFilterBar({ diagCat, setDiagCat, t }) {
  const C = useTheme();
  const diagCats = ["all", ...new Set(DIAGNOSTICS.map(d => d.cat))];
  const DIAG_CAT_LABELS = { all: t("diagCat.all"), cardiac: t("diagCat.cardiac"), lab: t("diagCat.lab"), respiratory: t("diagCat.respiratory"), imaging: t("diagCat.imaging"), neuro: t("diagCat.neuro") };

  return (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
      {diagCats.map(cat => (
        <button key={cat} onClick={() => setDiagCat(cat)} className="filter-pill" style={{
          background: diagCat === cat ? `${C.accent}1a` : C.btnBg,
          border: `1px solid ${diagCat === cat ? C.accent : "rgba(0,230,200,0.1)"}`,
          borderRadius: 12, padding: "4px 12px", cursor: "pointer", fontFamily: FONT,
          fontSize: 12, color: diagCat === cat ? C.accent : C.textDim,
        }}>{DIAG_CAT_LABELS[cat] ?? cat}</button>
      ))}
    </div>
  );
}
