import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Home = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const res = await api.get('/entries');
      setEntries(res.data);
    };
    fetchEntries();
  }, []);

  return (
    <div>
      <h2>Your EchoVerse Timeline</h2>
      {entries.map(entry => (
        <div key={entry._id}>
          <p>{entry.title} - {entry.mood}</p>
          <p>{new Date(entry.unlockAt) > new Date() ? "🔒 Locked" : "🔓 Unlocked"}</p>
          {new Date(entry.unlockAt) <= new Date() && (
            <audio controls src={entry.audioURL}></audio>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;
