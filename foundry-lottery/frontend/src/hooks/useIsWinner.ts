import { useAccount } from 'wagmi'
import { ZERO_ADDRESS } from '../lib/constants'

export function useIsWinner(recentWinner: string): boolean {
  const { address } = useAccount()
  if (!address || !recentWinner) return false
  if (recentWinner === ZERO_ADDRESS) return false
  return address.toLowerCase() === recentWinner.toLowerCase()
}
