import { useEffect, useRef } from 'react';
import './voice.css';

const BAR_COUNT = 48;

/**
 * Renders a live-updating bar waveform.
 * - When `analyser` (a Web Audio AnalyserNode) is provided, it reads real
 *   microphone amplitude.
 * - Otherwise it falls back to a gentle simulated idle/talking animation,
 *   driven by `active` and `speaking` flags.
 */
export default function Waveform({ analyser, active = false, speaking = false, tone = 'accent' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const phaseRef = useRef(0);
  const dataRef = useRef(new Uint8Array(128));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height, dpr;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const barColor = getComputedStyle(document.documentElement).getPropertyValue(
      tone === 'accent' ? '--accent-500' : '--text-secondary'
    ).trim() || '#5457e5';

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const gap = 3;
      const barWidth = Math.max(2, (width - gap * (BAR_COUNT - 1)) / BAR_COUNT);
      phaseRef.current += 0.09;

      let amplitudes = [];
      if (analyser) {
        analyser.getByteFrequencyData(dataRef.current);
        const step = Math.floor(dataRef.current.length / BAR_COUNT);
        for (let i = 0; i < BAR_COUNT; i++) {
          amplitudes.push(dataRef.current[i * step] / 255);
        }
      } else {
        for (let i = 0; i < BAR_COUNT; i++) {
          const base = active ? (speaking ? 0.55 : 0.28) : 0.06;
          const wobble = active ? Math.sin(phaseRef.current + i * 0.45) * (speaking ? 0.4 : 0.18) : Math.sin(phaseRef.current * 0.6 + i * 0.3) * 0.03;
          amplitudes.push(Math.max(0.04, base + wobble + Math.random() * (active ? 0.08 : 0.01)));
        }
      }

      amplitudes.forEach((amp, i) => {
        const barHeight = Math.max(2, amp * height);
        const x = i * (barWidth + gap);
        const y = (height - barHeight) / 2;
        ctx.fillStyle = barColor;
        ctx.globalAlpha = active || analyser ? 1 : 0.5;
        const r = Math.min(barWidth / 2, 3);
        roundRect(ctx, x, y, barWidth, barHeight, r);
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [analyser, active, speaking, tone]);

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  return <canvas ref={canvasRef} className="waveform-canvas" />;
}
