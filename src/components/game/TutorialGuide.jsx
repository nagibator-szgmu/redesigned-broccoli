import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";

const VITAL_TIPS = [
  { key: "vitals_color", label: "Цветовая кодировка", default: "Зелёный — показатель в норме. Жёлтый — есть отклонение, стоит обратить внимание. Красный — критическое отклонение, требует немедленной реакции." },
  { key: "vitals_spo2", label: "SpO₂ (сатурация)", default: "Показывает, насколько кровь насыщена кислородом. Норма — 95–100%. 90–94% — жёлтая зона (дыхательная недостаточность лёгкой степени). Ниже 90% — красная зона, гипоксия, нужны немедленные меры (кислород, при тяжёлой степени — интубация)." },
  { key: "vitals_bp", label: "АД (артериальное давление)", default: "Систолическое/диастолическое давление в сосудах. Норма — примерно 90–139 / 60–89 мм рт. ст. Ниже 90 систолического — угроза шока, органы недополучают кровоснабжение. Выше 180/120 — гипертонический криз, риск повреждения сосудов и органов." },
  { key: "vitals_hr", label: "ЧСС (частота сердечных сокращений)", default: "Норма — 60–100 уд/мин. Выше 100 (тахикардия) — часто компенсаторная реакция на боль, кровопотерю, лихорадку, но может быть и первичной проблемой сердца. Ниже 60 (брадикардия) — может быть нормой у тренированных людей, а может быть признаком блокады проводимости или тяжёлого состояния." },
  { key: "vitals_rr", label: "ЧДД (частота дыхательных движений)", default: "Норма — 12–20 в минуту. Учащённое дыхание (тахипноэ) — признак дыхательной недостаточности или метаболической компенсации (например, при кетоацидозе). Редкое дыхание (брадипноэ) — угнетение дыхательного центра, часто при передозировке или тяжёлом поражении мозга." },
  { key: "vitals_temp", label: "Температура тела", default: "Норма — 36.0–37.2°C. Выше 38°C — лихорадка, обычно указывает на инфекцию или воспаление. Ниже 35°C — гипотермия, само по себе опасное состояние, нарушающее свёртываемость крови и работу сердца." },
  { key: "vitals_gcs", label: "ШКГ (шкала комы Глазго)", default: "Оценка уровня сознания от 3 (полное отсутствие реакций) до 15 (ясное сознание). Суммируются баллы за открывание глаз (1–4), речевую реакцию (1–5) и двигательную реакцию (1–6). 13–15 — лёгкое угнетение, 9–12 — среднее, 3–8 — тяжёлое (кома). Снижение ШКГ — один из самых тревожных признаков." },
  { key: "vitals_pain", label: "Боль (NRS 0–10)", default: "Субъективная оценка боли пациентом по числовой рейтинговой шкале от 0 (нет боли) до 10 (максимально возможная боль). 1–3 — слабая, 4–6 — умеренная, 7–10 — сильная. Нелеченная боль вызывает тахикардию, гипертензию и ухудшает прогноз." },
];

const TIPS = [
  { key: "timer", phase: null, default: "Это время, за которое нужно принять решение. Пациент может ухудшаться, если медлить. Следите за таймером в верхней части экрана." },
  { key: "vitals_seq", phase: null, default: null, isVitalSeq: true, children: VITAL_TIPS },
  { key: "test_panel", phase: "order_tests", default: "Выберите обследования, которые считаете нужными для этого пациента. Часть из них обязательна для правильной диагностики." },
  { key: "results_wait", phase: "awaiting_results", default: "Результаты приходят не мгновенно — это имитирует реальное время ожидания анализов." },
  { key: "diagnosis_input", phase: "diagnose", default: "Диагноз состоит из основного (обязательно), осложнений и сопутствующих заболеваний (по ситуации)." },
  { key: "treatment_panel", phase: "treat", default: "Выберите лечение. Некоторые варианты могут быть противопоказаны — учитывайте состояние и сопутствующие заболевания пациента." },
  { key: "result_screen", phase: "result", default: "Каждое решение в игре опирается на конкретную клиническую рекомендацию — вы всегда можете увидеть, на основании чего оценивается ваш выбор." },
  { key: "tour_menu", phase: null, isTourMenu: true, default: "После шага 7 — кнопка «Понятно» на экране результата ведёт в тур по меню" },
];

