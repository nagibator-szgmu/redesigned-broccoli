import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";

/** Step indicator bar with accessible navigation */
export function StepBar({ steps, activeStep, onStepClick, canClickStep }) {
  const C = useTheme();
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
      {steps.map((s, i) => {
        const isClickable = canClickStep ? canClickStep(i) : i <= activeStep;
        return (
          <div
            key={s.key}
            onClick={() => onStepClick && isClickable && onStepClick(s.key)}
            style={{
              flex: 1,
              padding: "8px 6px",
              borderRadius: 8,
              background: i === activeStep ? `${C.accent}15` : "transparent",
              border: `1px solid ${i === activeStep ? C.accent : C.border}`,
              textAlign: "center",
              cursor: isClickable && onStepClick ? "pointer" : "default",
              opacity: isClickable ? 1 : 0.4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 16 }}>
              {s.icon}
            </div>
            <div style={{ fontSize: 10, color: i === activeStep ? C.accent : C.textDim, fontFamily: FONT, marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
