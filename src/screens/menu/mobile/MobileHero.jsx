import { RADIUS, FONT, SER } from "../../../ui/theme";

export default function MobileHero({ startGame, t, C }) {
  return (
    <div
      style={{
        margin: "0 16px 20px",
        borderRadius: RADIUS.lg,
        overflow: "hidden",
        background: C.heroGrad,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        position: "relative",
        padding: "20px 18px",
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            fontSize: 10,
            color: C.heroLabel,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 6,
            fontFamily: FONT,
            fontWeight: 600,
          }}
        >
          {t("brand.tagline")}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            fontFamily: SER,
            fontStyle: "italic",
            lineHeight: 1.15,
            background: C.heroTitleGrad,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            marginBottom: 8,
          }}
        >
          {t("brand.name")}
        </div>
        <div
          style={{
            fontSize: 13,
            color: C.heroText,
            fontFamily: FONT,
            marginBottom: 14,
            lineHeight: 1.5,
          }}
        >
          {t("hero.desc1")}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button
            className="start-btn"
            onClick={startGame}
            style={{
              background: C.accent,
              border: "none",
              borderRadius: RADIUS.sm,
              minHeight: 44,
              padding: "0 22px",
              fontSize: 14,
              fontWeight: 700,
              color: C.bg,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            {t("hero.start")}
          </button>
          {t("hero.tags").map((tag) => (
            <span
              key={tag}
              style={{
                background: C.heroTagBg,
                border: `1px solid ${C.heroTagBorder}`,
                borderRadius: RADIUS.full,
                padding: "5px 11px",
                fontSize: 11,
                color: C.heroTagText,
                fontFamily: FONT,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
