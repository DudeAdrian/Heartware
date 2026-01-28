import React, { useState } from 'react';
import { sendSofiePrompt } from '../services/SofieLlamaService';
import { GlassCard } from '../theme/GlassmorphismTheme';
import { sofieLibraries } from '../services/SofieLibraryList';

const defaultProfile = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  avatar: '',
  theme: 'system',
  extensions: {
    holistic: true,
    metrics: true,
    mindfulness: true,
    nutrition: true,
    movement: true,
    medications: true,
    careTeam: true,
    selfCare: true,
    biofeedback: true,
    records: true,
    emergency: true,
  },
};

const Profile = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [sofieInput, setSofieInput] = useState('');
  const [sofieResponse, setSofieResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState(sofieLibraries[0]?.key || 'frequencies');

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleToggle = (ext) => {
    setProfile({
      ...profile,
      extensions: { ...profile.extensions, [ext]: !profile.extensions[ext] },
    });
  };

  const handleSofieSend = async () => {
    setLoading(true);
    setError('');
    setSofieResponse('');
    try {
      const result = await sendSofiePrompt(sofieInput, {
        user: profile,
        library: selectedLibrary,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setSofieResponse(result.choices ? result.choices[0]?.message?.content : JSON.stringify(result));
      }
    } catch (err) {
      setError('Failed to connect to SOFIE.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <GlassCard className="mb-6">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            className="w-full rounded p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            className="w-full rounded p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Theme</label>
          <select
            className="w-full rounded p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            name="theme"
            value={profile.theme}
            onChange={handleChange}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </GlassCard>
      {/* SOFIE LLaMA Chat UI */}
      <GlassCard className="mb-6">
        <h2 className="text-lg font-semibold mb-2">SOFIE AI Companion</h2>
        <div className="mb-2">
          <textarea
            className="w-full p-2 border rounded"
            rows={3}
            value={sofieInput}
            onChange={e => setSofieInput(e.target.value)}
            placeholder="Ask SOFIE anything..."
          />
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleSofieSend}
          disabled={loading || !sofieInput.trim()}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
        {sofieResponse && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <strong>SOFIE:</strong> {sofieResponse}
          </div>
        )}
        {error && (
          <div className="mt-2 text-red-600">{error}</div>
        )}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Select Knowledge Library</label>
          <select
            className="w-full p-2 border rounded mb-2"
            value={selectedLibrary}
            onChange={e => setSelectedLibrary(e.target.value)}
          >
            {sofieLibraries.map(lib => (
              <option key={lib.key} value={lib.key}>{lib.label}</option>
            ))}
          </select>
          <small className="text-xs text-gray-500">
            {sofieLibraries.find(lib => lib.key === selectedLibrary)?.description}
          </small>
        </div>
      </GlassCard>
      <GlassCard>
        <h3 className="text-xl font-bold mb-2">Extensions</h3>
        <ul className="space-y-2">
          {Object.entries(profile.extensions).map(([ext, enabled]) => (
            <li key={ext} className="flex items-center justify-between">
              <span className="capitalize">{ext.replace(/([A-Z])/g, ' $1')}</span>
              <button
                className={`px-3 py-1 rounded font-semibold ${enabled ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
                onClick={() => handleToggle(ext)}
              >
                {enabled ? 'Enabled' : 'Disabled'}
              </button>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
};

export default Profile;
