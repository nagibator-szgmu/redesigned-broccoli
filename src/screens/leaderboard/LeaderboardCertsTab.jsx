import React from "react";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { IconGraduationCap, IconCheck } from "../../ui/icons";
import { renderCertIcon } from "./leaderboardUtils";

/** Вкладка достижений и полученных сертификатов */
export default function LeaderboardCertsTab({
  earned,
  totalCerts,
  certSections,
  isMobile = false,
}) {
  const C = useTheme();

  return (
    <div>
      <div
        style={{
          background: C.heroGrad,
          borderRadius: isMobile ? 14 : 18,
          padding: isMobile ? "18px 16px" : "24px 20px",
          marginBottom: 14,
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <IconGraduationCap size={44} color={C.accent} />
        </div>
        <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: C.white, fontFamily: FONT, marginBottom: 6 }}>
          Сертификаты и дипломы
        </div>
        <div style={{ fontSize: isMobile ? 13 : 14, color: C.heroText, fontFamily: FONT }}>
          Получено: <span style={{ color: C.accent, fontWeight: 700 }}>{earned.size}</span> из {totalCerts}
        </div>
        <div style={{ marginTop: 10, height: 6, background: `${C.border}`, borderRadius: 3, overflow: "hidden", maxWidth: 300, margin: "10px auto 0" }}>
          <div
            style={{
              height: "100%",
              width: `${(earned.size / totalCerts) * 100}%`,
              background: `linear-gradient(90deg,${C.accent},${C.green})`,
              borderRadius: 3,
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        {certSections.map((sec) => (
          <div key={sec.title} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 14, fontFamily: FONT }}>
              {sec.title}
            </div>
            {sec.items.map((cert) => {
              const isEarned = earned.has(cert.id);
              return (
                <div
                  key={cert.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 10,
                    marginBottom: 6,
                    background: isEarned ? `${cert.color}10` : "transparent",
                    border: `1px solid ${isEarned ? cert.color + "44" : C.border}`,
                    opacity: isEarned ? 1 : 0.45,
                  }}
                >
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26 }}>
                    {renderCertIcon(cert, isEarned)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: isEarned ? cert.color : C.textDim, fontWeight: 600, fontFamily: FONT }}>
                      {cert.title}
                    </div>
                    <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>{cert.desc}</div>
                  </div>
                  {isEarned && <IconCheck size={16} color={C.green} />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
