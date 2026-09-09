import { FONT, SER } from "../../ui/theme";

/**
 * MenuHero component for desktop hero banner card.
 */
export default function MenuHero({ onHeroMove, onHeroLeave, heroMouse, startGame, setProgressionMode, setPhase, theme, t, C }) {
  return (
    <div
      onMouseMove={onHeroMove}
      onMouseLeave={onHeroLeave}
      style={{
        position: "relative",
        borderRadius: 23,
        padding: 1,
        marginBottom: 28,
        animation: "fadeUp 0.5s ease",
        background: "linear-gradient(135deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.09) 45%, rgba(255,255,255,0.20) 100%)",
        boxShadow: "0 0 16px rgba(0, 230, 200, 0.06)",
      }}
    >
      {/* Glowing border — illuminates frame and corners, follows cursor */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 23,
          pointerEvents: "none",
          background: `radial-gradient(360px circle at ${heroMouse.x * 100}% ${heroMouse.y * 100}%, rgba(255,255,255,0.45) 0%, ${C.accent}66 35%, transparent 70%)`,
          opacity: heroMouse.over ? 1 : 0.35,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Inner card — height 252px aligns exactly to 9 rows of 28px squares */}
      <div
        style={{
          position: "relative",
          height: 252,
          borderRadius: 22,
          overflow: "hidden",
          background: C.heroGrad,
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          boxShadow: theme === "dark"
            ? "0 8px 40px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.20)"
            : "0 8px 30px rgba(0,71,171,0.12), 0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Base grid pattern — silky smooth fade-out before the telemetry radar zone */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            backgroundPosition: "0 0",
            WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 76%)",
            maskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 76%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* Highlighted grid lines under cursor */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(rgba(255,255,255,0.20) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.20) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            backgroundPosition: "0 0",
            opacity: heroMouse.over ? 0.95 : 0,
            WebkitMaskImage: `radial-gradient(130px circle at ${heroMouse.x * 100}% ${heroMouse.y * 100}%, black 0%, transparent 100%), linear-gradient(to right, black 50%, transparent 76%)`,
            maskImage: `radial-gradient(130px circle at ${heroMouse.x * 100}% ${heroMouse.y * 100}%, black 0%, transparent 100%), linear-gradient(to right, black 50%, transparent 76%)`,
            WebkitMaskComposite: "source-in",
            maskComposite: "intersect",
            transition: "opacity 0.3s ease",
            zIndex: 0,
          }}
        />
        <div style={{ position: "absolute", left: "-5%", top: "50%", transform: "translateY(-50%)", width: 340, height: 340, background: `radial-gradient(circle, ${C.accent}14 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 280, height: 280, background: `radial-gradient(circle, ${C.accent}12 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />

        {/* Animated SVG medical radar graphic — matching the brand blue of "Новый пациент" button */}
        <div style={{ position: "absolute", right: 36, top: "50%", transform: "translateY(-50%)", zIndex: 2, pointerEvents: "none", filter: "drop-shadow(0 0 10px rgba(37, 99, 235, 0.45))" }}>
          <svg width="170" height="170" viewBox="0 0 170 170">
            <g>
              <circle cx="85" cy="85" r="75" fill="none" stroke="#3B82F6" strokeWidth="1.2" opacity="0.30" />
              <circle cx="85" cy="85" r="60" fill="none" stroke="#3B82F6" strokeWidth="1.2" opacity="0.42" />
              <circle cx="85" cy="85" r="45" fill="none" stroke="#3B82F6" strokeWidth="1.4" opacity="0.58" />
              <circle cx="85" cy="85" r="30" fill="none" stroke="#3B82F6" strokeWidth="1.4" opacity="0.75" />
              <line x1="85" y1="10" x2="85" y2="160" stroke="#3B82F6" strokeWidth="1" opacity="0.30" />
              <line x1="10" y1="85" x2="160" y2="85" stroke="#3B82F6" strokeWidth="1" opacity="0.30" />
              <animateTransform attributeName="transform" type="rotate" from="0 85 85" to="360 85 85" dur="30s" repeatCount="indefinite" />
            </g>
            <circle cx="85" cy="85" r="68" fill="none" stroke="#3B82F6" strokeWidth="1.3" strokeDasharray="6 12" opacity="0.65">
              <animateTransform attributeName="transform" type="rotate" from="0 85 85" to="-360 85 85" dur="20s" repeatCount="indefinite" />
            </circle>
            <g>
              <path d="M 85 10 A 75 75 0 0 1 152 52" stroke="#2563EB" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 85 160 A 75 75 0 0 1 18 118" stroke="#3B82F6" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
              <circle cx="85" cy="10" r="3" fill="#FFFFFF" />
              <circle cx="152" cy="52" r="3.5" fill="#3B82F6" />
              <circle cx="160" cy="85" r="3" fill="#60A5FA" opacity="0.9" />
              <animateTransform attributeName="transform" type="rotate" from="0 85 85" to="360 85 85" dur="10s" repeatCount="indefinite" />
            </g>
            <circle cx="85" cy="10" r="6" fill="#3B82F6" opacity="0.25">
              <animateTransform attributeName="transform" type="rotate" from="0 85 85" to="360 85 85" dur="6s" repeatCount="indefinite" />
            </circle>
            <circle cx="85" cy="10" r="3" fill="#3B82F6">
              <animateTransform attributeName="transform" type="rotate" from="0 85 85" to="360 85 85" dur="6s" repeatCount="indefinite" />
            </circle>
            <circle cx="85" cy="85" r="5" fill="#2563EB">
              <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "24px 38px", maxWidth: "62%", zIndex: 2 }}>
          <div style={{ fontSize: 10, color: C.heroLabel, letterSpacing: 5, textTransform: "uppercase", marginBottom: 10, fontFamily: FONT, fontWeight: 600 }}>{t("brand.tagline")}</div>
          <div key={theme} style={{ fontSize: 40, fontWeight: 700, fontFamily: SER, fontStyle: "italic", lineHeight: 1.15, background: C.heroTitleGrad, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent", marginBottom: 12 }}>{t("brand.name")}</div>
          <div style={{ fontSize: 13, color: C.heroText, fontFamily: FONT, marginBottom: 20, lineHeight: 1.6 }}>{t("hero.desc1")} {t("hero.desc2")}</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button className="start-btn" onClick={startGame} style={{ background: "#FFFFFF", border: "none", borderRadius: 10, padding: "11px 26px", fontSize: 14, fontWeight: 800, color: "#002B66", cursor: "pointer", fontFamily: FONT, letterSpacing: 0.3, boxShadow: "0 6px 20px rgba(0,0,0,0.28)" }}>
              {t("hero.start")}
            </button>
            <button
              title={t("hero.tooltipCourse") || "Интерактивный учебный курс: отработка кейсов от простых к сложным"}
              className="med-btn"
              onClick={() => { setProgressionMode("strict"); setPhase("theory"); }}
              style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 10, padding: "9px 24px", fontSize: 14, fontWeight: 700, color: "#FFFFFF", cursor: "pointer", fontFamily: FONT, letterSpacing: 0.3, backdropFilter: "blur(8px)" }}
            >
              {t("nav.course")}
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { tag: t("hero.tags")[0] || "Анализы", tip: "Лабораторная (ОАК, биохимия) и инструментальная (ЭКГ, КТ, УЗИ) диагностика" },
                { tag: t("hero.tags")[1] || "Диагноз", tip: "Постановка точного клинического диагноза по МКБ-10 и дифференциальный диагноз" },
                { tag: t("hero.tags")[2] || "Лечение", tip: "Экстренная фармакотерапия, капельницы, ИВЛ и реанимационные мероприятия" },
              ].map(({ tag, tip }) => (
                <span
                  key={tag}
                  title={tip}
                  className="filter-pill"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.28)",
                    borderRadius: 20,
                    padding: "6px 14px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#FFFFFF",
                    fontFamily: FONT,
                    cursor: "help",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
