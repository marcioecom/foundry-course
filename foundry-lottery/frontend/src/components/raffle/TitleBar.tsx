import { RaffleState } from '../../types/raffle'

interface TitleBarProps {
  state: RaffleState
}

export function TitleBar({ state }: TitleBarProps) {
  const isOpen = state === RaffleState.OPEN
  const color = isOpen ? '#4ade80' : '#eab308'
  const label = isOpen ? 'OPEN' : 'CALCULATING'

  return (
    <div className="title-bar">
      <div className="dots">
        <div className="dot-r" />
        <div className="dot-r" />
        <div className="dot-r" />
      </div>
      <span className="t-text">raffle.eth</span>
      <span className="t-status" style={{ color }}>
        <span className="pulse-sq" style={{ background: color }} />
        {label}
      </span>
    </div>
  )
}
