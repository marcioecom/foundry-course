export const RaffleState = {
  OPEN: 0,
  CALCULATING: 1,
} as const

export type RaffleState = (typeof RaffleState)[keyof typeof RaffleState]

export interface ToastData {
  id: string
  type: 'success' | 'error' | 'info' | 'pending'
  title: string
  message: string
}

export interface RaffleReads {
  entranceFee: bigint
  raffleState: RaffleState
  recentWinner: string
  lastTimestamp: bigint
  balance: bigint
  isLoading: boolean
}
