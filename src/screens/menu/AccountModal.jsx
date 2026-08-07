import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FONT } from "../../ui/theme";
import {
  IconGraduationCap, IconStethoscope, IconCardiac,
  IconAbdominal, IconNeuro, IconCheck
} from "../../ui/icons";

export const AVATARS = [
  { id: "student", label: "Студент-интерн", role: "Лечебное дело", icon: IconGraduationCap, color: "#00e6c8", bg: "linear-gradient(135deg, rgba(0,230,200,0.25), rgba(0,180,216,0.15))" },
  { id: "therapist", label: "Врач-терапевт", role: "Поликлиника", icon: IconStethoscope, color: "#00e5a0", bg: "linear-gradient(135deg, rgba(0,229,160,0.25), rgba(0,200,140,0.15))" },
  { id: "cardiologist", label: "Кардиолог", role: "ОРИТ / Кардио", icon: IconCardiac, color: "#ff3d5a", bg: "linear-gradient(135deg, rgba(255,61,90,0.25), rgba(245,124,66,0.15))" },
  { id: "surgeon", label: "Хирург-реаниматолог", role: "Приёмное / Хирургия", icon: IconAbdominal, color: "#f57c42", bg: "linear-gradient(135deg, rgba(245,124,66,0.25), rgba(245,200,66,0.15))" },
  { id: "professor", label: "Профессор медицины", role: "Кафедра / Эксперт", icon: IconNeuro, color: "#9d6ff5", bg: "linear-gradient(135deg, rgba(157,111,245,0.25), rgba(0,230,200,0.15))" },
];

export function getUserAvatar() {
  try {
    const saved = localStorage.getItem("ms_userAvatar");
    return AVATARS.find(a => a.id === saved) || AVATARS[0];
  } catch {
    return AVATARS[0];
  }
}

export default function AccountModal({ showAccount, setShowAccount, C, isMobile }) {
  const [selectedId, setSelectedId] = useState(() => getUserAvatar().id);

  useEffect(() => {
    try { localStorage.setItem("ms_userAvatar", selectedId); } catch { /* ignore */ }
  }, [selectedId]);

  if (!showAccount) return null;

  const current = AVATARS.find(a => a.id === selectedId) || AVATARS[0];
  const CurrentIcon = current.icon;

  const positionStyle = isMobile
    ? { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "90%", maxWidth: 360, maxHeight: "90vh", overflowY: "auto" }
    : { top: 72, left: 240, width: 340, maxHeight: "85vh", overflowY: "auto" };

  return createPortal(
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 99998, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setShowAccount(false)} />
      <div style={{
        position: "fixed", ...positionStyle, zIndex: 99999,
        background: C.overlayBg, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        border: `1px solid ${C.accent}33`, borderRadius: 18, padding: "20px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(0,230,200,0.1)", fontFamily: FONT
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.white }}>Профиль и Аккаунт</span>
          <button onClick={() => setShowAccount(false)} aria-label="Закрыть профиль" style={{ width: 32, height: 32, borderRadius: 8, background: C.dimBg, border: "none", color: C.textDim, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <IconCheck size={14} color={C.textDim} />
          </button>
        </div>

        {/* Profile Card */}
        <div style={{ background: current.bg, border: `1px solid ${current.color}44`, borderRadius: 14, padding: "14px", marginBottom: 18, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: `${current.color}20`, border: `2px solid ${current.color}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CurrentIcon size={24} color={current.color} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.white, fontFamily: FONT }}>Студент-Медик</div>
            <div style={{ fontSize: 11, color: current.color, fontWeight: 600, marginTop: 2 }}>{current.label} · {current.role}</div>
          </div>
        </div>

        {/* Avatar Selection Section */}
        <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 10 }}>
          Выберите аватар врача (5 вариантов)
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {AVATARS.map((item) => {
            const IconComp = item.icon;
            const isSel = item.id === selectedId;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className="filter-pill"
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12,
                  background: isSel ? `${item.color}15` : C.btnBg,
                  border: `1px solid ${isSel ? item.color : C.border}`,
                  cursor: "pointer", transition: "all 0.2s ease"
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${item.color}20`, border: `1px solid ${item.color}66`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <IconComp size={18} color={item.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isSel ? item.color : C.white }}>{item.label}</div>
                  <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>{item.role}</div>
                </div>
                {isSel && <IconCheck size={16} color={item.color} />}
              </div>
            );
          })}
        </div>
      </div>
    </>,
    document.body
  );
}
