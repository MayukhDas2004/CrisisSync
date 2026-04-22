import React, { useState } from 'react';
import '../styles/GuestSOS.css';

function GuestSOS() {
  const [floor, setFloor] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [emergencyType, setEmergencyType] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/emergency/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emergency_type: emergencyType,
          location: `Room ${roomNumber}`,
          floor: parseInt(floor),
          room_number: roomNumber,
          reported_by: 'guest'
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (submitted) {
    return (
      <div className="sos-container">
        <div className="sos-success">
          <div className="success-icon">✅</div>
          <h1>Help is on the Way!</h1>
          <p>Emergency services have been notified.</p>
          <p>Please stay calm and wait for assistance.</p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setFloor('');
              setRoomNumber('');
              setEmergencyType('');
            }}
            className="sos-reset-btn"
          >
            Report Another Emergency
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sos-container">
      <div className="sos-box">
        {/* Header */}
        <div className="sos-header">
          <h1>🚨 Emergency SOS</h1>
          <p>Press the button below to alert hotel staff immediately</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="sos-form">

          {/* Floor Number */}
          <div className="form-group">
            <label>🏢 Floor Number</label>
            <select
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              required
            >
              <option value="">Select Floor</option>
              {[1,2,3,4,5,6,7,8,9,10].map(f => (
                <option key={f} value={f}>Floor {f}</option>
              ))}
            </select>
          </div>

          {/* Room Number */}
          <div className="form-group">
            <label>🚪 Room Number</label>
            <input
              type="text"
              placeholder="Enter your room number (e.g. 101)"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              required
            />
          </div>

          {/* Emergency Type */}
          <div className="form-group">
            <label>⚠️ Type of Emergency</label>
            <div className="emergency-buttons">
              <button
                type="button"
                className={`emergency-type-btn fire ${emergencyType === 'fire' ? 'selected' : ''}`}
                onClick={() => setEmergencyType('fire')}
              >
                🔥 Fire
              </button>
              <button
                type="button"
                className={`emergency-type-btn medical ${emergencyType === 'medical' ? 'selected' : ''}`}
                onClick={() => setEmergencyType('medical')}
              >
                🏥 Medical
              </button>
              <button
                type="button"
                className={`emergency-type-btn threat ${emergencyType === 'threat' ? 'selected' : ''}`}
                onClick={() => setEmergencyType('threat')}
              >
                ⚠️ Threat
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="sos-submit-btn"
            disabled={!floor || !roomNumber || !emergencyType || loading}
          >
            {loading ? '⏳ Sending Alert...' : '🚨 SEND SOS ALERT'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default GuestSOS;