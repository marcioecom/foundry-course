import { type SupportedChainId } from './chains'
import { raffleAbi } from '../abi/Raffle'

const RAFFLE_ADDRESSES: Record<SupportedChainId, `0x${string}`> = {
  11155111: '0x97c6812267138840da91c2898e4cd4deb0154141', // Sepolia
  31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // Anvil default deploy address
}

export function getRaffleAddress(chainId: number): `0x${string}` | undefined {
  return RAFFLE_ADDRESSES[chainId as SupportedChainId]
}

export function getRaffleConfig(chainId: number) {
  const address = getRaffleAddress(chainId)
  if (!address) return undefined
  return { address, abi: raffleAbi } as const
}

export { raffleAbi }
