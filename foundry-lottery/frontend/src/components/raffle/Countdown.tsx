import { useCountdown } from '../../hooks/useCountdown'

interface CountdownProps {
  lastTimestamp: bigint
}

export function Countdown({ lastTimestamp }: CountdownProps) {
  const { minutes, seconds, isExpired } = useCountdown(lastTimestamp)

  return (
    <div className="countdown-row">
      <div className="ct-label">next_draw_in</div>
      {isExpired ? (
        <div className="ct-val-eligible">DRAW ELIGIBLE</div>
      ) : (
        <div className="ct-val">
          {minutes}<span className="colon">:</span>{seconds}
        </div>
      )}
    </div>
  )
}
