import { useState, useEffect } from "react";

/**
 * Хук определения типа устройства и диапазона экрана:
 * - isPhone: < 600px (смартфон, одноколоночный вид, нижний док)
 * - isTablet: 600px - 1024px (планшет, 2 колонки в портрете/ландшафте)
 * - isDesktop: > 1024px (полноразмерная десктопная станция)
 */
export default function useDeviceLayout() {
  const [layout, setLayout] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    return {
      isPhone: w < 600,
      isTablet: w >= 600 && w <= 1024,
      isDesktop: w > 1024,
      width: w,
    };
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setLayout({
        isPhone: w < 600,
        isTablet: w >= 600 && w <= 1024,
        isDesktop: w > 1024,
        width: w,
      });
    };

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return layout;
}
