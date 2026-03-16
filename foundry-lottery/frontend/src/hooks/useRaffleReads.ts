import { useReadContracts, useBalance, useChainId } from 'wagmi'
import { getRaffleConfig } from '../config/contracts'
import { RaffleState } from '../types/raffle'
import { ZERO_ADDRESS, REFETCH_INTERVAL } from '../lib/constants'

export function useRaffleReads() {
  const chainId = useChainId()
  const raffleConfig = getRaffleConfig(chainId)

  const { data, isLoading: isReadLoading, queryKey } = useReadContracts({
    contracts: raffleConfig
      ? [
          { ...raffleConfig, functionName: 'getEntranceFee' },
          { ...raffleConfig, functionName: 'getRaffleState' },
          { ...raffleConfig, functionName: 'getRecentWinner' },
          { ...raffleConfig, functionName: 'getLastTimestamp' },
        ]
      : [],
    query: {
      enabled: !!raffleConfig,
      refetchInterval: REFETCH_INTERVAL,
    },
  })

  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address: raffleConfig?.address,
    query: {
      enabled: !!raffleConfig,
      refetchInterval: REFETCH_INTERVAL,
    },
  })

  const entranceFee = (data?.[0]?.result as bigint) ?? 0n
  const raffleState = (data?.[1]?.result as number) ?? RaffleState.OPEN
  const recentWinner = (data?.[2]?.result as string) ?? ZERO_ADDRESS
  const lastTimestamp = (data?.[3]?.result as bigint) ?? 0n
  const balance = balanceData?.value ?? 0n

  return {
    entranceFee,
    raffleState: raffleState as RaffleState,
    recentWinner,
    lastTimestamp,
    balance,
    isLoading: isReadLoading || isBalanceLoading,
    queryKey,
    contractAddress: raffleConfig?.address,
  }
}
