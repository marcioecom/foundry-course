import { formatEth, truncateAddress } from '../../lib/format'
import { ZERO_ADDRESS } from '../../lib/constants'

interface DataRowsProps {
  playerCount: number
  entranceFee: bigint
  recentWinner: string
}

export function DataRows({ playerCount, entranceFee, recentWinner }: DataRowsProps) {
  const winnerDisplay = recentWinner === ZERO_ADDRESS ? '-' : truncateAddress(recentWinner)

  return (
    <div className="data-rows">
      <div className="data-row">
        <span className="data-key">players_count</span>
        <span className="data-val">{playerCount}</span>
      </div>
      <div className="data-row">
        <span className="data-key">entry_fee</span>
        <span className="data-val">{formatEth(entranceFee)} ETH</span>
      </div>
      <div className="data-row">
        <span className="data-key">recent_winner</span>
        <span className="data-val">{winnerDisplay}</span>
      </div>
    </div>
  )
}
