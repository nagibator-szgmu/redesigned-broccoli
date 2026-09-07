import React from "react";
import { useTheme } from "../ui/ThemeContext";
import { FONT, CODE } from "../ui/theme";
import useIsMobile from "../hooks/useIsMobile";
import { HeaderBackBtn } from "../ui/components";

/**
 * Teacher Dashboard screen placeholder.
 * Per Task 3 requirements: displays "Раздел находится в разработке" / "В разработке",
 * with all internal buttons, links, and triggers disabled and non-clickable (pointer-events: none / not-allowed).
 */
export default function TeacherDashboardScreen({ setPhase }) {
  const C = useTheme();
  const isMobile = useIsMobile(768);

  return (
    <div
      data-testid="teacher-screen"
      style={{
        minHeight: "100dvh",
        background: C.bgGrad,
        color: C.white,
        fontFamily: FONT,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Top Header Bar with active return button */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "12px 16px" : "16px 28px",
          background: C.headerBg,
          borderBottom: `1px solid ${C.border}`,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <HeaderBackBtn onClick={() => setPhase("menu")} />
          <div>
            <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: C.white, letterSpacing: -0.2 }}>
              Кабинет преподавателя
            </div>
            <div style={{ fontSize: 11, color: C.textDim, fontFamily: CODE }}>
              Аналитика групп и когнитивный аудит ОСКЭ
            </div>
          </div>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: `${C.yellow}15`,
            border: `1px solid ${C.yellow}44`,
            borderRadius: 9999,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 700,
            color: C.yellow,
          }}
        >
          <span style={{ fontSize: 12 }}>🚧</span>
          <span>В разработке</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "24px 16px 40px" : "40px 24px",
          textAlign: "center",
          maxWidth: 720,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Placeholder Graphic Card */}
        <div
          style={{
            width: "100%",
            background: C.panelBg,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: isMobile ? "32px 20px" : "44px 36px",
            boxShadow: "0 12px 36px rgba(0,0,0,0.3)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Ambient Backdrop Glow */}
          <div
            style={{
              position: "absolute",
              top: -40,
              left: "50%",
              transform: "translateX(-50%)",
              width: 240,
              height: 120,
              background: `radial-gradient(circle, ${C.accent}25 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: `${C.accent}15`,
              border: `1.5px solid ${C.accent}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              margin: "0 auto 20px auto",
            }}
          >
            👨‍🏫
          </div>

          <h2
            style={{
              fontSize: isMobile ? 20 : 24,
              fontWeight: 800,
              color: C.white,
              marginBottom: 10,
              fontFamily: FONT,
            }}
          >
            Раздел находится в разработке
          </h2>

          <p
            style={{
              fontSize: isMobile ? 13 : 14,
              color: C.textDim,
              lineHeight: 1.6,
              maxWidth: 520,
              margin: "0 auto 28px auto",
            }}
          >
            Модуль преподавателя (управление группами студентов, централизованная выгрузка протоколов ОСКЭ, тепловая карта когнитивных ошибок и SCORM-интеграция) готовится к релизу в следующем обновлении.
          </p>

          {/* Muted Non-interactive Mock Control Panel (Non-clickable / Disabled) */}
          <div
            data-testid="teacher-disabled-controls"
            style={{
              opacity: 0.5,
              pointerEvents: "none",
              userSelect: "none",
              cursor: "not-allowed",
              background: C.headerBg2,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  tabIndex={-1}
                  disabled
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: C.panelBg,
                    border: `1px solid ${C.border}`,
                    color: C.textDim,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "not-allowed",
                  }}
                >
                  Студенты группы
                </button>
                <button
                  tabIndex={-1}
                  disabled
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: C.panelBg,
                    border: `1px solid ${C.border}`,
                    color: C.textDim,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "not-allowed",
                  }}
                >
                  Тепловая карта ошибок
                </button>
              </div>

              <button
                tabIndex={-1}
                disabled
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: `${C.accent}20`,
                  border: `1px solid ${C.accent}40`,
                  color: C.textDim,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "not-allowed",
                }}
              >
                📥 Экспорт отчёта CSV
              </button>
            </div>

            <div
              style={{
                height: 54,
                borderRadius: 8,
                background: `${C.dimBg}`,
                border: `1px dashed ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                color: C.textDim,
              }}
            >
              Интерактивные функции временно отключены
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <button
              onClick={() => setPhase("menu")}
              style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.green})`,
                border: "none",
                borderRadius: 12,
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 700,
                color: C.bg,
                cursor: "pointer",
                fontFamily: FONT,
                boxShadow: `0 4px 16px ${C.accent}30`,
                transition: "transform 0.15s ease",
              }}
            >
              Вернуться в главное меню
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
