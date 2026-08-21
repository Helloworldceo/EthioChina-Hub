"use client";

import { useEffect, useState } from "react";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    function syncFromDom() {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
    syncFromDom();
  }, []);

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setIsDark(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={className ?? "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
