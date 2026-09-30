import React from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT } from "../../ui/theme";
import { STitle, Tooltip } from "../../ui/components";
import { IconCheck, IconUser } from "../../ui/icons";
import { deriveProblemList } from "../../engine/problemListEngine";
import {
  useProblemListTimer,
  ProblemListTrigger,
  ProblemListLoading,
  ProblemListItem,
} from "./problemList";

/**
 * Панель «Помощь наставника»: по умолчанию отображает кнопку вызова наставника.
 * При клике запускается 15-секундный таймер анализа клинической картины,
 * после чего открывается структурированный список клинических синдромов и проблем.
 */
export default function ProblemListPanel({ cd, ps, revealedResults = {} }) {
  const C = useTheme();
  const { status, timeLeft, progress, startLoading } = useProblemListTimer(cd?.id);
  const problems = deriveProblemList(ps, revealedResults);

  if (status === "idle") {
    return <ProblemListTrigger onStart={startLoading} C={C} />;
  }

  if (status === "loading") {
    return <ProblemListLoading timeLeft={timeLeft} progress={progress} C={C} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Tooltip text="Клинические синдромы пациента, выделенные наставником" position="top">
          <STitle icon={<IconUser size={15} color={C.accent} />} label="Помощь наставника: Синдромы" color={C.accent} />
        </Tooltip>
        <span style={{ fontSize: 10, color: C.textDim, fontFamily: FONT }}>
          Активно: <strong>{problems.length}</strong>
        </span>
      </div>

      {problems.length === 0 ? (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            background: C.btnBg,
            border: `1px solid ${C.btnBorder}`,
            fontSize: 11,
            color: C.green,
            fontFamily: FONT,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <IconCheck size={13} color={C.green} />
          <span>Острых синдромных нарушений не выявлено</span>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {problems.map((prob) => (
            <ProblemListItem key={prob.id} prob={prob} C={C} />
          ))}
        </div>
      )}
    </div>
  );
}

