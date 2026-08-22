/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        surface2: "var(--surface-2)",
        surfaceHover: "var(--surface-hover)",
        line: "var(--border)",
        lineStrong: "var(--border-strong)",
        ink: "var(--text)",
        ink2: "var(--text-secondary)",
        ink3: "var(--text-muted)",
        signal: "var(--signal)",
        signalDim: "var(--signal-dim)",
        signalText: "var(--signal-text)",
        pulse: "var(--pulse)",
        pulseDim: "var(--pulse-dim)",
        pulseText: "var(--pulse-text)",
        warn: "var(--warn)",
        warnDim: "var(--warn-dim)",
        danger: "var(--danger)",
        dangerDim: "var(--danger-dim)",
        success: "var(--success)",
        successDim: "var(--success-dim)",
      },
      borderRadius: {
        DEFAULT: "10px",
      },
      boxShadow: {
        card: "var(--shadow)",
      },
    },
  },
  plugins: [],
};
