/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  HEARTWARE v2.1 - 9-CHAMBER SOVEREIGNTY INTEGRATION                       ║
 * ║  The 5th Chamber of the Terracare Sovereignty Stack                      ║
 * ║                                                                           ║
 * ║  Entry point - Wraps application with Terracare Web3 Provider            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TerracareProvider } from './web3/TerracareProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TerracareProvider>
      <App />
    </TerracareProvider>
  </React.StrictMode>
);
