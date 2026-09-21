import { FONT } from "../../../ui/theme";
import { Tooltip } from "../../../ui/components";

export function SettingsSimulationSection({
  difficulty,
  setDifficulty,
  gameMode,
  setGameMode,
  C,
  t,
}) {
  const difficultyOptions = [
    {
      l: t("settings.easy"),
      v: "easy",
      title: "ЛЕГКИЙ РЕЖИМ",
      refRange: "Таймер × 1.5",
      text: "Увеличенный лимит времени, автоматические подсказки по дозировкам и подсветка критических состояний.",
      details: {
        category: "Уровень сложности",
        mechanism: "Замедление декомпенсации показания пациентов",
        indications: "Для начинающих студентов и ознакомления с кейсами",
        contraindications: "Официальные аттестационные экзамены",
      },
    },
    {
      l: t("settings.normal"),
      v: "normal",
      title: "СТАНДАРТНЫЙ РЕЖИМ",
      refRange: "Реалистичный таймер 1:1",
      text: "Стандартная скорость изменения физиологии пациента. Базовые подсказки по протоколам.",
      details: {
        category: "Уровень сложности",
        mechanism: "Реалистичная физиология и обычное время реакций",
        indications: "Основное обучение и регулярная практика",
        contraindications: "Нет",
      },
    },
    {
      l: t("settings.hard"),
      v: "hard",
      title: "ХАРДКОР / СТРЕСС",
      refRange: "Таймер × 0.7 | Стресс 100%",
      text: "Ускоренная декомпенсация, внезапные аритмии, скрытые осложнения и жесткий контроль времени.",
      details: {
        category: "Уровень сложности",
        mechanism: "Высокая динамика гемодинамического коллапса",
        indications: "Тренировка стрессоустойчивости врачей скорой помощи",
        contraindications: "Первичный просмотр незнакомого сценария",
      },
    },
  ];

  const gameModeOptions = [
    {
      l: t("settings.modeNormal"),
      v: "normal",
      d: t("settings.modeNormalDesc"),
      title: "СЦЕНАРНЫЙ РЕЖИМ",
      text: "Последовательное прохождение клинического случая от поступления до стабилизации.",
    },
    {
      l: t("settings.modeRandom"),
      v: "random",
      d: t("settings.modeRandomDesc"),
      title: "СЛУЧАЙНЫЙ БОЛЬНОЙ",
      text: "Генерация случайного клинического случая с непредсказуемой патологией.",
    },
    {
      l: t("settings.modeStress"),
      v: "stress",
      d: t("settings.modeStressDesc"),
      title: "РЕЖИМ КАТАСТРОФЫ",
      text: "Симуляция масс-поступления или тяжелого шокового состояния с помехами и шумом.",
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
          {t("settings.difficulty")}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {difficultyOptions.map(({ l, v, title, refRange, text, details }) => (
            <Tooltip key={v} title={title} refRange={refRange} text={text} details={details} style={{ flex: 1 }}>
              <button
                onClick={() => setDifficulty(v)}
                style={{
                  width: "100%",
                  background: difficulty === v ? `${C.accent}18` : "transparent",
                  border: `1px solid ${difficulty === v ? C.accent : "rgba(0,230,200,0.1)"}`,
                  borderRadius: 8,
                  padding: "7px 4px",
                  fontSize: 11,
                  color: difficulty === v ? C.accent : C.textDim,
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
          {t("settings.gameMode")}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {gameModeOptions.map(({ l, v, d, title, text }) => (
            <Tooltip key={v} title={title} text={text} style={{ flex: 1 }}>
              <button
                onClick={() => setGameMode(v)}
                style={{
                  width: "100%",
                  background: gameMode === v ? `${C.accent}18` : "transparent",
                  border: `1px solid ${gameMode === v ? C.accent : "rgba(0,230,200,0.1)"}`,
                  borderRadius: 8,
                  padding: "7px 4px",
                  textAlign: "center",
                  cursor: "pointer",
                  fontFamily: FONT,
                }}
              >
                <div style={{ fontSize: 11, color: gameMode === v ? C.accent : C.textDim, marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 9, color: C.textDim, opacity: 0.7 }}>{d}</div>
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
    </>
  );
}
