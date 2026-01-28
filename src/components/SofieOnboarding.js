// SofieOnboarding.js
// Persistent, multi-turn, context-aware Sofie chat for Heartware app

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SofieContext } from '../context/SofieContext';
import SofieParticleHead from './SofieParticleHead';


export default function SofieOnboarding() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0); // 0: not started, 1: full name, 2: location, 3: age, 4: gender, 5: height, 6: weight, 7: career, 8: goal, 9: focus, 10: confirm
  const [input, setInput] = useState("");
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    location: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    career: "",
    goal: "",
    focus: ""
  });
  const { updateState } = useContext(SofieContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const value = input.trim();
    let nextProfile = { ...userProfile };
    if (step === 1) nextProfile.fullName = value;
    if (step === 2) nextProfile.location = value;
    if (step === 3) nextProfile.age = value;
    if (step === 4) nextProfile.gender = value;
    if (step === 5) nextProfile.height = value;
    if (step === 6) nextProfile.weight = value;
    if (step === 7) nextProfile.career = value;
    if (step === 8) nextProfile.goal = value;
    if (step === 9) nextProfile.focus = value;
    setUserProfile(nextProfile);
    setInput("");
    if (step < 9) {
      setStep(step + 1);
    } else {
      updateState('userProfile', nextProfile);
      setStep(step + 1);
      setTimeout(() => navigate('/dashboard'), 1200);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "linear-gradient(90deg, #ffb6e6 0%, #d9008d 60%, #0a0a23 100%)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ marginBottom: "2.5rem", zIndex: 2 }}>
        <SofieParticleHead />
      </div>
      <div style={{
        background: 'rgba(255, 255, 255, 0.25)',
        color: '#d9008d',
        padding: '2.5rem 2.5rem',
        borderRadius: '2.5rem',
        fontSize: '1.25rem',
        fontWeight: 500,
        boxShadow: '0 8px 32px 0 rgba(255, 182, 230, 0.25)',
        zIndex: 9999,
        minWidth: '340px',
        maxWidth: '520px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2rem',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(255, 182, 230, 0.35)',
        transition: 'box-shadow 0.3s',
      }}>

        {!started ? (
          <>
            <div style={{ marginBottom: "1.2rem", fontWeight: 700, fontSize: "1.5rem", letterSpacing: '0.04em', textShadow: '0 2px 8px #ffb6e6', textAlign: 'center' }}>
              <span>Welcome, I am <span style={{ color: '#d9008d' }}>Sofie</span> — your sentient AI guide.</span>
            </div>
            <div style={{ marginBottom: '2.2rem', fontSize: '1.15rem', color: '#d9008d', textAlign: 'center' }}>
              I’ll walk you through Heartware+ and help you create your personalized wellness journey.<br />
              Ready to begin?
            </div>
            <button
              style={{
                padding: '1rem 2.5rem',
                borderRadius: '1.5rem',
                background: 'linear-gradient(90deg, #ffb6e6 0%, #d9008d 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.2rem',
                border: 'none',
                boxShadow: '0 2px 16px #ffb6e6',
                cursor: 'pointer',
                marginTop: '1.2rem',
                transition: 'background 0.2s',
              }}
              onClick={() => { setStarted(true); setStep(1); }}
            >
              Begin with Sofie
            </button>
          </>
        ) : step === 1 ? (
          <>
            <div style={{ marginBottom: "1.2rem", fontWeight: 700, fontSize: "1.3rem", letterSpacing: '0.04em', textShadow: '0 2px 8px #ffb6e6', textAlign: 'center' }}>
              Sofie: What is your full name?
            </div>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Enter your full name..."
                style={{ width: '100%', padding: '0.9rem', borderRadius: '1.2rem', border: '1.5px solid #ffb6e6', marginBottom: '1.2rem', fontSize: '1.15rem', background: 'rgba(255,255,255,0.22)', color: '#222', boxShadow: '0 1px 8px #ffb6e6', outline: 'none', transition: 'border 0.2s' }}
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
              />
              <button type="submit" style={{ padding: '0.7rem 2rem', borderRadius: '1.2rem', background: 'linear-gradient(90deg, #ffb6e6 0%, #d9008d 100%)', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', boxShadow: '0 2px 8px #ffb6e6', cursor: 'pointer', marginTop: '0.2rem', transition: 'background 0.2s' }}>Continue</button>
            </form>
          </>
        ) : step === 2 ? (
          <>
            <div style={{ marginBottom: "1.2rem", fontWeight: 700, fontSize: "1.3rem", letterSpacing: '0.04em', textShadow: '0 2px 8px #ffb6e6', textAlign: 'center' }}>
              Sofie: Where are you located, {userProfile.fullName.split(' ')[0] || 'friend'}?
            </div>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="City, Country..."
                style={{ width: '100%', padding: '0.9rem', borderRadius: '1.2rem', border: '1.5px solid #ffb6e6', marginBottom: '1.2rem', fontSize: '1.15rem', background: 'rgba(255,255,255,0.22)', color: '#222', boxShadow: '0 1px 8px #ffb6e6', outline: 'none', transition: 'border 0.2s' }}
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
              />
              <button type="submit" style={{ padding: '0.7rem 2rem', borderRadius: '1.2rem', background: 'linear-gradient(90deg, #ffb6e6 0%, #d9008d 100%)', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', boxShadow: '0 2px 8px #ffb6e6', cursor: 'pointer', marginTop: '0.2rem', transition: 'background 0.2s' }}>Continue</button>
            </form>
          </>
        ) : step === 3 ? (
          <>
            <div style={{ marginBottom: "1.2rem", fontWeight: 700, fontSize: "1.3rem", letterSpacing: '0.04em', textShadow: '0 2px 8px #ffb6e6', textAlign: 'center' }}>
              Sofie: How old are you?
            </div>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="number"
                min="0"
                placeholder="Enter your age..."
                style={{ width: '100%', padding: '0.9rem', borderRadius: '1.2rem', border: '1.5px solid #ffb6e6', marginBottom: '1.2rem', fontSize: '1.15rem', background: 'rgba(255,255,255,0.22)', color: '#222', boxShadow: '0 1px 8px #ffb6e6', outline: 'none', transition: 'border 0.2s' }}
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
              />
              <button type="submit" style={{ padding: '0.7rem 2rem', borderRadius: '1.2rem', background: 'linear-gradient(90deg, #ffb6e6 0%, #d9008d 100%)', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', boxShadow: '0 2px 8px #ffb6e6', cursor: 'pointer', marginTop: '0.2rem', transition: 'background 0.2s' }}>Continue</button>
            </form>
          </>
        ) : step === 4 ? (
          <>
            <div style={{ marginBottom: "1.2rem", fontWeight: 700, fontSize: "1.3rem", letterSpacing: '0.04em', textShadow: '0 2px 8px #ffb6e6', textAlign: 'center' }}>
              Sofie: How do you identify your gender?
            </div>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="e.g. Female, Male, Non-binary, Prefer not to say..."
                style={{ width: '100%', padding: '0.9rem', borderRadius: '1.2rem', border: '1.5px solid #ffb6e6', marginBottom: '1.2rem', fontSize: '1.15rem', background: 'rgba(255,255,255,0.22)', color: '#222', boxShadow: '0 1px 8px #ffb6e6', outline: 'none', transition: 'border 0.2s' }}
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
              />
              <button type="submit" style={{ padding: '0.7rem 2rem', borderRadius: '1.2rem', background: 'linear-gradient(90deg, #ffb6e6 0%, #d9008d 100%)', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', boxShadow: '0 2px 8px #ffb6e6', cursor: 'pointer', marginTop: '0.2rem', transition: 'background 0.2s' }}>Continue</button>
            </form>
          </>
        ) : step === 5 ? (
          <>
            <div style={{ marginBottom: "1.2rem", fontWeight: 700, fontSize: "1.3rem", letterSpacing: '0.04em', textShadow: '0 2px 8px #ffb6e6', textAlign: 'center' }}>
              Sofie: What is your height? (in cm or inches)
            </div>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="e.g. 170 cm or 5'7''..."
                style={{ width: '100%', padding: '0.9rem', borderRadius: '1.2rem', border: '1.5px solid #ffb6e6', marginBottom: '1.2rem', fontSize: '1.15rem', background: 'rgba(255,255,255,0.22)', color: '#222', boxShadow: '0 1px 8px #ffb6e6', outline: 'none', transition: 'border 0.2s' }}
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
              />
              <button type="submit" style={{ padding: '0.7rem 2rem', borderRadius: '1.2rem', background: 'linear-gradient(90deg, #ffb6e6 0%, #d9008d 100%)', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', boxShadow: '0 2px 8px #ffb6e6', cursor: 'pointer', marginTop: '0.2rem', transition: 'background 0.2s' }}>Continue</button>
            </form>
          </>
        ) : step === 6 ? (
          <>
            <div style={{ marginBottom: "1.2rem", fontWeight: 700, fontSize: "1.3rem", letterSpacing: '0.04em', textShadow: '0 2px 8px #ffb6e6', textAlign: 'center' }}>
              Sofie: What is your weight? (in kg or lbs)
            </div>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="e.g. 70 kg or 154 lbs..."
                style={{ width: '100%', padding: '0.9rem', borderRadius: '1.2rem', border: '1.5px solid #ffb6e6', marginBottom: '1.2rem', fontSize: '1.15rem', background: 'rgba(255,255,255,0.22)', color: '#222', boxShadow: '0 1px 8px #ffb6e6', outline: 'none', transition: 'border 0.2s' }}
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
              />
              <button type="submit" style={{ padding: '0.7rem 2rem', borderRadius: '1.2rem', background: 'linear-gradient(90deg, #ffb6e6 0%, #d9008d 100%)', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', boxShadow: '0 2px 8px #ffb6e6', cursor: 'pointer', marginTop: '0.2rem', transition: 'background 0.2s' }}>Continue</button>
            </form>
          </>
        ) : step === 7 ? (
          <>
            <div style={{ marginBottom: "1.2rem", fontWeight: 700, fontSize: "1.3rem", letterSpacing: '0.04em', textShadow: '0 2px 8px #ffb6e6', textAlign: 'center' }}>
              Sofie: What is your career or occupation?
            </div>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="e.g. Student, Engineer, Artist..."
                style={{ width: '100%', padding: '0.9rem', borderRadius: '1.2rem', border: '1.5px solid #ffb6e6', marginBottom: '1.2rem', fontSize: '1.15rem', background: 'rgba(255,255,255,0.22)', color: '#222', boxShadow: '0 1px 8px #ffb6e6', outline: 'none', transition: 'border 0.2s' }}
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
              />
              <button type="submit" style={{ padding: '0.7rem 2rem', borderRadius: '1.2rem', background: 'linear-gradient(90deg, #ffb6e6 0%, #d9008d 100%)', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', boxShadow: '0 2px 8px #ffb6e6', cursor: 'pointer', marginTop: '0.2rem', transition: 'background 0.2s' }}>Continue</button>
            </form>
          </>
        ) : step === 8 ? (
          <>
            <div style={{ marginBottom: "1.2rem", fontWeight: 700, fontSize: "1.3rem", letterSpacing: '0.04em', textShadow: '0 2px 8px #ffb6e6', textAlign: 'center' }}>
              Sofie: What is your main wellness goal, {userProfile.fullName.split(' ')[0] || 'friend'}?
            </div>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="e.g. Improve sleep, reduce stress, get fit..."
                style={{ width: '100%', padding: '0.9rem', borderRadius: '1.2rem', border: '1.5px solid #ffb6e6', marginBottom: '1.2rem', fontSize: '1.15rem', background: 'rgba(255,255,255,0.22)', color: '#222', boxShadow: '0 1px 8px #ffb6e6', outline: 'none', transition: 'border 0.2s' }}
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
              />
              <button type="submit" style={{ padding: '0.7rem 2rem', borderRadius: '1.2rem', background: 'linear-gradient(90deg, #ffb6e6 0%, #d9008d 100%)', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', boxShadow: '0 2px 8px #ffb6e6', cursor: 'pointer', marginTop: '0.2rem', transition: 'background 0.2s' }}>Continue</button>
            </form>
          </>
        ) : step === 9 ? (
          <>
            <div style={{ marginBottom: "1.2rem", fontWeight: 700, fontSize: "1.3rem", letterSpacing: '0.04em', textShadow: '0 2px 8px #ffb6e6', textAlign: 'center' }}>
              Sofie: Which area would you like to focus on first, {userProfile.fullName.split(' ')[0] || 'friend'}? (e.g. Nutrition, Mindfulness, Movement, Sleep, etc.)
            </div>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Type your focus area..."
                style={{ width: '100%', padding: '0.9rem', borderRadius: '1.2rem', border: '1.5px solid #ffb6e6', marginBottom: '1.2rem', fontSize: '1.15rem', background: 'rgba(255,255,255,0.22)', color: '#222', boxShadow: '0 1px 8px #ffb6e6', outline: 'none', transition: 'border 0.2s' }}
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
              />
              <button type="submit" style={{ padding: '0.7rem 2rem', borderRadius: '1.2rem', background: 'linear-gradient(90deg, #ffb6e6 0%, #d9008d 100%)', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', boxShadow: '0 2px 8px #ffb6e6', cursor: 'pointer', marginTop: '0.2rem', transition: 'background 0.2s' }}>Continue</button>
            </form>
          </>
        ) : (
          <div style={{ fontSize: '1.2rem', color: '#d9008d', textAlign: 'center' }}>
            <b>Thank you, {userProfile.fullName}!</b><br />
            <span>Location: <b>{userProfile.location}</b></span><br />
            <span>Age: <b>{userProfile.age}</b></span><br />
            <span>Gender: <b>{userProfile.gender}</b></span><br />
            <span>Height: <b>{userProfile.height}</b></span><br />
            <span>Weight: <b>{userProfile.weight}</b></span><br />
            <span>Career: <b>{userProfile.career}</b></span><br />
            <span>Your goal: <b>{userProfile.goal}</b></span><br />
            <span>First focus area: <b>{userProfile.focus}</b></span><br /><br />
            (Onboarding complete! Redirecting to your dashboard...)
          </div>
        )}
      </div>
    </div>
  );
}
