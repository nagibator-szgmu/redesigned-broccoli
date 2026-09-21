import React from "react";
import { RADIUS } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { IconParty, IconPlay, IconBook, IconGear } from "../../ui/icons";

export function ResultTutorialBanner({ isMobile }) {
  const C = useTheme();

  return (
    <div
      style={{
        background: `${C.green}18`,
        border: `1px solid ${C.green}44`,
        borderRadius: isMobile ? RADIUS.sm : RADIUS.md,
        padding: isMobile ? 14 : 16,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <IconParty size={24} color={C.green} />
        <div>
          <div style={{ fontSize: 13, color: C.green, fontWeight: 700, marginBottom: 6 }}>
            Обучение пройдено!
          </div>
          <div style={{ fontSize: 12, color: C.text, lineHeight: 1.7, marginBottom: 10 }}>
            Вы ознакомились с основными механиками симулятора. Теперь вы готовы к самостоятельной работе.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text }}>
              <IconPlay size={12} color={C.accent} />
              <span>Выберите любой кейс и начните симуляцию</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text }}>
              <IconBook size={12} color={C.accent} />
              <span>Изучайте теорию и протоколы в разделе «Теория»</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text }}>
              <IconGear size={12} color={C.accent} />
              <span>В настройках доступны режимы обучения и оценки</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
