import './ui.css';

const DOT_COLORS = {
  neutral: 'var(--text-tertiary)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
  info: 'var(--info)',
};

export default function Badge({ children, variant = 'neutral', dot = false }) {
  return (
    <span className={`badge badge-${variant}`}>
      {dot && <span className="badge-dot" style={{ background: DOT_COLORS[variant] }} />}
      {children}
    </span>
  );
}
