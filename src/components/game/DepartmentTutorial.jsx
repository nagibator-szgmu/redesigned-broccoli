import { createPortal } from "react-dom";
import { FONT, RADIUS } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { IconHospital } from "../../ui/icons";

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
      <div style={{ position: "fixed", inset: 0, zIndex: 2147483646, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }} onClick={onClose} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        zIndex: 2147483647, maxWidth: 460, width: "90%", maxHeight: "90vh", overflowY: "auto",
        background: C.overlayBg, border: `1px solid ${C.accent}66`,
        borderRadius: RADIUS.md, padding: "20px 22px",
        boxShadow: "0 24px 72px rgba(0,0,0,0.9), 0 0 0 1px rgba(0,230,200,0.15)",
        fontFamily: FONT, WebkitOverflowScrolling: "touch"
      }}>
        <div style={{ fontSize: 13, color: C.accent, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <IconHospital size={16} color={C.accent} />
          <span>{deptLabel}</span>
        </div>
        {tips.map((tip, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, marginBottom: 10,
            padding: "8px 12px", borderRadius: RADIUS.xs,
            background: `${C.accent}08`, border: `1px solid ${C.accent}12`,
          }}>
            <span style={{ fontSize: 12, color: C.accent, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
            <span style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{tip}</span>
          </div>
        ))}
        <button
          onClick={onClose}
          style={{
            marginTop: 12, width: "100%", padding: "10px 16px",
            borderRadius: RADIUS.xs, border: "none",
            background: C.accent, color: C.bg,
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: FONT, minHeight: 40
          }}
        >
          Понятно
        </button>
      </div>
    </>,
    document.body
  );
}
