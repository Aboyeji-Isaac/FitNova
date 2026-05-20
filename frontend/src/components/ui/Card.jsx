export const Card = ({ children, className = '', accent = false }) => (
  <div style={{
    background: 'var(--bg-surface)',
    border: accent ? 'var(--border-accent)' : 'var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: '14px',
  }} className={className}>
    {children}
  </div>
);