const MENU_TOUR_STEPS = [
  { key: "menu_filters", anchor: "filters", default: "Здесь вы выбираете отделение. Вы только что были в ОРИТ — остальные три устроены по-своему, при первом выборе каждого вы увидите короткую подсказку именно по нему." },
  { key: "menu_cases", anchor: "cases", default: "Здесь — свободный выбор случаев внутри выбранного отделения. Можно проходить в любом порядке." },
  { key: "menu_curriculum", anchor: "curriculum", default: "А это — структурированное обучение по темам: сначала теория, потом несколько кейсов по ней, потом проверочный тест, и только после этого открывается следующая тема. Хороший способ пройти материал последовательно, а не хаотично." },
  { key: "menu_training", anchor: "training", default: "Если захотите пересмотреть любую из подсказок — основную или по отдельному отделению — они всегда доступны здесь, в любой момент, не только при первом входе." },
  { key: "menu_other", anchor: "other", default: "Здесь можно поменять язык интерфейса и оформление." },
];

function useElementRect(selector, active) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!active || !selector) return;
    const update = () => {
      const el = document.querySelector(selector);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom, right: r.right });
      } else {
        setRect(null);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    const el = document.querySelector(selector);
    if (el) ro.observe(el);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [selector, active]);

  return rect;
}

function SpotlightOverlay({ rect, accent }) {
  if (!rect) return null;
  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: rect.top, zIndex: 2147483646, background: "rgba(0,0,0,0.6)" }} />
      <div style={{ position: "fixed", top: rect.bottom, left: 0, right: 0, bottom: 0, zIndex: 2147483646, background: "rgba(0,0,0,0.6)" }} />
      <div style={{ position: "fixed", top: rect.top, bottom: rect.bottom, left: 0, width: rect.left, zIndex: 2147483646, background: "rgba(0,0,0,0.6)" }} />
      <div style={{ position: "fixed", top: rect.top, bottom: rect.bottom, left: rect.right, right: 0, zIndex: 2147483646, background: "rgba(0,0,0,0.6)" }} />
      <div style={{ position: "fixed", top: rect.top - 2, left: rect.left - 2, width: rect.width + 4, height: rect.height + 4, zIndex: 2147483647, border: `2px solid ${accent}`, borderRadius: 4, boxShadow: `0 0 20px ${accent}66`, pointerEvents: "none" }} />
    </>
  );
}

