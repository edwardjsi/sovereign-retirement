'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [backendStatus, setBackendStatus] = useState('Checking...');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setBackendStatus('✅ Online'))
      .catch(() => setBackendStatus('❌ Offline'));
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
          🚀 Sovereign Retirement
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
          Plan Your Financial Freedom
        </p>
        <p style={{ opacity: 0.8, marginBottom: '40px' }}>
          Backend Status: {backendStatus}
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link href="/register" style={{
            padding: '15px 40px',
            background: 'white',
            color: '#667eea',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            Register
          </Link>
          
          <Link href="/login" style={{
            padding: '15px 40px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            border: '2px solid white'
          }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
