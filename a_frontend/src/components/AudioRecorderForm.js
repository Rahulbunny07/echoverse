// src/components/AudioRecorderForm.js
import React, { useState, useRef } from 'react';
import api from '../services/api';
import './AudioRecorderForm.css';
import { useNavigate } from 'react-router-dom';

const AudioRecorderForm = () => {
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState('😊');
  const [unlockAt, setUnlockAt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [blob, setBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioURL = URL.createObjectURL(audioBlob);
      setBlob(audioBlob);
      setAudioURL(audioURL);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!blob) return alert('Please record audio first.');

  const formData = new FormData();
  formData.append('title', title);
  formData.append('mood', mood);
  formData.append('unlockAt', unlockAt);
  formData.append('audio', blob);

  try {
    const token = localStorage.getItem('token');
    await api.post('/entries', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('Audio uploaded and saved!');
    navigate('/dashboard'); // 🔁 Redirect after success

  } catch (err) {
    console.error(err);
    alert('Failed to save audio entry.');
  }
};

  return (
    <div className="recorder-container">
      <h2 className="form-title">🎙️ EchoVerse - New Diary</h2>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input" required />
        <select value={mood} onChange={(e) => setMood(e.target.value)} className="input">
          <option value="😊">😊 Happy</option>
          <option value="😢">😢 Sad</option>
          <option value="😌">😌 Calm</option>
        </select>
        <input type="datetime-local" value={unlockAt} onChange={(e) => setUnlockAt(e.target.value)} className="input" required />

        {isRecording ? (
          <button type="button" onClick={stopRecording} className="btn stop">⏹️ Stop Recording</button>
        ) : (
          <button type="button" onClick={startRecording} className="btn record">🔴 Start Recording</button>
        )}

        {audioURL && <audio controls src={audioURL} className="audio-player" />}

        <button type="submit" className="btn submit">💾 Save Entry</button>
      </form>
    </div>
  );
};

export default AudioRecorderForm;