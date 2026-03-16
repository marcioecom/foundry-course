import { createConfig, http } from 'wagmi'
import { sepolia, foundry } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

export const config = createConfig(
  getDefaultConfig({
    chains: [sepolia, foundry],
    transports: {
      [sepolia.id]: http(),
      [foundry.id]: http('http://127.0.0.1:8545'),
    },
    walletConnectProjectId: import.meta.env.VITE_WC_PROJECT_ID || '',
    appName: 'Raffle dApp',
    appDescription: 'Decentralized lottery powered by Chainlink VRF',
  }),
)
