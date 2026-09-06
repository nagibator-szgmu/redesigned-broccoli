import { useState } from "react";
import { FONT } from "../../ui/theme";
import { useTranslate } from "../../locale/useTranslate";

function DrugSection({ label, items, color, C }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color, fontFamily: FONT, marginBottom: 4 }}>
        {label}:
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ fontSize: 12, color: C.text, fontFamily: FONT, lineHeight: 1.5, paddingLeft: 10, marginBottom: 2 }}>
          • {item}
        </div>
      ))}
    </div>
  );
}

function DrugCard({ drug, C }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslate();

  return (
    <div style={{
      marginBottom: 10, borderRadius: 12, background: C.panelBg,
      border: `1px solid ${expanded ? "rgba(0,230,200,0.2)" : C.btnBorder}`,
      overflow: "hidden", transition: "all 0.15s",
    }}>
      <div
        onClick={() => setExpanded((v) => !v)}
        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer" }}
      >
        <div style={{
          width: 8, height: 8, borderRadius: "50%", background: C.accent,
          flexShrink: 0, opacity: expanded ? 1 : 0.5,
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.white, fontFamily: FONT }}>
            {drug.name}
          </div>
          <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>
            {drug.category}
          </div>
        </div>
        <span style={{
          fontSize: 10, color: C.textDim,
          transform: expanded ? "rotate(90deg)" : "rotate(0)",
          transition: "transform 0.15s",
        }}>
          ▶
        </span>
      </div>

      {expanded && (
        <div style={{ padding: "0 16px 14px" }}>
          <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, fontFamily: FONT, marginBottom: 10 }}>
            <span style={{ color: C.accent, fontWeight: 600 }}>{t("theory.mechanism")}</span>
            {drug.mechanism}
          </div>

          <DrugSection label={t("theory.indications")} items={drug.indications} color={C.green} C={C} />
          <DrugSection label={t("theory.contraindications")} items={drug.contraindications} color={C.red} C={C} />

          {drug.dosage && (
            <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, fontFamily: FONT, marginBottom: 8 }}>
              <span style={{ color: C.yellow, fontWeight: 600 }}>{t("theory.dosage")}</span>
              {drug.dosage}
            </div>
          )}

          {drug.sideEffects?.length > 0 && (
            <DrugSection label={t("theory.sideEffects")} items={drug.sideEffects} color={C.orange} C={C} />
          )}

          {drug.usedInCases?.length > 0 && (
            <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, marginTop: 8 }}>
              <span style={{ color: C.accent }}>{t("theory.usedInCases")}</span>
              {drug.usedInCases.map((id) => `#${id}`).join(", ")}
            </div>
          )}

          {drug.notes && (
            <div style={{
              fontSize: 11, color: C.textDim, fontFamily: FONT, marginTop: 8,
              padding: "6px 10px", borderRadius: 6,
              background: "rgba(0,230,200,0.04)", border: "1px solid rgba(0,230,200,0.08)",
            }}>
              {drug.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DrugGroupView({ drugs, groupName, C }) {
  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.white, fontFamily: FONT, margin: "0 0 20px" }}>
        {groupName}
      </h1>
      {drugs.map((drug) => (
        <DrugCard key={drug.id} drug={drug} C={C} />
      ))}
    </div>
  );
}
