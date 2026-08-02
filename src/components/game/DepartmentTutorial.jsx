import { createPortal } from "react-dom";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";

const TUTORIALS = {
  outpatient: [
    "Здесь нет ни таймера, ни автоматического ухудшения состояния — пациент не умрёт, пока вы думаете.",
    "Витальные показатели не показываются сразу — нажмите «Провести осмотр», чтобы увидеть список доступных измерений, и выберите, что именно хотите проверить.",
    "Ваша задача — не вылечить всё сразу, а правильно решить, что делать дальше: лечить здесь, направить к специалисту, направить в стационар или вызвать скорую.",
    "Диагноз здесь тоже вводится структурированно, как и в основном режиме.",
    "Анамнез — тоже отдельное действие: нажмите «Собрать анамнез», чтобы узнать историю болезни и жизни пациента. Это может повлиять на то, какое лечение окажется противопоказанным.",
  ],
  admission: [
    "Здесь всё происходит в реальном времени, как и в ОРИТ — но ваша цель другая: не вылечить пациента полностью, а решить, куда его направить дальше.",
    "В любой момент вы можете выбрать маршрут: в стационар, в реанимацию, домой или на срочную операцию — не обязательно ждать, пока пациент стабилизируется или ухудшится до предела.",
    "Если вы совсем не примете решение, а время выйдет — это тоже будет считаться ошибкой, отдельной от выбора неверного маршрута.",
  ],
  stationary: [
    "Здесь время идёт не секундами, а сутками — вы принимаете решения на день вперёд, а не реагируете мгновенно.",
    "Каждое утро — новый день: вы видите состояние пациента и результаты вчерашних назначений, корректируете план.",
    "Если лечение выбрано неверно, состояние может ухудшиться вплоть до перевода в реанимацию — старайтесь замечать тревожные признаки заранее.",
    "Анамнез заболевания и анамнез жизни собираются отдельно — оба доступны отдельными действиями и могут повлиять на выбор безопасного лечения.",
  ],
};

export default function DepartmentTutorial({ dept, onClose }) {
  const C = useTheme();
  const { t } = useTranslate();
  const tips = TUTORIALS[dept];
  if (!tips) return null;

  const deptLabel = dept === "outpatient" ? t("department.outpatient") :
    dept === "admission" ? t("department.admission") :
    t("department.stationary");

  return createPortal(
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 999999, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        zIndex: 1000000, maxWidth: 460, width: "90%",
        background: C.overlayBg, border: `1px solid ${C.accent}66`,
        borderRadius: 16, padding: "24px 26px",
        boxShadow: "0 24px 72px rgba(0,0,0,0.85), 0 0 0 1px rgba(0,230,200,0.1)",
        fontFamily: FONT,
      }}>
        <div style={{ fontSize: 13, color: C.accent, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          🏥 {deptLabel}
        </div>
        {tips.map((tip, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, marginBottom: 10,
            padding: "8px 12px", borderRadius: 8,
            background: `${C.accent}08`, border: `1px solid ${C.accent}12`,
          }}>
            <span style={{ fontSize: 12, color: C.accent, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
            <span style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{tip}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <button onClick={onClose}
            style={{ padding: "8px 20px", borderRadius: 8,
              background: `linear-gradient(135deg,${C.accent},${C.green})`,
              border: "none", color: C.bg, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
            {t("onboarding.start")}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
