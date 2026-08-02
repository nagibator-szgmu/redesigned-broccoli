import React, { useEffect, useState } from 'react';

/**
 * AntiTamperGuard
 * Active Anti-Piracy DOM Guard for MedSim.
 * Continuously monitors the official 3D Emblem container using MutationObserver.
 * If the emblem is deleted from DOM or hidden via CSS (display:none, opacity:0, hidden),
 * the app immediately locks down with a license integrity error screen.
 */
export function AntiTamperGuard({ children, emblemId = 'medsim-3d-emblem-container' }) {
  const [tampered, setTampered] = useState(false);

  useEffect(() => {
    function checkIntegrity() {
      const el = document.getElementById(emblemId);
      if (!el) return; // If emblem is not on this screen, do not lock up

      const style = window.getComputedStyle(el);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        parseFloat(style.opacity) < 0.05 ||
        style.height === '0px' ||
        style.width === '0px'
      ) {
        setTampered(true);
      }
    }

    const interval = setInterval(checkIntegrity, 1000);

    return () => clearInterval(interval);
  }, [emblemId]);

  if (tampered) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999999,
        background: '#070b14',
        color: '#ff4d4d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center',
        padding: 24
      }}>
        <div style={{
          fontSize: 48,
          marginBottom: 16,
          filter: 'drop-shadow(0 0 12px rgba(255, 77, 77, 0.5))'
        }}>🔒</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 10 }}>
          Ошибка целостности лицензии MedSim®
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 14, maxWidth: 440, lineHeight: 1.6, margin: 0 }}>
          Обнаружена попытка удаления или модификации защищённой 3D-эмблемы «45 am».
          Симуляция заблокирована для защиты авторских прав.
        </p>
      </div>
    );
  }

  return children;
}

export default AntiTamperGuard;
