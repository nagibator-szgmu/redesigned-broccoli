import { useTheme } from "../../../ui/ThemeContext";

/** Animated SVG ECG pulse indicator component */
export default function EcgWaveform({ hr = 75, status = "normal", color, width = 120, height = 36, style = {} }) {
  const C = useTheme();
  
  const strokeColor = color || (
    status === "critical" || status === "dead" ? C.red :
    status === "warning" ? C.yellow : C.green
  );

  const duration = hr > 0 ? Math.max(0.4, Math.min(2.5, 60 / hr)) : 2.5;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", position: "relative", width, height, overflow: "hidden", ...style }}>
      <style>{`
        @keyframes ecgSweep {
          0% { stroke-dashoffset: 300; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes ecgGlow {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; filter: drop-shadow(0 0 3px ${strokeColor}); }
        }
      `}</style>
      <svg width={width} height={height} viewBox="0 0 200 60" style={{ overflow: "visible" }}>
        {/* Background Grid Lines */}
        <line x1="0" y1="30" x2="200" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="2,2" strokeWidth="1" />
        <line x1="0" y1="15" x2="200" y2="15" stroke="rgba(255,255,255,0.04)" strokeDasharray="1,3" strokeWidth="1" />
        <line x1="0" y1="45" x2="200" y2="45" stroke="rgba(255,255,255,0.04)" strokeDasharray="1,3" strokeWidth="1" />

        {/* ECG P-QRS-T Path */}
        <path
          d="M 0 30 L 20 30 Q 25 24 30 30 L 38 30 L 42 37 L 48 5 L 56 55 L 62 25 L 66 30 L 80 30 Q 90 18 100 30 L 120 30 Q 125 24 130 30 L 138 30 L 142 37 L 148 5 L 156 55 L 162 25 L 166 30 L 180 30 Q 190 18 200 30"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="300"
          style={{
            animation: `ecgSweep ${duration}s linear infinite, ecgGlow ${duration}s ease-in-out infinite`
          }}
        />
      </svg>
    </div>
  );
}
