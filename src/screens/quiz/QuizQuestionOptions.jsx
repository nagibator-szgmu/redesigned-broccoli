import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";

export default function QuizQuestionOptions({
  options,
  correctIndex,
  selectedOption,
  answered,
  onSelect,
}) {
  const C = useTheme();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
      {options.map((opt, i) => {
        const isSelected = selectedOption === i;
        const isCorrectOption = answered && i === correctIndex;
        const isWrongSelected = answered && isSelected && i !== correctIndex;

        let borderColor = C.border;
        let bgColor = "transparent";
        if (isCorrectOption) {
          borderColor = C.green;
          bgColor = `${C.green}12`;
        } else if (isWrongSelected) {
          borderColor = C.red;
          bgColor = `${C.red}12`;
        } else if (isSelected) {
          borderColor = C.accent;
          bgColor = `${C.accent}12`;
        }

        const circleColor = isCorrectOption
          ? C.green
          : isWrongSelected
          ? C.red
          : isSelected
          ? C.accent
          : C.textDim;

        return (
          <div
            key={i}
            onClick={() => onSelect(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 10,
              border: `1px solid ${borderColor}`,
              background: bgColor,
              cursor: answered ? "default" : "pointer",
              transition: "all 0.15s",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: `2px solid ${circleColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: isCorrectOption ? C.green : isWrongSelected ? C.red : "transparent",
              }}
            >
              {isCorrectOption && <span style={{ fontSize: 11, color: "#000", fontWeight: 900 }}>✓</span>}
              {isWrongSelected && <span style={{ fontSize: 11, color: "#fff", fontWeight: 900 }}>✗</span>}
            </div>
            <span
              style={{
                fontSize: 13,
                color: isCorrectOption ? C.green : isWrongSelected ? C.red : C.text,
                fontFamily: FONT,
                lineHeight: 1.5,
              }}
            >
              {opt}
            </span>
          </div>
        );
      })}
    </div>
  );
}
