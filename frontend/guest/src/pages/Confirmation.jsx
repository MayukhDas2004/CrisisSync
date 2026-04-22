import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const room = location.state?.room || 'Unknown';
  const emergency = location.state?.emergency || 'Unknown';

  const getEmergencyIcon = () => {
    if (emergency === 'Fire') return '🔥';
    if (emergency === 'Medical') return '🏥';
    if (emergency === 'Threat') return '⚠️';
    return '🚨';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.checkCircle}>✓</div>
        <h1 style={styles.title}>Help is on the way!</h1>
        <p style={styles.subtitle}>
          Our team has been notified and is responding immediately.
        </p>

        <div style={styles.infoBox}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Room</span>
            <span style={styles.infoValue}>{room}</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Emergency</span>
            <span style={styles.infoValue}>
              {getEmergencyIcon()} {emergency}
            </span>
          </div>
          <div style={styles.divider} />
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Status</span>
            <span style={styles.statusBadge}>🟡 Responding</span>
          </div>
        </div>

        <p style={styles.note}>
          Please stay calm and remain in your room. Staff will arrive shortly.
        </p>

        <button onClick={() => navigate('/')} style={styles.button}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#16213e',
    padding: '40px',
    borderRadius: '16px',
    textAlign: 'center',
    width: '320px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  checkCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: '#28a745',
    color: '#ffffff',
    fontSize: '36px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto 20px auto',
  },
  title: {
    color: '#ffffff',
    fontSize: '24px',
    marginBottom: '12px',
  },
  subtitle: {
    color: '#a0a0b0',
    fontSize: '14px',
    marginBottom: '24px',
  },
  infoBox: {
    backgroundColor: '#0f3460',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '20px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  },
  infoLabel: {
    color: '#a0a0b0',
    fontSize: '14px',
  },
  infoValue: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  divider: {
    height: '1px',
    backgroundColor: '#1a1a2e',
  },
  statusBadge: {
    color: '#ffaa00',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  note: {
    color: '#a0a0b0',
    fontSize: '13px',
    marginBottom: '24px',
    fontStyle: 'italic',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #a0a0b0',
    backgroundColor: 'transparent',
    color: '#a0a0b0',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default Confirmation;