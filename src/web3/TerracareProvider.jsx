/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  HEARTWARE CHAMBER 5: TERRACARE PROVIDER                                  ║
 * ║  The Sovereign Interface Layer - Web3 Foundation                          ║
 * ║                                                                           ║
 * ║  PILLAR 1: Underground Knowledge - Stealth Web3 Implementation            ║
 * ║  - Wallet connection happens in background                                ║
 * ║  - User sees "Sovereign Identity Connected" not "Wallet Connected"        ║
 * ║  - Auto-connect on app load (remember wallet)                             ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { 
  RainbowKitProvider, 
  getDefaultConfig,
  darkTheme,
  ConnectButton
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

// ═════════════════════════════════════════════════════════════════════════════
// TERRACARE CHAIN CONFIGURATION
// ═════════════════════════════════════════════════════════════════════════════

const terracareChain = {
  id: parseInt(process.env.REACT_APP_CHAIN_ID || '1337'),
  name: 'Terracare Sovereignty',
  nativeCurrency: {
    name: 'Sovereign',
    symbol: 'SOV',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.REACT_APP_TERRACARE_RPC_URL || 'http://localhost:8545'],
    },
    public: {
      http: [process.env.REACT_APP_TERRACARE_RPC_URL || 'http://localhost:8545'],
    },
  },
  blockExplorers: {
    default: { name: 'Terracare Explorer', url: 'http://localhost:8545' },
  },
  testnet: process.env.REACT_APP_ENV === 'development',
};

// ═════════════════════════════════════════════════════════════════════════════
// WAGMI CONFIGURATION
// ═════════════════════════════════════════════════════════════════════════════

const config = getDefaultConfig({
  appName: 'Heartware - Terracare Sovereignty',
  appDescription: 'The 5th Chamber of the Terracare Sovereignty Stack. Your sovereign health identity.',
  appUrl: 'https://heartware.terracare.local',
  appIcon: '/heartware-icon.png',
  projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || 'heartware-terracare-local',
  chains: [terracareChain],
  ssr: false,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// ═════════════════════════════════════════════════════════════════════════════
// TERRACARE THEME - Sacred Geometry Aesthetic
// ═════════════════════════════════════════════════════════════════════════════

const terracareTheme = {
  ...darkTheme({
    accentColor: '#FF1493', // Deep Pink - Heartware signature
    accentColorForeground: '#FFFFFF',
    borderRadius: 'large',
    fontStack: 'system',
    overlayBlur: 'small',
  }),
  colors: {
    ...darkTheme().colors,
    connectButtonBackground: 'rgba(255, 20, 147, 0.2)',
    connectButtonBackgroundError: 'rgba(255, 0, 0, 0.2)',
    connectButtonInnerBackground: 'rgba(0, 0, 0, 0.8)',
    connectButtonText: '#FFFFFF',
    connectButtonTextError: '#FF6B6B',
    menuItemBackground: 'rgba(255, 20, 147, 0.1)',
    selectedOptionBorder: 'rgba(255, 20, 147, 0.5)',
    downloadBottomCardBackground: 'rgba(0, 0, 0, 0.9)',
    downloadTopCardBackground: 'rgba(255, 20, 147, 0.1)',
  },
  radii: {
    ...darkTheme().radii,
    connectButton: '24px',
    actionButton: '12px',
    menuButton: '12px',
    modal: '24px',
    modalMobile: '24px',
  },
  shadows: {
    ...darkTheme().shadows,
    connectButton: '0 0 20px rgba(255, 20, 147, 0.3)',
    dialog: '0 0 40px rgba(255, 20, 147, 0.2)',
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// TERRACARE PROVIDER COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

export function TerracareProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={terracareTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SOVEREIGN CONNECT BUTTON - Stealth Web3 Interface
// ═════════════════════════════════════════════════════════════════════════════

export function SovereignConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    style={{
                      background: 'rgba(255, 20, 147, 0.2)',
                      border: '1px solid rgba(255, 20, 147, 0.4)',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      color: 'white',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 20, 147, 0.3)';
                      e.target.style.boxShadow = '0 0 20px rgba(255, 20, 147, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 20, 147, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    ⚡ Initialize Sovereignty
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    style={{
                      background: 'rgba(255, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 0, 0, 0.4)',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      color: '#FF6B6B',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    ⚠ Wrong Network
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    type="button"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '20px',
                      padding: '8px 12px',
                      color: 'white',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    style={{
                      background: 'rgba(255, 20, 147, 0.2)',
                      border: '1px solid rgba(255, 20, 147, 0.4)',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      color: 'white',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <span style={{ 
                      width: 8, 
                      height: 8, 
                      background: '#00FF88', 
                      borderRadius: '50%',
                      boxShadow: '0 0 8px #00FF88',
                    }} />
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default TerracareProvider;
