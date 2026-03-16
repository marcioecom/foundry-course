import { formatEth } from '../../lib/format'

interface PrizePoolProps {
  balance: bigint
}

export function PrizePool({ balance }: PrizePoolProps) {
  return (
    <>
      <div className="ascii-frame">{`╔═══════════════════════════════════════════════╗
║             ▓▓▓  PRIZE POOL  ▓▓▓             ║
╚═══════════════════════════════════════════════╝`}</div>
      <div className="prize-section">
        <div className="prize-amount">
          {formatEth(balance)} <span className="eth-unit">ETH</span>
        </div>
      </div>
    </>
  )
}
