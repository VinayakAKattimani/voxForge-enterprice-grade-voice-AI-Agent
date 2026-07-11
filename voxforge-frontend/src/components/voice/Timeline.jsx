import './timeline.css';

export default function Timeline({ events }) {
  if (!events.length) {
    return <p style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>Timeline events will appear here as the conversation progresses.</p>;
  }
  return (
    <ol className="timeline">
      {events.map((e, i) => (
        <li key={i} className={`timeline-item timeline-${e.type}`}>
          <span className="timeline-dot" />
          <div className="timeline-content">
            <span className="timeline-label">{e.label}</span>
            <span className="timeline-ts">{e.ts}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
