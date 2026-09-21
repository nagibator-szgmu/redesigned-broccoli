import { CODE } from "../../ui/theme";
import { HeaderBackBtn } from "../../ui/components";

export default function TeacherHeader({ onBack, isMobile, C }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "12px 16px" : "16px 28px",
        background: C.headerBg,
        borderBottom: `1px solid ${C.border}`,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <HeaderBackBtn onClick={onBack} />
        <div>
          <div
            style={{
              fontSize: isMobile ? 15 : 17,
              fontWeight: 800,
              color: C.white,
              letterSpacing: -0.2,
            }}
          >
            Кабинет преподавателя
          </div>
          <div style={{ fontSize: 11, color: C.textDim, fontFamily: CODE }}>
            Аналитика групп и когнитивный аудит ОСКЭ
          </div>
        </div>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: `${C.yellow}15`,
          border: `1px solid ${C.yellow}44`,
          borderRadius: 9999,
          padding: "4px 12px",
          fontSize: 11,
          fontWeight: 700,
          color: C.yellow,
        }}
      >
        <span style={{ fontSize: 12 }}>🚧</span>
        <span>В разработке</span>
      </div>
    </header>
  );
}
