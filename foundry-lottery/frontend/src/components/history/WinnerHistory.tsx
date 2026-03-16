import { truncateAddress } from '../../lib/format'
import { ZERO_ADDRESS } from '../../lib/constants'

interface WinnerSectionProps {
  recentWinner: string
}

export function WinnerSection({ recentWinner }: WinnerSectionProps) {
  const display = recentWinner === ZERO_ADDRESS ? 'No winner yet' : truncateAddress(recentWinner)

  return (
    <div className="winner-section">
      <div className="winner-label">most_recent_winner</div>
      <div className="winner-address">{display}</div>
    </div>
  )
}
