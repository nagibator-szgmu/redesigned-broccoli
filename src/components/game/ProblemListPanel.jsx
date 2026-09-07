import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT, CODE } from "../../ui/theme";
import { STitle, Tooltip } from "../../ui/components";
import { deriveProblemList } from "../../engine/problemListEngine";

/**
 * Панель «Помощь наставника»: по умолчанию отображает кнопку вызова наставника.
 * При клике запускается 15-секундный таймер анализа клинической картины,
 * после чего открывается структурированный список клинических синдромов и проблем.
 */
export default function ProblemListPanel({ cd, ps, revealedResults = {} }) {
  const C = useTheme();
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "unlocked"
  const [timeLeft, setTimeLeft] = useState(15);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const problems = deriveProblemList(ps, revealedResults);

  // Сброс состояния при смене пациента
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus("idle");
    setTimeLeft(15);
    setProgress(0);
  }, [cd?.id]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStartLoading = () => {
    if (status !== "idle") return;
    setStatus("loading");
    setTimeLeft(15);
    setProgress(0);

    const totalDurationMs = 15000;
    const intervalMs = 100;
    let elapsedMs = 0;

    timerRef.current = setInterval(() => {
      elapsedMs += intervalMs;
      const pct = Math.min(100, (elapsedMs / totalDurationMs) * 100);
      const remainingSec = Math.max(0, Math.ceil((totalDurationMs - elapsedMs) / 1000));

      setProgress(pct);
      setTimeLeft(remainingSec);

      if (elapsedMs >= totalDurationMs) {
        clearInterval(timerRef.current);
        setStatus("unlocked");
      }
    }, intervalMs);
  };

  const getEvidenceTooltip = (evText = "") => {
    if (evText.includes("Глазго") || evText.includes("GCS")) {
      return "Шкала ком Глазго: 15 (ясное), 13-14 (оглушение), 9-12 (сопор), <=8 (кома)";
    }
    if (evText.includes("MAP") || evText.includes("АД")) {
      return "Среднее артериальное давление (норма: 70–105 мм рт. ст.)";
    }
    if (evText.includes("SpO₂")) {
      return "Сатурация кислорода крови (норма: 95–100%)";
    }
    return `Критерий подтверждения синдрома: ${evText}`;
  };

  // 1. Исходное состояние: Кнопка «Помощь наставника»
  if (status === "idle") {
    return (
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={handleStartLoading}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: `linear-gradient(135deg, ${C.panelBg} 0%, rgba(0, 230, 200, 0.08) 100%)`,
            border: `1px solid ${C.accent}44`,
            borderRadius: 12,
            color: C.white,
            fontFamily: FONT,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = C.accent;
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 6px 18px rgba(0,230,200,0.2)`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = `${C.accent}44`;
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.25)";
          }}
        >
          <span style={{ fontSize: 18 }}>👨‍⚕️</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: C.accent, letterSpacing: 0.2 }}>
              Помощь наставника
            </div>
            <div style={{ fontSize: 10, color: C.textDim, marginTop: 1 }}>
              Анализ ведущих клинических синдромов (15 сек)
            </div>
          </div>
        </button>
      </div>
    );
  }

  // 2. Состояние загрузки (15 секунд с индикатором прогресса)
  if (status === "loading") {
    return (
      <div
        style={{
          marginBottom: 12,
          padding: "12px 14px",
          borderRadius: 12,
          background: C.panelBg,
          border: `1px solid ${C.accent}60`,
          boxShadow: `0 4px 18px rgba(0,0,0,0.35), 0 0 12px ${C.accent}15`,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: `2px solid ${C.accent}40`,
                borderTopColor: C.accent,
                animation: "spinGear 0.8s linear infinite",
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, fontFamily: FONT }}>
              Запрос к наставнику...
            </span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, fontFamily: CODE }}>
            {timeLeft} сек
          </span>
        </div>

        {/* Полоса прогресса */}
        <div
          style={{
            width: "100%",
            height: 6,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${C.accent} 0%, ${C.purple} 100%)`,
              borderRadius: 4,
              transition: "width 0.1s linear",
            }}
          />
        </div>

        <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, lineHeight: 1.3 }}>
          Сопоставление витальных функций, гемодинамики и данных осмотра...
        </div>
      </div>
    );
  }

  // 3. Состояние разблокировано: Отображение клинических синдромов и проблем
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Tooltip text="Клинические синдромы пациента, выделенные наставником" position="top">
          <STitle icon="👨‍⚕️" label="Помощь наставника: Синдромы" color={C.accent} />
        </Tooltip>
        <span style={{ fontSize: 10, color: C.textDim, fontFamily: FONT }}>
          Активно: <strong>{problems.length}</strong>
        </span>
      </div>

      {problems.length === 0 ? (
        <div style={{ padding: "8px 12px", borderRadius: 8, background: C.btnBg, border: `1px solid ${C.btnBorder}`, fontSize: 11, color: C.green, fontFamily: FONT }}>
          ✓ Острых синдромных нарушений не выявлено
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {problems.map(prob => {
            const isCrit = prob.severity === "critical";
            const borderCol = isCrit ? `${C.red}60` : `${C.yellow}50`;
            const bgCol = isCrit ? `${C.red}12` : `${C.yellow}10`;
            const tagCol = isCrit ? C.red : C.yellow;

            return (
              <div
                key={prob.id}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: bgCol,
                  border: `1px solid ${borderCol}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Tooltip text={`Клинический синдром: ${prob.label}`} position="top">
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.white, fontFamily: FONT }}>
                      {prob.label}
                    </span>
                  </Tooltip>
                  <Tooltip text={isCrit ? "Жизнеугрожающее нарушение, требующее немедленной помощи" : "Умеренное отклонение витальных или лабораторных функций"} position="top">
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: `${tagCol}25`,
                      color: tagCol,
                      fontFamily: FONT,
                      textTransform: "uppercase",
                      cursor: "help"
                    }}>
                      {isCrit ? "Критично" : "Умеренно"}
                    </span>
                  </Tooltip>
                </div>

                {prob.evidence && prob.evidence.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 2 }}>
                    {prob.evidence.map((ev, i) => (
                      <Tooltip key={i} text={getEvidenceTooltip(ev)} position="bottom">
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: C.btnBg,
                            border: `1px solid ${C.btnBorder}`,
                            color: C.textDim,
                            fontFamily: CODE,
                            cursor: "help"
                          }}
                        >
                          {ev}
                        </span>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
