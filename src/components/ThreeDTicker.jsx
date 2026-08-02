import React, { useEffect, useRef } from 'react';
import { initSpiralEmblem } from 'three-spiral-emblem';

export function Emblem3D({ width = '176px', height = '110px' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const emblem = initSpiralEmblem(containerRef.current, {
      text: '45 am',
      speed: 0.225,
      twistTurns: 3.5,
      colors: ['#1143FE', '#FFFFFF', '#000000', '#01FF71']
    });
    return () => {
      if (emblem && typeof emblem.destroy === 'function') {
        emblem.destroy();
      }
    };
  }, []);

  return (
    <div
      id="medsim-3d-emblem-container"
      ref={containerRef}
      style={{
        width: width,
        height: height,
        borderRadius: 14,
        border: '1.5px solid rgba(13, 21, 39, 0.75)',
        background: '#ffffff',
        overflow: 'hidden',
        position: 'relative'
      }}
    />
  );
}

export default Emblem3D;
