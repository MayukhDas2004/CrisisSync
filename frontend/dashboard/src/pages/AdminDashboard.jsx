import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeEmergencies, setActiveEmergencies] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [emergencyList, setEmergencyList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetchDashboardData();

  // Auto refresh every 5 seconds
  const interval = setInterval(() => {
    fetchDashboardData();
  }, 5000);

  // Cleanup interval on unmount
  return () => clearInterval(interval);
}, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch emergencies
      const allRes = await API.get('/emergency/all');
      const allEmergencies = allRes.data || [];

      const active = allEmergencies.filter(e => e.status !== 'resolved');
      const resolved = allEmergencies.filter(e => e.status === 'resolved');

      setActiveEmergencies(active.length);
      setResolvedCount(resolved.length);
      setEmergencyList(allEmergencies);

      // Fetch staff
      const staffRes = await API.get('/staff/all');
      setTotalStaff(staffRes.data.length || 0);
      setStaffList(staffRes.data || []);

    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#dc3545';
      case 'assigned': return '#ffc107';
      case 'pending': return '#17a2b8';
      case 'accepted': return '#28a745';
      case 'on_the_way': return '#fd7e14';
      case 'reached': return '#6f42c1';
      case 'resolved': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'fire': return '🔥';
      case 'medical': return '🏥';
      case 'threat': return '⚠️';
      default: return '🚨';
    }
  };

  const getStaffTypeIcon = (type) => {
    switch(type) {
      case 'fire': return '🔥';
      case 'medical': return '🏥';
      case 'security': return '🛡️';
      default: return '👷';
    }
  };

  const getAvailabilityColor = (isAvailable) => {
    return isAvailable ? '#28a745' : '#dc3545';
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>CrisisSync — Admin Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Summary Cards */}
      <div className="admin-cards">
        <div className="card">
          <h2>{activeEmergencies}</h2>
          <p>Active Emergencies</p>
        </div>
        <div className="card">
          <h2>{totalStaff}</h2>
          <p>Total Staff Available</p>
        </div>
        <div className="card">
          <h2>{resolvedCount}</h2>
          <p>Resolved Issues</p>
        </div>
      </div>

      {/* Refresh Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={fetchDashboardData}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Emergency List Table */}
      <div style={{ marginTop: '30px', padding: '0 20px' }}>
        <h2>📋 All Emergencies</h2>

        {loading ? (
          <p>Loading...</p>
        ) : emergencyList.length === 0 ? (
          <p>No emergencies reported yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr style={{ backgroundColor: '#1a1a2e', color: 'white' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Floor</th>
                <th style={thStyle}>Room</th>
                <th style={thStyle}>Reported By</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Time</th>
              </tr>
            </thead>
            <tbody>
              {emergencyList.map((emergency, index) => (
                <tr
                  key={emergency.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    borderBottom: '1px solid #dee2e6'
                  }}
                >
                  <td style={tdStyle}>#{emergency.id}</td>
                  <td style={tdStyle}>
                    {getTypeIcon(emergency.emergency_type)} {emergency.emergency_type}
                  </td>
                  <td style={tdStyle}>{emergency.location}</td>
                  <td style={tdStyle}>Floor {emergency.floor}</td>
                  <td style={tdStyle}>Room {emergency.room_number}</td>
                  <td style={tdStyle}>{emergency.reported_by}</td>
                  <td style={tdStyle}>
                    <span style={{
                      backgroundColor: getStatusColor(emergency.status),
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {emergency.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {new Date(emergency.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Staff List Table */}
      <div style={{ marginTop: '40px', padding: '0 20px', marginBottom: '40px' }}>
        <h2>👥 Staff Members</h2>

        {loading ? (
          <p>Loading...</p>
        ) : staffList.length === 0 ? (
          <p>No staff members found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr style={{ backgroundColor: '#16213e', color: 'white' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Current Floor</th>
                <th style={thStyle}>Availability</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff, index) => (
                <tr
                  key={staff.staff_id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    borderBottom: '1px solid #dee2e6'
                  }}
                >
                  <td style={tdStyle}>#{staff.staff_id}</td>
                  <td style={tdStyle}>{staff.name}</td>
                  <td style={tdStyle}>{staff.email}</td>
                  <td style={tdStyle}>
                    {getStaffTypeIcon(staff.staff_type)} {staff.staff_type}
                  </td>
                  <td style={tdStyle}>Floor {staff.current_floor}</td>
                  <td style={tdStyle}>
                    <span style={{
                      backgroundColor: getAvailabilityColor(staff.is_available),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {staff.is_available ? '✅ AVAILABLE' : '🔴 BUSY'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const thStyle = {
  padding: '12px 15px',
  textAlign: 'left',
  fontWeight: 'bold'
};

const tdStyle = {
  padding: '10px 15px',
  textAlign: 'left'
};

export default AdminDashboard;