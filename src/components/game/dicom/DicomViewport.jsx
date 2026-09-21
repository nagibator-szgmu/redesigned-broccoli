import { CODE } from "../../../ui/theme";
import { CANVAS_WIDTH, CANVAS_HEIGHT, MAX_SLICES } from "./dicomUtils";

export default function DicomViewport({
  canvasRef,
  overlayRef,
  sliceIndex,
  setSliceIndex,
  preset,
  huValue,
  setHuValue,
  rulerMode,
  handleWheel,
  handleMouseMove,
  handleMouseDown,
  handleMouseUp,
  isMobile,
  C,
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? 12 : 24,
        position: "relative",
      }}
    >
      {/* Canvas wrapper */}
      <div
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setHuValue(null)}
        style={{
          position: "relative",
          width: isMobile ? "100%" : 512,
          height: isMobile ? "auto" : 512,
          maxWidth: isMobile ? 320 : "100%",
          aspectRatio: "1/1",
          background: "#000",
          border: "2px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.8)",
          cursor: rulerMode ? "crosshair" : "default",
        }}
      >
        {/* Main Slice Canvas */}
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            borderRadius: 10,
            imageRendering: "pixelated",
          }}
        />
        {/* Transparent Overlay Canvas for drawing ruler */}
        <canvas
          ref={overlayRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            borderRadius: 10,
            pointerEvents: "none",
          }}
        />

        {/* HUD Info */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            fontSize: 11,
            color: "rgba(255,255,255,0.7)",
            fontFamily: CODE,
            textShadow: "1px 1px 2px #000",
            lineHeight: 1.4,
          }}
        >
          КТ Головного мозга<br />
          Срез: {sliceIndex} / {MAX_SLICES}
        </div>
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            fontSize: 11,
            color: "rgba(255,255,255,0.7)",
            fontFamily: CODE,
            textShadow: "1px 1px 2px #000",
          }}
        >
          W: {preset.windowWidth} L: {preset.windowLevel}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 16,
            fontSize: 11,
            color: "rgba(255,255,255,0.7)",
            fontFamily: CODE,
            textShadow: "1px 1px 2px #000",
          }}
        >
          Увеличение: 100%<br />
          Положение: HFS
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 14,
            right: 16,
            fontSize: 12,
            color: C.accent,
            fontWeight: "bold",
            fontFamily: CODE,
            textShadow: "1px 1px 2px #000",
          }}
        >
          {huValue !== null ? `Плотность: ${huValue} HU` : ""}
        </div>
      </div>

      {/* Slice Slider */}
      <div
        style={{
          width: isMobile ? "100%" : 512,
          maxWidth: isMobile ? 320 : "100%",
          marginTop: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 11, color: C.textDim, fontFamily: CODE }}>Срез 1</span>
        <input
          type="range"
          min="1"
          max={MAX_SLICES}
          value={sliceIndex}
          onChange={(e) => setSliceIndex(parseInt(e.target.value, 10))}
          style={{
            flex: 1,
            accentColor: C.accent,
            cursor: "pointer",
            height: 6,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 3,
            outline: "none",
          }}
        />
        <span style={{ fontSize: 11, color: C.textDim, fontFamily: CODE }}>Срез {MAX_SLICES}</span>
      </div>
    </div>
  );
}
