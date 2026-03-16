import { useEffect, useState } from 'react'
import { usePublicClient, useChainId } from 'wagmi'
import { getRaffleConfig } from '../config/contracts'
import { raffleAbi } from '../abi/Raffle'

interface WinnerEvent {
  winner: string
  blockNumber: bigint
}

export function useWinnerHistory() {
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const raffleConfig = getRaffleConfig(chainId)
  const [winners, setWinners] = useState<WinnerEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!publicClient || !raffleConfig) return

    async function fetchWinners() {
      setIsLoading(true)
      try {
        const logs = await publicClient!.getContractEvents({
          address: raffleConfig!.address,
          abi: raffleAbi,
          eventName: 'WinnerPicked',
          fromBlock: 0n,
        })

        const parsed = logs
          .map((log) => ({
            winner: (log as any).args?.winner as string,
            blockNumber: log.blockNumber,
          }))
          .filter((e) => !!e.winner)
          .reverse()

        setWinners(parsed)
      } catch {
        // Events may not be available on all chains
      } finally {
        setIsLoading(false)
      }
    }

    fetchWinners()
  }, [publicClient, chainId, raffleConfig?.address])

  return { winners, isLoading }
}
