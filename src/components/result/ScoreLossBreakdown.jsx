import React from "react";
import { FONT, RADIUS } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { IconCheck, IconX, IconAlertTriangle, IconBook } from "../../ui/icons";

export default function ScoreLossBreakdown({ criteria = [], totalScore = 0, isMobile = false }) {
  const C = useTheme();

  if (!criteria || criteria.length === 0) return null;

  const totalLost = criteria.reduce((acc, c) => acc + (c.lost > 0 ? c.lost : 0), 0);

  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: isMobile ? RADIUS.sm : RADIUS.md,
        padding: isMobile ? 12 : 16,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: FONT, display: "flex", alignItems: "center", gap: 6 }}>
          <span>Критерии оценивания и баланс баллов</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {totalLost > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.red,
                background: `${C.red}18`,
                border: `1px solid ${C.red}44`,
                padding: "2px 8px",
                borderRadius: RADIUS.xs,
              }}
            >
              Потеряно: −{totalLost} б.
            </span>
          )}
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: totalScore >= 85 ? C.green : totalScore >= 70 ? C.accent : C.yellow,
              background: `${C.accent}14`,
              border: `1px solid ${C.border}`,
              padding: "2px 8px",
              borderRadius: RADIUS.xs,
            }}
          >
            Итого: {totalScore} / 100 б.
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {criteria.map((c) => {
          const isOk = c.lost === 0 && c.status !== "penalty";
          const isPartial = c.status === "partial";
          const itemColor = isOk ? C.green : isPartial ? C.yellow : C.red;

          return (
            <div
              key={c.id}
              style={{
                background: `${itemColor}0a`,
                border: `1px solid ${itemColor}33`,
                borderRadius: RADIUS.xs,
                padding: "8px 12px",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: `${itemColor}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {isOk ? (
                  <IconCheck size={13} color={C.green} strokeWidth={2.5} />
                ) : isPartial ? (
                  <IconAlertTriangle size={13} color={C.yellow} strokeWidth={2} />
                ) : (
                  <IconX size={13} color={C.red} strokeWidth={2.5} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3, gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text, fontFamily: FONT }}>
                    {c.title}
                  </span>
                  <div style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT, whiteSpace: "nowrap" }}>
                    <span style={{ color: itemColor }}>
                      {c.max > 0 ? `${c.earned} / ${c.max} б.` : `${c.earned} б.`}
                    </span>
                    {c.lost > 0 && c.max > 0 && (
                      <span style={{ color: C.red, marginLeft: 6 }}>
                        (−{c.lost} б.)
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.45, fontFamily: FONT }}>
                  {c.details}
                </div>

                {c.recommendation && (
                  <div style={{ fontSize: 11, color: C.accent, marginTop: 4, display: "flex", alignItems: "center", gap: 5, fontFamily: FONT }}>
                    <IconBook size={12} color={C.accent} />
                    <span>{c.recommendation}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
