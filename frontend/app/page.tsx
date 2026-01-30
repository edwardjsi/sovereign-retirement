"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Waiting for backend...');

  useEffect(() => {
    // This fetches the data from your backend running on port 5000
    fetch('http://localhost:5000/')
      .then((res) => res.text()) // Convert the response to text
      .then((data) => setMessage(data)) // Save the text to our variable
      .catch((err) => setMessage("Error connecting to backend: " + err.message));
  }, []);

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>🚀 Sovereign Retirement System</h1>
      <hr />
      <h3>Frontend Status: <span style={{ color: 'green' }}>Online</span></h3>
      <h3>Backend Status: <span style={{ color: 'blue' }}>{message}</span></h3>
    </div>
  );
}