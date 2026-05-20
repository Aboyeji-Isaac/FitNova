export const PrimaryButton = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    width: '100%', background: 'var(--accent)', color: '#fff',
    border: 'none', borderRadius: 'var(--radius-lg)', padding: '15px',
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  }}>
    {children}
  </button>
);