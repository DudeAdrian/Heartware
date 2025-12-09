import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../theme/GlassmorphismTheme';
import aiCompanion from '../services/AICompanionService';

const PersonalHerbalJournal = () => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    herbName: '',
    herbId: '',
    dateUsed: new Date().toISOString().split('T')[0],
    preparationUsed: 'tea',
    dosage: '',
    purposeOfUse: '',
    immediateEffects: '',
    longerTermEffects: '',
    effectiveness: 5,
    sideEffects: '',
    personalNotes: '',
    wouldUseAgain: true
  });
  const [loading, setLoading] = useState(false);
  const journalEndRef = useRef(null);

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    try {
      setLoading(true);
      // Future: fetch from /api/herbal-journal/:userId
      // For now, load from localStorage
      const stored = localStorage.getItem('herbal-journal') || '[]';
      setEntries(JSON.parse(stored));
    } catch (error) {
      console.error('Error loading journal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.herbName.trim()) return;

    try {
      setLoading(true);
      const newEntry = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      };

      // Future: POST to /api/herbal-journal
      // For now, store locally
      const updated = [...entries, newEntry];
      setEntries(updated);
      localStorage.setItem('herbal-journal', JSON.stringify(updated));

      // Log with AI companion
      await aiCompanion.sendMessage(
        `I'm tracking my herbal use: ${formData.herbName} used as ${formData.preparationUsed} for ${formData.purposeOfUse}. Effectiveness: ${formData.effectiveness}/10. ${formData.personalNotes}`
      );

      setFormData({
        herbName: '',
        herbId: '',
        dateUsed: new Date().toISOString().split('T')[0],
        preparationUsed: 'tea',
        dosage: '',
        purposeOfUse: '',
        immediateEffects: '',
        longerTermEffects: '',
        effectiveness: 5,
        sideEffects: '',
        personalNotes: '',
        wouldUseAgain: true
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('herbal-journal', JSON.stringify(updated));
  };

  const getEffectivenessColor = (score) => {
    if (score >= 8) return 'bg-green-500/20 border-green-500/30 text-green-700 dark:text-green-300';
    if (score >= 6) return 'bg-blue-500/20 border-blue-500/30 text-blue-700 dark:text-blue-300';
    if (score >= 4) return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-700 dark:text-yellow-300';
    return 'bg-orange-500/20 border-orange-500/30 text-orange-700 dark:text-orange-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            🌿 Personal Herbal Journal
          </h1>
          <p className="text-gray-300">
            Track your herbal practices, effects, and healing journey with ancient wisdom integration
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <GlassCard className="p-4 text-center">
            <div className="text-sm text-gray-400 mb-1">Total Entries</div>
            <div className="text-3xl font-bold text-green-400">{entries.length}</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-sm text-gray-400 mb-1">Avg Effectiveness</div>
            <div className="text-3xl font-bold text-emerald-400">
              {entries.length > 0 ? (entries.reduce((sum, e) => sum + e.effectiveness, 0) / entries.length).toFixed(1) : '—'}
            </div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-sm text-gray-400 mb-1">Would Use Again</div>
            <div className="text-3xl font-bold text-cyan-400">
              {entries.filter(e => e.wouldUseAgain).length}/{entries.length}
            </div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-sm text-gray-400 mb-1">Unique Herbs</div>
            <div className="text-3xl font-bold text-blue-400">
              {new Set(entries.map(e => e.herbName)).size}
            </div>
          </GlassCard>
        </div>

        {/* Add Entry Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-all"
          >
            {showForm ? '✕ Close Entry Form' : '+ New Journal Entry'}
          </button>
        </div>

        {/* Entry Form */}
        {showForm && (
          <GlassCard className="p-6 mb-6">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Record Your Herbal Practice</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Herb Name *</label>
                  <input
                    type="text"
                    name="herbName"
                    value={formData.herbName}
                    onChange={handleInputChange}
                    placeholder="e.g., Ashwagandha, Turmeric"
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Date Used</label>
                  <input
                    type="date"
                    name="dateUsed"
                    value={formData.dateUsed}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Preparation Method</label>
                  <select
                    name="preparationUsed"
                    value={formData.preparationUsed}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-green-500"
                  >
                    <option>tea</option>
                    <option>tincture</option>
                    <option>powder</option>
                    <option>fresh</option>
                    <option>capsule</option>
                    <option>decoction</option>
                    <option>topical</option>
                    <option>other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Dosage/Amount</label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    placeholder="e.g., 500mg, 1 cup, few drops"
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Purpose of Use</label>
                <input
                  type="text"
                  name="purposeOfUse"
                  value={formData.purposeOfUse}
                  onChange={handleInputChange}
                  placeholder="e.g., sleep support, stress relief, inflammation"
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Immediate Effects</label>
                  <textarea
                    name="immediateEffects"
                    value={formData.immediateEffects}
                    onChange={handleInputChange}
                    placeholder="What did you notice right away?"
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Longer-term Effects</label>
                  <textarea
                    name="longerTermEffects"
                    value={formData.longerTermEffects}
                    onChange={handleInputChange}
                    placeholder="Changes over hours/days?"
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none"
                    rows="3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Effectiveness (1-10)</label>
                  <input
                    type="range"
                    name="effectiveness"
                    min="1"
                    max="10"
                    value={formData.effectiveness}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <div className="text-right text-sm text-green-400 font-bold">{formData.effectiveness}/10</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Side Effects or Concerns</label>
                  <textarea
                    name="sideEffects"
                    value={formData.sideEffects}
                    onChange={handleInputChange}
                    placeholder="Any unwanted effects?"
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none"
                    rows="3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Personal Notes</label>
                <textarea
                  name="personalNotes"
                  value={formData.personalNotes}
                  onChange={handleInputChange}
                  placeholder="Any other observations or reflections..."
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none"
                  rows="3"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-gray-300">
                  <input
                    type="checkbox"
                    name="wouldUseAgain"
                    checked={formData.wouldUseAgain}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                  />
                  <span>Would use this herb again</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Entry'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </GlassCard>
        )}

        {/* Journal Entries */}
        <div className="space-y-4">
          {loading && !showForm ? (
            <div className="text-center text-gray-400 py-10">Loading entries...</div>
          ) : entries.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <div className="text-4xl mb-3">📔</div>
              <p className="text-gray-400">No entries yet. Start tracking your herbal journey today.</p>
            </GlassCard>
          ) : (
            entries
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(entry => (
                <GlassCard key={entry.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-green-400">{entry.herbName}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(entry.dateUsed).toLocaleDateString()} • {entry.preparationUsed}
                      </p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getEffectivenessColor(entry.effectiveness)}`}>
                        ⭐ {entry.effectiveness}/10
                      </span>
                      {entry.wouldUseAgain && <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold">✓ Repeat</span>}
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-gray-400 hover:text-red-400 text-xl"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Purpose:</p>
                      <p className="text-gray-200">{entry.purposeOfUse}</p>
                    </div>

                    {entry.dosage && (
                      <div>
                        <p className="text-sm text-gray-400">Dosage:</p>
                        <p className="text-gray-200">{entry.dosage}</p>
                      </div>
                    )}

                    {entry.immediateEffects && (
                      <div>
                        <p className="text-sm text-green-400 font-semibold">Immediate Effects:</p>
                        <p className="text-gray-300">{entry.immediateEffects}</p>
                      </div>
                    )}

                    {entry.longerTermEffects && (
                      <div>
                        <p className="text-sm text-emerald-400 font-semibold">Longer-term Effects:</p>
                        <p className="text-gray-300">{entry.longerTermEffects}</p>
                      </div>
                    )}

                    {entry.sideEffects && (
                      <div>
                        <p className="text-sm text-orange-400 font-semibold">Side Effects:</p>
                        <p className="text-gray-300">{entry.sideEffects}</p>
                      </div>
                    )}

                    {entry.personalNotes && (
                      <div>
                        <p className="text-sm text-blue-400 font-semibold">Notes:</p>
                        <p className="text-gray-300 italic">{entry.personalNotes}</p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              ))
          )}
        </div>

        <div ref={journalEndRef} />
      </div>
    </div>
  );
};

export default PersonalHerbalJournal;
