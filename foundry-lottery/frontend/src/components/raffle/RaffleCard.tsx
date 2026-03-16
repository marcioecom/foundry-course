import { TitleBar } from './TitleBar'
import { PrizePool } from './PrizePool'
import { DataRows } from './DataRows'
import { Countdown } from './Countdown'
import { EnterButton } from './EnterButton'
import { usePlayerCount } from '../../hooks/usePlayerCount'
import { useRaffleEvents } from '../../hooks/useRaffleEvents'
import type { RaffleReads } from '../../types/raffle'

interface RaffleCardProps {
  data: RaffleReads & { queryKey?: unknown }
}

export function RaffleCard({ data }: RaffleCardProps) {
  const { entranceFee, raffleState, recentWinner, lastTimestamp, balance, isLoading } = data
  const playerCount = usePlayerCount(balance, entranceFee)
  useRaffleEvents()

  if (isLoading) {
    return (
      <div className="card-terminal">
        <div className="loading-text">&gt; loading contract data...</div>
      </div>
    )
  }

  return (
    <div className="card-terminal">
      <div className="scanlines" />
      <TitleBar state={raffleState} />
      <div className="card-body">
        <PrizePool balance={balance} />
        <DataRows playerCount={playerCount} entranceFee={entranceFee} recentWinner={recentWinner} />
        <Countdown lastTimestamp={lastTimestamp} />
        <div className="ascii-sep">════════════════════════════════════════════════</div>
        <EnterButton entranceFee={entranceFee} raffleState={raffleState} />
      </div>
    </div>
  )
}
