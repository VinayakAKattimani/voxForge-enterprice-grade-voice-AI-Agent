import './ui.css';

export default function Card({ title, subtitle, actions, children, padded = true, className = '', ...rest }) {
  return (
    <div className={`card ${padded ? 'card-padded' : ''} ${className}`} {...rest}>
      {(title || actions) && (
        <div className="card-header">
          <div>
            {title && <div className="card-title">{title}</div>}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
