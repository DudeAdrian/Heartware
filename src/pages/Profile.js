import React, { useState } from 'react';
import { GlassCard } from '../theme/GlassmorphismTheme';

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

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleToggle = (ext) => {
    setProfile({
      ...profile,
      extensions: { ...profile.extensions, [ext]: !profile.extensions[ext] },
    });
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
