// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await api.get('/entries');
        console.log('Fetched Entries:', res.data); // Debug log
        setEntries(res.data);
      } catch (err) {
        console.error('Failed to fetch entries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">🎧 Your EchoVerse Timeline</h2>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>

      {loading ? (
        <p className="loading">Loading entries...</p>
      ) : entries.length === 0 ? (
        <p className="no-entries">No entries to display</p>
      ) : (
        <div className="entry-list">
          {entries.map((entry) => (
            <div key={entry._id} className="entry-card">
              <h4>{entry.title}</h4>
              <p>Mood: {entry.mood}</p>
              <p>Created: {new Date(entry.createdAt).toLocaleString()}</p>
              <p>Unlocks At: {new Date(entry.unlockAt).toLocaleString()}</p>
              {entry.isLocked ? (
                <p className="locked">🔒 Locked</p>
              ) : entry.audioURL ? (
                <audio controls src={entry.audioURL} className="audio-player">
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <p className="missing">⚠️ No audio available</p>
              )}
            </div>
          ))}
        </div>
      )}

      <button className="add-entry-btn" onClick={() => navigate('/entry/new')}>
        ➕ Add New Entry
      </button>
    </div>
  );
};

export default Dashboard;
