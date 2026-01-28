import React, { useState } from 'react';
import { sendSofiePrompt } from '../services/SofieLlamaService';
import { sofieLibraries } from '../services/SofieLibraryList';
import { GlassCard } from '../theme/GlassmorphismTheme';
import { useNavigate } from 'react-router-dom';

const SofieAI = () => {
  const navigate = useNavigate();
  const [sofieInput, setSofieInput] = useState('');
  const [sofieResponse, setSofieResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState(sofieLibraries[0]?.key || 'frequencies');

  const handleSofieSend = async () => {
    setLoading(true);
    setError('');
    setSofieResponse('');
    const input = sofieInput.toLowerCase();
    if (input.includes("metrics")) {
      navigate("/personal-health-metrics");
    } else if (input.includes("nutrition")) {
      navigate("/nutrition");
    } else if (input.includes("holistic")) {
      navigate("/holistic");
    } else if (input.includes("mindfulness")) {
      navigate("/mindfulness");
    } else if (input.includes("movement")) {
      navigate("/movement");
    } else if (input.includes("care team")) {
      navigate("/care-team");
    } else if (input.includes("biofeedback")) {
      navigate("/biofeedback");
    } else if (input.includes("records")) {
      navigate("/health-records");
    } else if (input.includes("profile")) {
      navigate("/profile");
    } else if (input.includes("settings")) {
      navigate("/settings");
    }
    // Real LLaMA backend response
    const context = [{ role: "user", content: sofieInput }];
    try {
      const result = await sendSofiePrompt(sofieInput, { library: selectedLibrary, context });
      if (result.error) {
        setError(result.error);
      } else {
        setSofieResponse(result.choices ? result.choices[0]?.message?.content : JSON.stringify(result));
      }
    } catch (error) {
      setError('Failed to connect to SOFIE.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
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
    </div>
  );
};

export default SofieAI;
