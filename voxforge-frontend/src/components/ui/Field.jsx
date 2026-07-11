import './ui.css';

export function Field({ label, hint, error, children, htmlFor }) {
  return (
    <div className="field">
      {label && <label className="field-label" htmlFor={htmlFor}>{label}</label>}
      {children}
      {error ? <span className="field-error">{error}</span> : hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  );
}

export function Input({ icon, ...rest }) {
  if (icon) {
    return (
      <div className="input-wrap">
        <span className="input-wrap-icon">{icon}</span>
        <input className="input" {...rest} />
      </div>
    );
  }
  return <input className="input" {...rest} />;
}

export function Select({ children, ...rest }) {
  return (
    <select className="select" {...rest}>
      {children}
    </select>
  );
}

export function Textarea(props) {
  return <textarea className="textarea" {...props} />;
}

export function Switch({ checked, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
      <span
        className="switch"
        data-on={checked}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(!checked); } }}
      >
        <span className="switch-knob" />
      </span>
      {label && <span style={{ fontSize: 13.5 }}>{label}</span>}
    </label>
  );
}
