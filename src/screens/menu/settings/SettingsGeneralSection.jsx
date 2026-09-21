import { FONT } from "../../../ui/theme";
import { Tooltip } from "../../../ui/components";

export function SettingsGeneralSection({
  audioEnabled,
  setAudioEnabled,
  hideWarnings,
  setHideWarnings,
  theme,
  setTheme,
  locale,
  setLocaleGlobal,
  LOCALES,
  C,
  t,
}) {
  const audioOptions = [
    {
      l: t("settings.learningOn"),
      v: true,
      title: "ЗВУКОВЫЕ ЭФФЕКТЫ И ЗВУКИ МОНИТОРА",
      text: "Включает реальные звуки пульсоксиметра, тревог кардиомонитора и аускультации.",
    },
    {
      l: t("settings.learningOff"),
      v: false,
      title: "БЕЗЗВУЧНЫЙ РЕЖИМ",
      text: "Отключает фоновые звуковые эффекты реанимационной.",
    },
  ];

  const warningOptions = [
    {
      l: t("settings.warningsShow") || "Показывать",
      v: false,
      title: "ПОДСКАЗКИ О ПРОТИВОПОКАЗАНИЯХ",
      text: "Отображает предупреждающие значки ⚠ возле потенциально опасных препаратов.",
    },
    {
      l: t("settings.warningsHide") || "Скрывать",
      v: true,
      title: "ЭКЗАМЕНАЦИОННЫЙ РЕЖИМ",
      text: "Скрывает значки предупреждений, требуя от врача самостоятельного контроля противопоказаний.",
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
          {t("settings.audio")}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {audioOptions.map(({ l, v, title, text }) => (
            <Tooltip key={String(v)} title={title} text={text} style={{ flex: 1 }}>
              <button
                onClick={() => setAudioEnabled(v)}
                style={{
                  width: "100%",
                  background: audioEnabled === v ? `${C.accent}18` : "transparent",
                  border: `1px solid ${audioEnabled === v ? C.accent : "rgba(0,230,200,0.1)"}`,
                  borderRadius: 8,
                  padding: "7px 4px",
                  fontSize: 11,
                  color: audioEnabled === v ? C.accent : C.textDim,
                  cursor: "pointer",
                  fontFamily: FONT,
                }}
              >
                {l}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
          {t("settings.hideWarnings") || "Подсказки по ЛС"}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {warningOptions.map(({ l, v, title, text }) => (
            <Tooltip key={String(v)} title={title} text={text} style={{ flex: 1 }}>
              <button
                onClick={() => setHideWarnings(v)}
                style={{
                  width: "100%",
                  background: hideWarnings === v ? `${C.accent}18` : "transparent",
                  border: `1px solid ${hideWarnings === v ? C.accent : "rgba(0,230,200,0.1)"}`,
                  borderRadius: 8,
                  padding: "7px 4px",
                  fontSize: 11,
                  color: hideWarnings === v ? C.accent : C.textDim,
                  cursor: "pointer",
                  fontFamily: FONT,
                }}
              >
                {l}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
          {t("settings.theme")}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { l: t("settings.dark"), v: "dark" },
            { l: t("settings.light"), v: "light" },
          ].map(({ l, v }) => (
            <button
              key={v}
              onClick={() => setTheme(v)}
              style={{
                flex: 1,
                background: theme === v ? `${C.accent}18` : "transparent",
                border: `1px solid ${theme === v ? C.accent : "rgba(0,230,200,0.1)"}`,
                borderRadius: 8,
                padding: "7px 4px",
                fontSize: 11,
                color: theme === v ? C.accent : C.textDim,
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
          {t("settings.langLabel")}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {Object.entries(LOCALES).map(([v, l]) => (
            <button
              key={v}
              onClick={() => setLocaleGlobal(v)}
              style={{
                flex: 1,
                background: locale === v ? `${C.accent}18` : "transparent",
                border: `1px solid ${locale === v ? C.accent : "rgba(0,230,200,0.1)"}`,
                borderRadius: 8,
                padding: "7px 4px",
                fontSize: 11,
                color: locale === v ? C.accent : C.textDim,
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
