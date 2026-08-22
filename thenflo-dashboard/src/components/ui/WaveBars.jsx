import React from "react";

const TONE_VAR = { signal: "var(--signal)", pulse: "var(--pulse)", success: "var(--success)" };

export default function WaveBars({ active = true, tone = "signal", size = 16 }) {
  const bars = [0.5, 1, 0.7, 0.9, 0.4];
  return (
    <span className="inline-flex items-center gap-[2px]" style={{ height: size }}>
      {bars.map((h, i) => (
        <span
          key={i}
          className={active ? "wave-bar" : ""}
          style={{
            width: 2.5,
            height: size * h,
            borderRadius: 2,
            background: TONE_VAR[tone],
            animationDelay: `${i * 120}ms`,
            transform: active ? undefined : `scaleY(${h})`,
          }}
        />
      ))}
    </span>
  );
}
