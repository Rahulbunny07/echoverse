import React, { useState } from 'react';
import api from '../services/api';

const CreateEntry = () => {
  const [form, setForm] = useState({
    title: '',
    mood: '',
    unlockAt: '',
    audioURL: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/entries', form);
      alert("Entry saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving entry");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Title" value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <select value={form.mood}
        onChange={(e) => setForm({ ...form, mood: e.target.value })}>
        <option value="">Select Mood</option>
        <option value="😊">😊 Happy</option>
        <option value="😢">😢 Sad</option>
        <option value="🤔">🤔 Thoughtful</option>
      </select>
      <input type="datetime-local" value={form.unlockAt}
        onChange={(e) => setForm({ ...form, unlockAt: e.target.value })} />
      <input type="text" placeholder="Audio URL"
        value={form.audioURL}
        onChange={(e) => setForm({ ...form, audioURL: e.target.value })} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CreateEntry;
