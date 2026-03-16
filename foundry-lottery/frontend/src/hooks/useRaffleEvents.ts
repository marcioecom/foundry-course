import { useWatchContractEvent, useChainId } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { getRaffleConfig } from '../config/contracts'
import { useToast } from '../components/notifications/ToastProvider'
import { truncateAddress } from '../lib/format'

export function useRaffleEvents() {
  const chainId = useChainId()
  const raffleConfig = getRaffleConfig(chainId)
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  useWatchContractEvent({
    ...raffleConfig,
    eventName: 'RaffleEntered',
    enabled: !!raffleConfig,
    onLogs(logs) {
      for (const log of logs) {
        const player = (log as any).args?.player as string
        if (player) {
          addToast({
            type: 'info',
            title: 'PLAYER_JOINED',
            message: `${truncateAddress(player)} entered the raffle`,
          })
        }
      }
      queryClient.invalidateQueries()
    },
  })

  useWatchContractEvent({
    ...raffleConfig,
    eventName: 'WinnerPicked',
    enabled: !!raffleConfig,
    onLogs(logs) {
      for (const log of logs) {
        const winner = (log as any).args?.winner as string
        if (winner) {
          addToast({
            type: 'success',
            title: 'WINNER_PICKED',
            message: `${truncateAddress(winner)} won the raffle!`,
          })
        }
      }
      queryClient.invalidateQueries()
    },
  })
}
