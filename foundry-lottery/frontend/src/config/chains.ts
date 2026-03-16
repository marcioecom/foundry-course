import { sepolia, foundry } from 'wagmi/chains'

export const supportedChains = [sepolia, foundry] as const
export type SupportedChainId = (typeof supportedChains)[number]['id']