function TooltipCard({ children, accent }) {
  return (
    <div style={{
      position: "fixed", bottom: 60, left: "50%", transform: "translateX(-50%)",
      zIndex: 2147483647, maxWidth: 400, width: "90%",
      background: "rgba(18,28,43,0.97)", border: `1px solid ${accent}44`,
      borderRadius: 12, padding: "16px 18px",
      boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 20px ${accent}22`, fontFamily: FONT,
    }}>
      {children}
    </div>
  );
}

export default function TutorialGuide({ phase, seenTips, onSkip, showTourMenu, onTourComplete }) {
  const C = useTheme();
  const [tipQueue, setTipQueue] = useState([]);
  const [currentTipIdx, setCurrentTipIdx] = useState(0);
  const [inVitalSub, setInVitalSub] = useState(0);
  const [inMenuTour, setInMenuTour] = useState(0);
  const tickRef = useRef(0);

  const isDead = phase === "dead";

  const currentMenuStep = inMenuTour > 0 ? MENU_TOUR_STEPS[inMenuTour - 1] : null;
  const menuSelector = currentMenuStep ? `#tutorial-${currentMenuStep.anchor}` : null;
  const menuRect = useElementRect(menuSelector, inMenuTour > 0);

  const tip = tipQueue[currentTipIdx];
  const gameTipSelector = tip && !tip.isVitalSeq && !isDead ? `[data-tutorial="${tip.key}"]` : null;
  const gameTipRect = useElementRect(gameTipSelector, !!gameTipSelector);

  const vitalSub = tip && tip.isVitalSeq ? VITAL_TIPS[inVitalSub] : null;
  const vitalSelector = vitalSub ? `[data-tutorial="${vitalSub.key}"]` : null;
  const vitalRect = useElementRect(vitalSelector, !!vitalSelector);

  const queueMainTip = useCallback((tip) => {
    setTipQueue([tip]);
    setCurrentTipIdx(0);
    setInVitalSub(0);
    setInMenuTour(0);
  }, []);

  useEffect(() => {
    if (showTourMenu) {
      queueMainTip(null);
      setInMenuTour(1);
      return;
    }
    if (isDead) return;
    const seq = TIPS.filter(t => !t.isTourMenu);
    const idx = tickRef.current;
    if (idx < seq.length) {
      const tip = seq[idx];
      if (!tip.phase || tip.phase === phase) {
        if (tip.isVitalSeq) {
          if (!seenTips.has(tip.key)) {
            queueMainTip(tip);
          } else {
            tickRef.current += 1;
          }
        } else if (!seenTips.has(tip.key)) {
          queueMainTip(tip);
        } else {
          tickRef.current += 1;
        }
      }
    }
  }, [phase, seenTips, showTourMenu, isDead, queueMainTip]);

  const handleNextVital = () => {
    if (inVitalSub < VITAL_TIPS.length - 1) {
      setInVitalSub(v => v + 1);
    } else {
      onSkip("vitals_seq");
      setTipQueue([]);
      setCurrentTipIdx(0);
      setInVitalSub(0);
      tickRef.current += 1;
    }
  };

  const handleDismiss = () => {
    const tip = tipQueue[currentTipIdx];
    if (!tip) return;
    if (tip.isVitalSeq) {
      handleNextVital();
      return;
    }
    onSkip(tip.key);
    setTipQueue([]);
    setCurrentTipIdx(0);
    tickRef.current += 1;
  };

  const handleMenuTourNext = () => {
    if (inMenuTour < MENU_TOUR_STEPS.length) {
      setInMenuTour(v => v + 1);
    } else {
      setInMenuTour(0);
      onTourComplete && onTourComplete();
    }
  };

  if (inMenuTour > 0) {
    const step = currentMenuStep;
    return createPortal(
      <>
        <SpotlightOverlay rect={menuRect} accent={C.accent} />
        <TooltipCard accent={C.accent}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>📍</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginBottom: 4 }}>
                Тур по меню · {inMenuTour} / {MENU_TOUR_STEPS.length}
              </div>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{step.default}</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
            {inMenuTour <= MENU_TOUR_STEPS.length && (
              <button onClick={() => { setInMenuTour(0); onTourComplete && onTourComplete(); }}
                style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", fontSize: 12, color: C.textDim, cursor: "pointer", fontFamily: FONT }}>
                Пропустить
              </button>
            )}
            <button onClick={handleMenuTourNext}
              style={{ padding: "6px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg,${C.accent},${C.green})`, fontSize: 12, fontWeight: 600, color: C.bg, cursor: "pointer", fontFamily: FONT }}>
              {inMenuTour < MENU_TOUR_STEPS.length ? "Далее" : "Понятно"}
            </button>
          </div>
        </TooltipCard>
      </>,
      document.body
    );
  }

  if (!tip || isDead) return null;

  if (tip.isVitalSeq) {
    const sub = VITAL_TIPS[inVitalSub];
    return createPortal(
      <>
        {vitalRect ? <SpotlightOverlay rect={vitalRect} accent={C.accent} /> : <div style={{ position: "fixed", inset: 0, zIndex: 99998, background: "rgba(0,0,0,0.6)" }} onClick={() => {}} />}
        <div style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          zIndex: 99999, maxWidth: 420, width: "90%",
          background: "rgba(18,28,43,0.97)", border: `1px solid ${C.accent}44`,
          borderRadius: 14, padding: "20px 22px",
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 20px ${C.accent}22`, fontFamily: FONT,
        }}>
          <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginBottom: 8 }}>
            Витальные показатели · {inVitalSub + 1} / {VITAL_TIPS.length}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 8 }}>{sub.label}</div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{sub.default}</div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
            <button onClick={handleDismiss}
              style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", fontSize: 12, color: C.textDim, cursor: "pointer", fontFamily: FONT }}>
              {inVitalSub < VITAL_TIPS.length - 1 ? "Пропустить" : "Готово"}
            </button>
            <button onClick={handleNextVital}
              style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: `linear-gradient(135deg,${C.accent},${C.green})`, fontSize: 13, fontWeight: 600, color: C.bg, cursor: "pointer", fontFamily: FONT }}>
              {inVitalSub < VITAL_TIPS.length - 1 ? "Далее →" : "Понятно"}
            </button>
          </div>
        </div>
      </>,
      document.body
    );
  }

  return createPortal(
    <>
      {gameTipRect ? <SpotlightOverlay rect={gameTipRect} accent={C.accent} /> : <div style={{ position: "fixed", inset: 0, zIndex: 99998, background: "rgba(0,0,0,0.6)" }} onClick={() => {}} />}
      <TooltipCard accent={C.accent}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>📖</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginBottom: 4 }}>Обучение</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{tip.default}</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button onClick={handleDismiss}
            style={{ padding: "6px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", fontSize: 12, color: C.textDim, cursor: "pointer", fontFamily: FONT }}>
            Понятно
          </button>
        </div>
      </TooltipCard>
    </>,
    document.body
  );
}
