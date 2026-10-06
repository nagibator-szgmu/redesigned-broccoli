import React from "react";
import { FONT, CODE } from "../../ui/theme";
import {
  IconCheck,
  IconLock,
  IconHospital,
  IconBed,
  IconStethoscope,
  IconAmbulance,
} from "../../ui/icons";

export default function CourseMapInspectorCases({
  cases = [],
  completedCases = [],
  isUnlocked,
  onStartCase,
  C,
}) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 0.6 }}>
        Кейсы модуля ({completedCases.length}/{cases.length})
      </div>
      {cases.map((c) => {
        const isDone = completedCases.includes(c.id);
        const deptIcon =
          c.department === "admission" ? <IconHospital size={12} color="currentColor" /> :
          c.department === "outpatient" ? <IconStethoscope size={12} color="currentColor" /> :
          c.department === "stationary" ? <IconBed size={12} color="currentColor" /> :
          <IconAmbulance size={12} color="currentColor" />;

        return (
          <div
            key={c.id}
            onClick={() => isUnlocked && onStartCase(c.id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 10px",
              borderRadius: 10,
              background: isDone ? `${C.green}10` : `${C.dimBg}aa`,
              border: `1px solid ${isDone ? `${C.green}30` : C.border}`,
              cursor: isUnlocked ? "pointer" : "default",
              fontSize: 12,
              fontFamily: FONT,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
              <span style={{ color: isDone ? C.green : C.textDim }}>{deptIcon}</span>
              <span style={{ color: isDone ? C.white : C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {c.name}
              </span>
            </div>
            {isDone ? (
              <IconCheck size={14} color={C.green} strokeWidth={2.5} />
            ) : isUnlocked ? (
              <span style={{ fontSize: 10, color: C.accent, fontWeight: 700, fontFamily: CODE }}>СТАРТ</span>
            ) : (
              <IconLock size={12} color={C.textDim} />
            )}
          </div>
        );
      })}
    </div>
  );
}
