import { Link } from "react-router-dom";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";

export function AuthField({ label, type = "text", value, onChange, placeholder }) {
  const C = useTheme();

  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span
        style={{
          fontFamily: FONT,
          fontSize: 12,
          color: C.textDim,
          fontWeight: 500,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={(e) => {
          e.target.style.borderColor = `${C.accent}88`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = C.border;
        }}
        style={{
          background: C.inputBg,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "12px 14px",
          fontFamily: FONT,
          fontSize: 14,
          color: C.white,
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          caretColor: C.accent,
          transition: "border-color 0.15s",
        }}
      />
    </label>
  );
}

export function AuthTitle({ subtitle }) {
  const C = useTheme();

  return (
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          background: C.heroTitleGrad,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: -0.5,
          marginBottom: 8,
        }}
      >
        MedSim
      </div>
      <div style={{ fontSize: 14, color: C.textDim, fontWeight: 500 }}>{subtitle}</div>
    </div>
  );
}

export function AuthLink({ children, to }) {
  const C = useTheme();

  return (
    <Link
      to={to}
      style={{
        color: C.accent,
        fontSize: 13,
        fontFamily: FONT,
        fontWeight: 500,
        textDecoration: "none",
      }}
    >
      {children}
    </Link>
  );
}

export default function AuthLayout({ children }) {
  const C = useTheme();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: C.bgGrad,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
        fontFamily: FONT,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-12%",
          left: "-8%",
          width: "55%",
          height: "55%",
          background: C.glowBg1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-12%",
          right: "-8%",
          width: "55%",
          height: "55%",
          background: C.glowBg2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: C.panelBg2,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${C.accent}22`,
          borderRadius: 20,
          padding: "clamp(28px, 6vw, 40px) clamp(20px, 5vw, 36px)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
          position: "relative",
          zIndex: 1,
          animation: "fadeUp 0.5s ease",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
}
