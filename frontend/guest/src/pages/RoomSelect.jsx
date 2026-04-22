import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RoomSelect() {
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (room.trim() === '') {
      alert('Please enter your room number!');
      return;
    }
    navigate('/sos', { state: { room } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏨 CrisisSync</h1>
        <p style={styles.subtitle}>Hotel Emergency Response System</p>
        <p style={styles.label}>Enter Your Room Number</p>
        <input
          type="number"
          placeholder="e.g. 101"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSubmit} style={styles.button}>
          Continue →
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
  subtitle: {
    color: '#a0a0b0',
    fontSize: '14px',
    marginBottom: '32px',
  },
  label: {
    color: '#ffffff',
    fontSize: '16px',
    marginBottom: '12px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #0f3460',
    backgroundColor: '#0f3460',
    color: '#ffffff',
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '20px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#e94560',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default RoomSelect;