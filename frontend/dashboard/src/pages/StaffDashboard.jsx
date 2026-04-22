import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import '../styles/StaffDashboard.css';

function StaffDashboard() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Off Duty');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetchAssignments();

  // Auto refresh every 5 seconds
  const interval = setInterval(() => {
    fetchAssignments();
  }, 5000);

  return () => clearInterval(interval);
}, []);

  const fetchAssignments = async () => {
    try {
      const response = await API.get('/staff/my-assignments');
      setAssignments(response.data || []);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (assignmentId, newStatus) => {
    try {
      await API.put(`/staff/assignment/${assignmentId}/update`, { 
        status: newStatus 
      });
      alert(`Status updated to: ${newStatus}`);
      fetchAssignments(); // Refresh the list
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="staff-container">
      <div className="staff-header">
        <h1>CrisisSync — Staff Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="staff-status">
        <h3>Your Current Status: {status}</h3>
        <div className="status-buttons">
          <button className="on-duty" onClick={() => setStatus('On Duty')}>
            Go On Duty
          </button>
          <button className="off-duty" onClick={() => setStatus('Off Duty')}>
            Go Off Duty
          </button>
        </div>
      </div>

      <div className="staff-notifications">
        <h3>📍 Active Assignments ({assignments.length})</h3>
        
        {loading ? (
          <p>Loading assignments...</p>
        ) : assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div key={assignment.assignment_id} className="assignment-card">
              <p><strong>🔥 Type:</strong> {assignment.emergency_type}</p>
              <p><strong>📍 Location:</strong> Floor {assignment.floor}, Room {assignment.room_number}</p>
              <p><strong>📌 Status:</strong> {assignment.status}</p>
              <p><strong>🕒 Assigned:</strong> {new Date(assignment.assigned_at).toLocaleTimeString()}</p>

              {/* Action Buttons */}
              <div style={{ marginTop: '12px' }}>
                {assignment.status === 'pending' && (
                  <button 
                    onClick={() => updateStatus(assignment.assignment_id, 'accepted')}
                    style={{ background: '#28a745', color: 'white', marginRight: '8px' }}
                  >
                    Accept Assignment
                  </button>
                )}

                {assignment.status === 'accepted' && (
                  <>
                    <button 
                      onClick={() => updateStatus(assignment.assignment_id, 'on_the_way')}
                      style={{ background: '#ffc107', color: 'black', marginRight: '8px' }}
                    >
                      On The Way
                    </button>
                    <button 
                      onClick={() => updateStatus(assignment.assignment_id, 'reached')}
                      style={{ background: '#007bff', color: 'white' }}
                    >
                      Reached Location
                    </button>
                  </>
                )}

                {assignment.status === 'reached' && (
                  <button 
                    onClick={() => updateStatus(assignment.assignment_id, 'resolved')}
                    style={{ background: '#dc3545', color: 'white' }}
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-notifications">No active assignments right now.</p>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={fetchAssignments} style={{ padding: '10px 20px' }}>
          🔄 Refresh Assignments
        </button>
      </div>
    </div>
  );
}

export default StaffDashboard;