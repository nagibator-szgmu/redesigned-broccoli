import { useState, useEffect } from "react";

/**
 * Hook to manage global Command Palette shortcut (⌘K / Ctrl+K).
 * @returns {{ isOpen: boolean, setIsOpen: (val: boolean) => void, togglePalette: () => void }}
 */
export default function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    isOpen,
    setIsOpen,
    togglePalette: () => setIsOpen(v => !v),
  };
}
