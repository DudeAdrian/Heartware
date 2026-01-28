import React, { useEffect, useState } from 'react';
// Adjust the import path as needed for your actual Sofie LLaMA service
// Placeholder: replace with your real service or API call
// import sofieLlama from '../../sofie-systems-ui/src/services/SofieLlamaService';
import { GlassCard } from '../theme/GlassmorphismTheme';
// Example user context (adjust as needed)
// import { useUser } from '../context/UserContext';

// Mocked Sofie LLaMA service for demonstration
const sofieLlama = {
  async getActionsForSubTab({ userId, subTab, userState }) {
    // Simulate async call and return mock actions
    return {
      actions: [
        { title: `Action for ${subTab}`, description: 'Personalized recommendation from Sofie LLaMA.' },
        { title: 'Next Step', description: 'Another suggested action.' },
      ],
    };
  },
};


// Mock user context (replace with real context in your app)
const stableUser = { id: 'user123', state: { journey: 'example' } };
const useUser = () => ({ user: stableUser });

const BridgedSubTab = ({ subTabKey }) => {
  const { user } = useUser();
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let isMounted = true;
    async function fetchActions() {
      setLoading(true);
      const result = await sofieLlama.getActionsForSubTab({
        userId: user.id,
        subTab: subTabKey,
        userState: user.state,
      });
      if (isMounted) {
        setActions(result.actions || []);
        setLoading(false);
      }
    }
    fetchActions();
    return () => { isMounted = false; };
  }, [user.id, subTabKey]);


  if (loading) return <GlassCard><strong>Loading personalized actions for {subTabKey}...</strong></GlassCard>;


  return (
    <GlassCard>
      <h3>Recommended Actions for <span style={{color: '#0af'}}>{subTabKey}</span></h3>
      <div style={{fontSize: '0.9em', color: '#888'}}>BridgedSubTab is live and rendering.</div>
      <ul>
        {actions.length === 0 && <li><em>No actions returned from Sofie LLaMA.</em></li>}
        {actions.map((action, idx) => (
          <li key={idx}><strong>{action.title}</strong> — {action.description}</li>
        ))}
      </ul>
    </GlassCard>
  );
};

export default BridgedSubTab;
