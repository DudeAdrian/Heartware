import React, { useState, useEffect } from 'react';
import { GlassCard } from '../theme/GlassmorphismTheme';

const HerbalLibrary = () => {
  const [herbs, setHerbs] = useState([]);
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    tradition: '',
    condition: '',
    safeForPregnancy: false
  });
  const [traditions, setTraditions] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetadata();
    fetchHerbs();
  }, [filters]);

  const fetchMetadata = async () => {
    try {
      const [traditionsRes, conditionsRes] = await Promise.all([
        fetch('/api/herbs/meta/traditions'),
        fetch('/api/herbs/meta/conditions')
      ]);
      const traditionsData = await traditionsRes.json();
      const conditionsData = await conditionsRes.json();
      
      if (traditionsData.success) setTraditions(traditionsData.data);
      if (conditionsData.success) setConditions(conditionsData.data);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  const fetchHerbs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.tradition) params.append('tradition', filters.tradition);
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.safeForPregnancy) params.append('safeForPregnancy', 'true');

      const response = await fetch(`/api/herbs?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setHerbs(data.data);
      }
    } catch (error) {
      console.error('Error fetching herbs:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewHerbDetails = async (herbId) => {
    try {
      const response = await fetch(`/api/herbs/${herbId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedHerb(data.data);
      }
    } catch (error) {
      console.error('Error fetching herb details:', error);
    }
  };

  const getTraditionColor = (tradition) => {
    const colors = {
      'Ayurveda': 'from-orange-500 to-amber-500',
      'Traditional Chinese Medicine': 'from-red-500 to-rose-500',
      'Native American': 'from-emerald-500 to-teal-500',
      'African Traditional Medicine': 'from-yellow-500 to-orange-600',
      'Amazonian Shamanism': 'from-green-600 to-emerald-600',
      'Aboriginal Australian Medicine': 'from-amber-600 to-yellow-700',
      'European Herbal Medicine': 'from-blue-500 to-indigo-500'
    };
    return colors[tradition] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            🌿 Indigenous Herbal Library
          </h1>
          <p className="text-gray-300 text-lg">
            Ancient healing wisdom from traditions across the globe
          </p>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search herbs..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500"
            />

            {/* Tradition Filter */}
            <select
              value={filters.tradition}
              onChange={(e) => setFilters({ ...filters, tradition: e.target.value })}
              className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-green-500"
            >
              <option value="">All Traditions</option>
              {traditions.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Condition Filter */}
            <select
              value={filters.condition}
              onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
              className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-green-500"
            >
              <option value="">All Conditions</option>
              {conditions.slice(0, 50).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Safety Filter */}
            <label className="flex items-center gap-3 bg-gray-800/50 border border-gray-600 rounded-lg p-3 cursor-pointer hover:border-green-500">
              <input
                type="checkbox"
                checked={filters.safeForPregnancy}
                onChange={(e) => setFilters({ ...filters, safeForPregnancy: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-gray-200">Safe for Pregnancy</span>
            </label>
          </div>
        </GlassCard>

        {/* Herb Grid */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">
            <div className="text-4xl mb-4">🌱</div>
            <p>Loading ancient wisdom...</p>
          </div>
        ) : selectedHerb ? (
          /* Detailed Herb View */
          <div>
            <button
              onClick={() => setSelectedHerb(null)}
              className="mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg"
            >
              ← Back to Library
            </button>

            <GlassCard className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2">
                  <h2 className="text-4xl font-bold text-green-400 mb-2">{selectedHerb.commonName}</h2>
                  <p className="text-xl text-gray-400 italic mb-4">{selectedHerb.scientificName}</p>
                  
                  {/* Traditions */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedHerb.traditions.map((t, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-full text-white text-sm bg-gradient-to-r ${getTraditionColor(t)}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Lore */}
                  {selectedHerb.lore && (
                    <div className="mb-6 p-4 bg-amber-900/20 border border-amber-700/30 rounded-lg">
                      <div className="text-amber-400 font-semibold mb-2">📜 Ancient Lore</div>
                      <p className="text-gray-300 italic">{selectedHerb.lore}</p>
                    </div>
                  )}

                  {/* Therapeutic Uses */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-green-400 mb-3">Therapeutic Uses</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedHerb.therapeuticUses.map((use, i) => (
                        <span key={i} className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm">
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Energetics */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-purple-400 font-semibold mb-2">🔮 Energetic Properties</h4>
                      <p className="text-gray-300">{selectedHerb.energeticProperties}</p>
                    </div>
                    <div>
                      <h4 className="text-purple-400 font-semibold mb-2">💫 Elemental Association</h4>
                      <p className="text-gray-300">{selectedHerb.elementalAssociation}</p>
                    </div>
                  </div>

                  {/* Chakras */}
                  {selectedHerb.chakraAlignment?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-purple-400 font-semibold mb-2">🕉️ Chakra Alignment</h4>
                      <div className="flex gap-2">
                        {selectedHerb.chakraAlignment.map((chakra, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm">
                            {chakra}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preparation */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-blue-400 mb-3">Preparation & Usage</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-400">Parts Used:</span>
                        <span className="ml-2 text-gray-200">{selectedHerb.partsUsed.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Preparation Methods:</span>
                        <span className="ml-2 text-gray-200">{selectedHerb.preparationMethods.join(', ')}</span>
                      </div>
                      {selectedHerb.dosageGuidelines && (
                        <div>
                          <span className="text-gray-400">Dosage:</span>
                          <span className="ml-2 text-gray-200">{selectedHerb.dosageGuidelines}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Safety */}
                  <div className="p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
                    <h3 className="text-xl font-semibold text-red-400 mb-3">⚠️ Safety Information</h3>
                    <div className="space-y-2 text-gray-300">
                      {selectedHerb.contraindications?.length > 0 && (
                        <div>
                          <span className="font-semibold">Contraindications:</span>
                          <span className="ml-2">{selectedHerb.contraindications.join(', ')}</span>
                        </div>
                      )}
                      {selectedHerb.medicationInteractions?.length > 0 && (
                        <div>
                          <span className="font-semibold">Drug Interactions:</span>
                          <span className="ml-2">{selectedHerb.medicationInteractions.join(', ')}</span>
                        </div>
                      )}
                      <div className="flex gap-4 mt-3">
                        <span className={selectedHerb.pregnancySafe ? 'text-green-400' : 'text-red-400'}>
                          {selectedHerb.pregnancySafe ? '✓' : '✗'} Pregnancy
                        </span>
                        <span className={selectedHerb.childrenSafe ? 'text-green-400' : 'text-red-400'}>
                          {selectedHerb.childrenSafe ? '✓' : '✗'} Children
                        </span>
                      </div>
                      {selectedHerb.safetyNotes && (
                        <p className="mt-2 text-sm">{selectedHerb.safetyNotes}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div>
                  {/* Indigenous Names */}
                  <div className="mb-6 p-4 bg-amber-900/20 border border-amber-700/30 rounded-lg">
                    <h4 className="text-amber-400 font-semibold mb-2">Indigenous Names</h4>
                    <ul className="text-gray-300 space-y-1">
                      {selectedHerb.indigenousNames.map((name, i) => (
                        <li key={i} className="text-sm">• {name}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Cultural Origin */}
                  <div className="mb-6">
                    <h4 className="text-gray-400 font-semibold mb-2">🌍 Origin</h4>
                    <p className="text-gray-300 text-sm">{selectedHerb.culturalOrigin.join(', ')}</p>
                  </div>

                  {/* Sustainability */}
                  <div className="mb-6 p-4 bg-green-900/20 border border-green-700/30 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-2">🌱 Sustainability</h4>
                    <p className="text-gray-300 text-sm mb-2">
                      <span className="font-semibold">Status:</span> {selectedHerb.sustainabilityStatus}
                    </p>
                    {selectedHerb.ethicalHarvesting && (
                      <p className="text-gray-400 text-xs">{selectedHerb.ethicalHarvesting}</p>
                    )}
                  </div>

                  {/* Research Notes */}
                  {selectedHerb.researchNotes && (
                    <div className="p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                      <h4 className="text-blue-400 font-semibold mb-2">🔬 Research</h4>
                      <p className="text-gray-300 text-sm">{selectedHerb.researchNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        ) : (
          /* Herb Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {herbs.map(herb => (
              <GlassCard
                key={herb.id}
                className="p-6 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => viewHerbDetails(herb.id)}
              >
                <h3 className="text-2xl font-bold text-green-400 mb-2">{herb.commonName}</h3>
                <p className="text-sm text-gray-400 italic mb-4">{herb.scientificName}</p>

                {/* Traditions */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {herb.traditions.slice(0, 2).map((t, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded-full text-white text-xs bg-gradient-to-r ${getTraditionColor(t)}`}
                    >
                      {t.length > 20 ? t.substring(0, 17) + '...' : t}
                    </span>
                  ))}
                  {herb.traditions.length > 2 && (
                    <span className="px-2 py-1 rounded-full text-gray-400 text-xs">
                      +{herb.traditions.length - 2}
                    </span>
                  )}
                </div>

                {/* Therapeutic Uses Preview */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Good for:</div>
                  <div className="flex flex-wrap gap-1">
                    {herb.therapeuticUses.slice(0, 4).map((use, i) => (
                      <span key={i} className="px-2 py-1 bg-green-500/20 rounded text-green-300 text-xs">
                        {use}
                      </span>
                    ))}
                    {herb.therapeuticUses.length > 4 && (
                      <span className="px-2 py-1 text-gray-400 text-xs">
                        +{herb.therapeuticUses.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Safety Indicators */}
                <div className="flex gap-3 text-xs">
                  {herb.pregnancySafe && <span className="text-green-400">✓ Pregnancy safe</span>}
                  {herb.childrenSafe && <span className="text-green-400">✓ Children safe</span>}
                </div>
              </GlassCard>
            ))}

            {herbs.length === 0 && !loading && (
              <div className="col-span-full text-center text-gray-400 py-20">
                <div className="text-4xl mb-4">🍃</div>
                <p>No herbs found matching your filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HerbalLibrary;
