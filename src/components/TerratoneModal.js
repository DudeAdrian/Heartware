import React from 'react';

export default function TerratoneModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '40px',
        borderRadius: '20px',
        border: '1px solid #FF1493',
        maxWidth: '400px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h2 style={{ color: '#FF1493', marginBottom: '20px' }}>Terratone Generator</h2>
        <p style={{ opacity: 0.8, marginBottom: '30px' }}>
          Frequency protocols ready. Manual activation required for neural safety.
        </p>
        <button 
          onClick={onClose}
          style={{
            background: '#FF1493',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '25px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}