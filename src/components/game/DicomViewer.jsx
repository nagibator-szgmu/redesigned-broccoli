import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT, CODE } from "../../ui/theme";
import { renderSlice, calculateHU, WINDOW_PRESETS, PATHOLOGY_TYPES } from "../../engine/dicomRenderer";
import useIsMobile from "../../hooks/useIsMobile";

const MAX_SLICES = 30;
const CANVAS_WIDTH = 256;
const CANVAS_HEIGHT = 256;
const PIXEL_SPACING = 0.5; // mm per pixel

export default function DicomViewer({ cd, onClose }) {
  const C = useTheme();
  const isMobile = useIsMobile();
  
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [sliceIndex, setSliceIndex] = useState(15);
  const [preset, setPreset] = useState(WINDOW_PRESETS.BRAIN);
  const [huValue, setHuValue] = useState(null);
  
  // Tools
  const [rulerMode, setRulerMode] = useState(false);
  const [rulerStart, setRulerStart] = useState(null);
  const [rulerEnd, setRulerEnd] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Auto-detect pathology type from case diagnosis or custom findings
  let pathology = PATHOLOGY_TYPES.NONE;
  if (cd) {
    if (cd.imagingFindings?.pathology) {
      pathology = cd.imagingFindings.pathology;
    } else {
      const diagLower = (cd.diagnosis || "").toLowerCase();
      const compLower = (cd.complaint || "").toLowerCase();
      if (diagLower.includes("гематом") || diagLower.includes("кровоизлиян") || compLower.includes("гематом")) {
        pathology = PATHOLOGY_TYPES.HEMATOMA;
      } else if (diagLower.includes("инсульт") || diagLower.includes("ишемическ") || diagLower.includes("инфаркт мозга")) {
        pathology = PATHOLOGY_TYPES.STROKE;
      }
    }
  }

  // Render Image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    // Generate mathematically simulated CT slice
    const imageData = renderSlice(CANVAS_WIDTH, CANVAS_HEIGHT, sliceIndex, preset, pathology);
    ctx.putImageData(imageData, 0, 0);
  }, [sliceIndex, preset, pathology]);

  // Render Overlays (Ruler)
  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    if (rulerStart && rulerEnd) {
      ctx.beginPath();
      ctx.moveTo(rulerStart.x, rulerStart.y);
      ctx.lineTo(rulerEnd.x, rulerEnd.y);
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Calculate distance (compensating for canvas client stretch)
      const dx = rulerEnd.x - rulerStart.x;
      const dy = rulerEnd.y - rulerStart.y;
      const distPx = Math.sqrt(dx * dx + dy * dy);
      const distMm = (distPx * PIXEL_SPACING).toFixed(1);
      
      ctx.fillStyle = "#00ff00";
      ctx.font = "bold 9px 'Courier New', monospace";
      ctx.fillText(`${distMm} mm`, rulerEnd.x + 5, rulerEnd.y + 5);
    }
  }, [rulerStart, rulerEnd]);

  // Handle Mouse Wheel for scrolling
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setSliceIndex(prev => Math.min(MAX_SLICES, prev + 1));
    } else {
      setSliceIndex(prev => Math.max(1, prev - 1));
    }
  };

  // Convert client cursor coords to canvas pixels
  const getCanvasCoords = (e) => {
    const rect = overlayRef.current.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  // Handle Mouse Events for Ruler & HU display
  const handleMouseMove = (e) => {
    const { x, y } = getCanvasCoords(e);
    
    // Update HU value
    if (x >= 0 && x < CANVAS_WIDTH && y >= 0 && y < CANVAS_HEIGHT) {
      const hu = calculateHU(x, y, CANVAS_WIDTH, CANVAS_HEIGHT, sliceIndex, pathology);
      setHuValue(hu > -999 ? Math.floor(hu) : -1000);
    }
    
    if (rulerMode && isDrawing && rulerStart) {
      setRulerEnd({ x, y });
    }
  };

  const handleMouseDown = (e) => {
    if (!rulerMode) return;
    const { x, y } = getCanvasCoords(e);
    setRulerStart({ x, y });
    setRulerEnd({ x, y });
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    if (rulerMode) {
      setIsDrawing(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "#050a12",
      color: "#e8f4ff", display: "flex", flexDirection: isMobile ? "column" : "row",
      fontFamily: FONT, overflowY: isMobile ? "auto" : "hidden"
    }}>
      {/* Sidebar Controls */}
      <div style={{
        width: isMobile ? "100%" : 250, borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.08)",
        borderBottom: isMobile ? "1px solid rgba(255,255,255,0.08)" : "none",
        padding: isMobile ? 12 : 18, display: "flex", flexDirection: "column", gap: isMobile ? 10 : 18, background: "#080f1b",
        boxSizing: "border-box", flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: C.accent, letterSpacing: 0.8 }}>PACS VIEW</h2>
          <button 
            onClick={onClose} 
            style={{
              background: "rgba(255,61,90,0.15)", border: "1px solid rgba(255,61,90,0.3)",
              borderRadius: 8, padding: "5px 12px", color: C.red, fontSize: 11, cursor: "pointer",
              fontFamily: FONT, fontWeight: 600
            }}
          >
            Закрыть
          </button>
        </div>

        <div>
          <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Карта Пациента</div>
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 12, border: "1px solid rgba(255,255,255,0.04)", fontSize: 12, lineHeight: 1.6 }}>
            <div><strong>ФИО:</strong> {cd?.name || "Иванов И.И."}</div>
            <div><strong>Возраст:</strong> {cd?.age || "60"} л.</div>
            <div><strong>Исследование:</strong> КТ головного мозга</div>
            <div><strong>Режим:</strong> Нативный (без к/у)</div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Оконные режимы (W/L)</div>
          <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: 6, flexWrap: "wrap" }}>
            {Object.values(WINDOW_PRESETS).map(p => (
              <button 
                key={p.name}
                onClick={() => setPreset(p)}
                style={{
                  background: preset.name === p.name ? `${C.accent}18` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${preset.name === p.name ? C.accent : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 8, padding: "8px 12px", color: preset.name === p.name ? C.accent : C.textDim,
                  fontSize: 11.5, cursor: "pointer", textAlign: "left", fontFamily: FONT, transition: "all 0.15s",
                  flex: isMobile ? "1 1 auto" : "none"
                }}
              >
                {p.name} (W:{p.windowWidth} L:{p.windowLevel})
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Инструменты</div>
          <button 
            onClick={() => {
              setRulerMode(!rulerMode);
              if (rulerMode) {
                setRulerStart(null);
                setRulerEnd(null);
              }
            }}
            style={{
              width: "100%", background: rulerMode ? `${C.green}18` : "rgba(255,255,255,0.03)",
              border: `1px solid ${rulerMode ? C.green : "rgba(255,255,255,0.06)"}`,
              borderRadius: 8, padding: "9px 12px", color: rulerMode ? C.green : C.textDim,
              fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              fontFamily: FONT, fontWeight: 600, transition: "all 0.15s"
            }}
          >
            <span>📏</span> Линейка (измерение в мм)
          </button>
        </div>

        {!isMobile && (
          <div style={{ marginTop: "auto", fontSize: 10, color: C.textDim, lineHeight: 1.5 }}>
            💡 Используйте колесо мыши для пролистывания срезов над снимком.
          </div>
        )}
      </div>

      {/* Main View Area */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: isMobile ? 12 : 24, position: "relative"
      }}>
        {/* Canvas wrapper */}
        <div 
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setHuValue(null)}
          style={{
            position: "relative", width: isMobile ? "100%" : 512, height: isMobile ? "auto" : 512,
            maxWidth: isMobile ? 320 : "100%", aspectRatio: "1/1",
            background: "#000", border: "2px solid rgba(255,255,255,0.08)", borderRadius: 12,
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.8)", cursor: rulerMode ? "crosshair" : "default"
          }}
        >
          {/* Main Slice Canvas */}
          <canvas 
            ref={canvasRef} 
            width={CANVAS_WIDTH} 
            height={CANVAS_HEIGHT} 
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              borderRadius: 10, imageRendering: "pixelated"
            }}
          />
          {/* Transparent Overlay Canvas for drawing ruler */}
          <canvas 
            ref={overlayRef} 
            width={CANVAS_WIDTH} 
            height={CANVAS_HEIGHT} 
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              borderRadius: 10, pointerEvents: "none"
            }}
          />
          
          {/* HUD Info */}
          <div style={{ position: "absolute", top: 14, left: 16, fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: CODE, textShadow: "1px 1px 2px #000", lineHeight: 1.4 }}>
            КТ Головного мозга<br />
            Срез: {sliceIndex} / {MAX_SLICES}
          </div>
          <div style={{ position: "absolute", top: 14, right: 16, fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: CODE, textShadow: "1px 1px 2px #000" }}>
            W: {preset.windowWidth} L: {preset.windowLevel}
          </div>
          <div style={{ position: "absolute", bottom: 14, left: 16, fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: CODE, textShadow: "1px 1px 2px #000" }}>
            Увеличение: 100%<br />
            Положение: HFS
          </div>
          <div style={{ position: "absolute", bottom: 14, right: 16, fontSize: 12, color: C.accent, fontWeight: "bold", fontFamily: CODE, textShadow: "1px 1px 2px #000" }}>
            {huValue !== null ? `Плотность: ${huValue} HU` : ""}
          </div>
        </div>

        {/* Slice Slider */}
        <div style={{ width: isMobile ? "100%" : 512, maxWidth: isMobile ? 320 : "100%", marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: CODE }}>Срез 1</span>
          <input 
            type="range" 
            min="1" 
            max={MAX_SLICES} 
            value={sliceIndex}
            onChange={(e) => setSliceIndex(parseInt(e.target.value))}
            style={{
              flex: 1, accentColor: C.accent, cursor: "pointer", height: 6,
              background: "rgba(255,255,255,0.1)", borderRadius: 3, outline: "none"
            }}
          />
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: CODE }}>Срез {MAX_SLICES}</span>
        </div>
      </div>
    </div>
  );
}
