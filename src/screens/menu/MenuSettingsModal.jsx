import { createPortal } from "react-dom";
import { FONT } from "../../ui/theme";
import { Tooltip } from "../../ui/components";

/**
 * MenuSettingsModal component for app settings and developer LLM configuration.
 */
export default function MenuSettingsModal({
  showSettings, setShowSettings, difficulty, setDifficulty,
  assessmentMode, setAssessmentMode, audioEnabled, setAudioEnabled,
  hideWarnings, setHideWarnings, theme, setTheme, locale, setLocaleGlobal, LOCALES,
  resetProgress, isMobile, t, C,
}) {
  if (!showSettings) return null;

  const positionStyle = isMobile
    ? { top: 60, right: 12, left: 12, maxHeight: "82vh", overflowY: "auto" }
    : { top: 72, right: 16, width: 300, maxHeight: "82vh", overflowY: "auto" };

  return createPortal(
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 99998 }} onClick={() => setShowSettings(false)} />
      <div style={{ position: "fixed", ...positionStyle, zIndex: 99999, background: C.overlayBg, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(0,230,200,0.2)", borderRadius: 16, padding: "16px", boxShadow: "0 16px 48px rgba(0,0,0,0.8),0 0 0 1px rgba(0,230,200,0.05)", fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{t("settings.title")}</span>
          <span onClick={() => setShowSettings(false)} style={{ fontSize: 12, color: C.textDim, cursor: "pointer", padding: "2px 8px", borderRadius: 6, background: C.dimBg }}>✕</span>
        </div>

        {/* Difficulty */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{t("settings.difficulty")}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { l: t("settings.easy"), v: "easy", title: "ЛЕГКИЙ РЕЖИМ", refRange: "Таймер × 1.5", text: "Увеличенный лимит времени, базовые ориентиры по дозировкам и подсветка критических состояний.", details: { category: "Уровень сложности", mechanism: "Замедление декомпенсации показания пациентов", indications: "Для начинающих студентов и ознакомления с кейсами", contraindications: "Официальные аттестационные экзамены" } },
              { l: t("settings.normal"), v: "normal", title: "СТАНДАРТНЫЙ РЕЖИМ", refRange: "Реалистичный таймер 1:1", text: "Стандартная скорость изменения физиологии пациента. Базовые алгоритмы по клиническим протоколам.", details: { category: "Уровень сложности", mechanism: "Реалистичная физиология и обычное время реакций", indications: "Основное обучение и регулярная практика", contraindications: "Нет" } },
              { l: t("settings.hard"), v: "hard", title: "СЛОЖНЫЙ РЕЖИМ", refRange: "Таймер × 0.7", text: "Ускоренная декомпенсация, внезапные аритмии, скрытые осложнения и жесткий контроль времени.", details: { category: "Уровень сложности", mechanism: "Высокая динамика гемодинамического коллапса", indications: "Тренировка быстрой реакции врачей скорой помощи", contraindications: "Первичный просмотр незнакомого сценария" } }
            ].map(({ l, v, title, refRange, text, details }) => (
              <Tooltip key={v} title={title} refRange={refRange} text={text} details={details} style={{ flex: 1 }}>
                <button onClick={() => setDifficulty(v)} style={{ width: "100%", background: difficulty === v ? `${C.accent}18` : "transparent", border: `1px solid ${difficulty === v ? C.accent : "rgba(0,230,200,0.1)"}`, borderRadius: 8, padding: "7px 4px", fontSize: 11, color: difficulty === v ? C.accent : C.textDim, cursor: "pointer", fontFamily: FONT }}>{l}</button>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Audio Toggle */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{t("settings.audio")}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { l: t("settings.learningOn"), v: true, title: "ЗВУКОВЫЕ ЭФФЕКТЫ И ЗВУКИ МОНИТОРА", text: "Включает реальные звуки пульсоксиметра, тревог кардиомонитора и аускультации." },
              { l: t("settings.learningOff"), v: false, title: "БЕЗЗВУЧНЫЙ РЕЖИМ", text: "Отключает фоновые звуковые эффекты реанимационной." }
            ].map(({ l, v, title, text }) => (
              <Tooltip key={String(v)} title={title} text={text} style={{ flex: 1 }}>
                <button onClick={() => setAudioEnabled(v)} style={{ width: "100%", background: audioEnabled === v ? `${C.accent}18` : "transparent", border: `1px solid ${audioEnabled === v ? C.accent : "rgba(0,230,200,0.1)"}`, borderRadius: 8, padding: "7px 4px", fontSize: 11, color: audioEnabled === v ? C.accent : C.textDim, cursor: "pointer", fontFamily: FONT }}>{l}</button>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Hide Warnings Toggle */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{t("settings.hideWarnings") || "Предупреждения по ЛС"}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { l: t("settings.warningsShow") || "Показывать", v: false, title: "ПРЕДУПРЕЖДЕНИЯ О ПРОТИВОПОКАЗАНИЯХ", text: "Отображает предупреждающие значки ⚠ возле потенциально опасных препаратов." },
              { l: t("settings.warningsHide") || "Скрывать", v: true, title: "ЭКЗАМЕНАЦИОННЫЙ РЕЖИМ", text: "Скрывает значки предупреждений, требуя от врача самостоятельного контроля противопоказаний." }
            ].map(({ l, v, title, text }) => (
              <Tooltip key={String(v)} title={title} text={text} style={{ flex: 1 }}>
                <button onClick={() => setHideWarnings(v)} style={{ width: "100%", background: hideWarnings === v ? `${C.accent}18` : "transparent", border: `1px solid ${hideWarnings === v ? C.accent : "rgba(0,230,200,0.1)"}`, borderRadius: 8, padding: "7px 4px", fontSize: 11, color: hideWarnings === v ? C.accent : C.textDim, cursor: "pointer", fontFamily: FONT }}>{l}</button>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{t("settings.theme")}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ l: t("settings.dark"), v: "dark" }, { l: t("settings.light"), v: "light" }].map(({ l, v }) => (
              <button key={v} onClick={() => setTheme(v)} style={{ flex: 1, background: theme === v ? `${C.accent}18` : "transparent", border: `1px solid ${theme === v ? C.accent : "rgba(0,230,200,0.1)"}`, borderRadius: 8, padding: "7px 4px", fontSize: 11, color: theme === v ? C.accent : C.textDim, cursor: "pointer", fontFamily: FONT }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{t("settings.langLabel")}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.entries(LOCALES).map(([v, l]) => (
              <button key={v} onClick={() => setLocaleGlobal(v)} style={{ flex: 1, background: locale === v ? `${C.accent}18` : "transparent", border: `1px solid ${locale === v ? C.accent : "rgba(0,230,200,0.1)"}`, borderRadius: 8, padding: "7px 4px", fontSize: 11, color: locale === v ? C.accent : C.textDim, cursor: "pointer", fontFamily: FONT }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Assessment Mode Toggle */}
        <div style={{ marginBottom: 14 }}>
          <div onClick={() => setAssessmentMode((v) => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: assessmentMode ? `${C.green}12` : "transparent", border: `1px solid ${assessmentMode ? `${C.green}44` : "rgba(0,230,200,0.1)"}`, borderRadius: 8, cursor: "pointer" }}>
            <div>
              <div style={{ fontSize: 12, color: assessmentMode ? C.green : C.text, fontWeight: 600, fontFamily: FONT }}>✅ {t("settings.assessmentMode")}</div>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>{t("settings.assessmentModeDesc")}</div>
            </div>
            <div style={{ width: 36, height: 20, borderRadius: 10, background: assessmentMode ? C.green : `${C.textDim}30`, position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: assessmentMode ? 18 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
            </div>
          </div>
        </div>

        {/* Reset Progress */}
        {resetProgress && (
          <div style={{ marginBottom: 14 }}>
            <button
              onClick={() => {
                resetProgress();
                setShowSettings(false);
              }}
              style={{
                width: "100%",
                background: "rgba(255, 61, 90, 0.08)",
                border: "1px solid rgba(255, 61, 90, 0.25)",
                borderRadius: 8,
                padding: "8px 10px",
                fontSize: 11,
                color: C.red,
                cursor: "pointer",
                fontFamily: FONT,
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              🗑️ {t("progress.reset")} прогресс и статистику
            </button>
          </div>
        )}

        <div style={{ paddingTop: 12, borderTop: "1px solid rgba(0,230,200,0.06)", fontSize: 11, color: C.textDim, textAlign: "center", opacity: 0.7 }}>
          {t("settings.moreComing")}
        </div>
      </div>
    </>,
    document.body
  );
}
