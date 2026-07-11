import './ui.css';

export default function StatCard({ label, value, icon, delta, deltaDirection = 'up', suffix }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        {icon && <span className="stat-card-icon">{icon}</span>}
      </div>
      <div className="stat-card-value">
        {value}
        {suffix && <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-tertiary)', marginLeft: 4 }}>{suffix}</span>}
      </div>
      {delta && (
        <span className={`stat-card-delta ${deltaDirection}`}>
          {deltaDirection === 'up' ? '▲' : '▼'} {delta}
        </span>
      )}
    </div>
  );
}
