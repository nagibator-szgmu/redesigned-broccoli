import { FONT } from "../../ui/theme";

/**
 * MenuHero component for desktop hero banner card.
 */
export default function MenuHero({ onHeroMove, onHeroLeave, heroMouse, startGame, setProgressionMode, setPhase, theme, t, C }) {
  return (
    <div onMouseMove={onHeroMove} onMouseLeave={onHeroLeave} style={{ position: "relative", borderRadius: 23, padding: 1, marginBottom: 28, animation: "fadeUp 0.5s ease", background: "rgba(0,230,200,0.11)" }}>
      {/* Glowing border — follows cursor */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 23, pointerEvents: "none", background: `radial-gradient(350px circle at ${heroMouse.x * 100}% ${heroMouse.y * 100}%, rgba(0,230,200,0.55), transparent 65%)`, opacity: heroMouse.over ? 1 : 0, transition: "opacity 0.5s ease" }} />

      {/* Inner card */}
      <div style={{ position: "relative", minHeight: 220, borderRadius: 22, overflow: "hidden", background: C.heroGrad, display: "flex", alignItems: "center", boxShadow: "0 8px 48px rgba(0,0,0,0.6),inset 0 1px 0 rgba(0,230,200,0.06)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,230,200,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,230,200,0.04) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: heroMouse.over ? 1 : 0, transition: "opacity 0.4s ease", background: `radial-gradient(78px circle at ${heroMouse.x * 100}% ${heroMouse.y * 100}%, rgba(0,230,200,0.1) 0%, transparent 100%)` }} />
        <div style={{ position: "absolute", left: "-5%", top: "-20%", width: 320, height: 320, background: `radial-gradient(circle,${C.accent}12 0%,transparent 65%)`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", right: "-5%", top: "-10%", width: 400, height: 400, background: "radial-gradient(circle,rgba(0,100,200,0.1) 0%,transparent 65%)", borderRadius: "50%" }} />

        {/* Animated SVG medical radar graphic */}
        <div style={{ position: "absolute", right: 36, top: "50%", transform: "translateY(-50%)", opacity: 0.8 }}>
          <svg width="170" height="170" viewBox="0 0 170 170">
            <g>
              <circle cx="85" cy="85" r="75" fill="none" stroke="rgba(0,230,200,0.07)" strokeWidth="1" />
              <circle cx="85" cy="85" r="60" fill="none" stroke="rgba(0,230,200,0.1)" strokeWidth="1" />
              <circle cx="85" cy="85" r="45" fill="none" stroke="rgba(0,230,200,0.14)" strokeWidth="1" />
              <circle cx="85" cy="85" r="30" fill="none" stroke="rgba(0,230,200,0.18)" strokeWidth="1" />
              <line x1="85" y1="10" x2="85" y2="160" stroke="rgba(0,230,200,0.05)" strokeWidth="1" />
              <line x1="10" y1="85" x2="160" y2="85" stroke="rgba(0,230,200,0.05)" strokeWidth="1" />
              <animateTransform attributeName="transform" type="rotate" from="0 85 85" to="360 85 85" dur="30s" repeatCount="indefinite" />
            </g>
            <circle cx="85" cy="85" r="68" fill="none" stroke={C.accent} strokeWidth="1" strokeDasharray="6 14" opacity="0.2">
              <animateTransform attributeName="transform" type="rotate" from="0 85 85" to="-360 85 85" dur="20s" repeatCount="indefinite" />
            </circle>
            <g>
              <path d="M 85 10 A 75 75 0 0 1 152 52" stroke={C.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 85 160 A 75 75 0 0 1 18 118" stroke={C.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />
              <circle cx="85" cy="10" r="2.5" fill={C.accent} />
              <circle cx="152" cy="52" r="3" fill={C.green} />
              <circle cx="160" cy="85" r="2.5" fill={C.accent} opacity="0.6" />
              <animateTransform attributeName="transform" type="rotate" from="0 85 85" to="360 85 85" dur="10s" repeatCount="indefinite" />
            </g>
            <circle cx="85" cy="10" r="6" fill={C.accent} opacity="0.15">
              <animateTransform attributeName="transform" type="rotate" from="0 85 85" to="360 85 85" dur="6s" repeatCount="indefinite" />
            </circle>
            <circle cx="85" cy="10" r="3" fill={C.accent}>
              <animateTransform attributeName="transform" type="rotate" from="0 85 85" to="360 85 85" dur="6s" repeatCount="indefinite" />
            </circle>
            <circle cx="85" cy="85" r="5" fill={C.accent} opacity="0.9">
              <animate attributeName="r" values="4;6.5;4" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "24px 38px", maxWidth: "62%", zIndex: 1 }}>
          <div style={{ fontSize: 10, color: C.heroLabel, letterSpacing: 5, textTransform: "uppercase", marginBottom: 10, fontFamily: FONT, fontWeight: 600 }}>{t("brand.tagline")}</div>
          <div key={theme} style={{ fontSize: 42, fontWeight: 700, fontFamily: "Georgia,serif", fontStyle: "italic", lineHeight: 1.1, background: C.heroTitleGrad, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent", marginBottom: 12 }}>{t("brand.name")}</div>
          <div style={{ fontSize: 13, color: C.heroText, fontFamily: FONT, marginBottom: 20, lineHeight: 1.6 }}>{t("hero.desc1")}<br />{t("hero.desc2")}</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button className="start-btn" onClick={startGame} style={{ background: C.accent, border: "none", borderRadius: 10, padding: "11px 26px", fontSize: 14, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT, letterSpacing: 0.3, boxShadow: `0 4px 16px rgba(0,230,200,0.3)` }}>{t("hero.start")}</button>
            <button
              title={t("hero.tooltipCourse") || "Интерактивный учебный курс: отработка кейсов от простых к сложным"}
              className="med-btn"
              onClick={() => { setProgressionMode("strict"); setPhase("theory"); }}
              style={{ background: "transparent", border: `1.5px solid ${C.accent}`, borderRadius: 10, padding: "9px 24px", fontSize: 14, fontWeight: 700, color: C.accent, cursor: "pointer", fontFamily: FONT, letterSpacing: 0.3 }}
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
                    background: C.heroTagBg,
                    border: `1px solid ${C.heroTagBorder}`,
                    borderRadius: 20,
                    padding: "6px 14px",
                    fontSize: 11,
                    fontWeight: 500,
                    color: C.heroTagText,
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
