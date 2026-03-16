import { useMemo } from 'react'

export function usePlayerCount(balance: bigint, entranceFee: bigint): number {
  return useMemo(() => {
    if (entranceFee === 0n) return 0
    return Number(balance / entranceFee)
  }, [balance, entranceFee])
}
