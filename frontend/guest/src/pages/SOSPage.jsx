import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function SOSPage() {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const room = location.state?.room || 'Unknown';

  const emergencies = [
    { type: 'Fire', icon: '🔥', color: '#ff4444' },
    { type: 'Medical', icon: '🏥', color: '#44aaff' },
    { type: 'Threat', icon: '⚠️', color: '#ffaa00' },
  ];

  const handleSubmit = async () => {
    if (selected === '') {
      alert('Please select an emergency type!');
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://127.0.0.1:8000/emergency/report', {
        emergency_type: selected.toLowerCase(),
        location: `Room ${room}`,
        floor: Math.floor(parseInt(room) / 100),
        room_number: room,
        reported_by: 'guest',
      });

      navigate('/confirmation', { state: { room, emergency: selected } });

    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚨 SOS Alert</h1>
        <p style={styles.roomText}>Room: {room}</p>
        <p style={styles.label}>Select Emergency Type</p>

        <div style={styles.emergencyGrid}>
          {emergencies.map((e) => (
            <div
              key={e.type}
              onClick={() => setSelected(e.type)}
              style={{
                ...styles.emergencyCard,
                border: selected === e.type
                  ? `3px solid ${e.color}`
                  : '3px solid transparent',
                backgroundColor: selected === e.type
                  ? `${e.color}22`
                  : '#0f3460',
              }}
            >
              <span style={styles.emergencyIcon}>{e.icon}</span>
              <span style={styles.emergencyText}>{e.type}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            ...styles.sosButton,
            backgroundColor: loading ? '#888' : '#e94560',
          }}
        >
          {loading ? '⏳ Sending...' : '🚨 SEND SOS'}
        </button>

        <button onClick={() => navigate('/')} style={styles.backButton}>
          ← Back
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
  title: {
    color: '#ffffff',
    fontSize: '28px',
    marginBottom: '8px',
  },
  roomText: {
    color: '#e94560',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '24px',
  },
  label: {
    color: '#ffffff',
    fontSize: '16px',
    marginBottom: '16px',
  },
  emergencyGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  emergencyCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emergencyIcon: {
    fontSize: '28px',
    marginRight: '16px',
  },
  emergencyText: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  sosButton: {
    width: '100%',
    padding: '16px',
    borderRadius: '8px',
    border: 'none',
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  backButton: {
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

export default SOSPage;