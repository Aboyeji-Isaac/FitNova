export const ProgressBar = ({ value }) => (
  <div style={{ background: '#222', borderRadius: 4, height: 4 }}>
    <div style={{ width: `${value}%`, height: 4, borderRadius: 4,
      background: 'var(--accent)', transition: 'width 0.4s ease' }} />
  </div>
);