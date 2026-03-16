import { useAccount } from 'wagmi'
import { useEnterRaffle } from '../../hooks/useEnterRaffle'
import { formatEth } from '../../lib/format'
import { RaffleState } from '../../types/raffle'

interface EnterButtonProps {
  entranceFee: bigint
  raffleState: RaffleState
}

export function EnterButton({ entranceFee, raffleState }: EnterButtonProps) {
  const { isConnected } = useAccount()
  const { enter, isPending } = useEnterRaffle(entranceFee)

  const isDisabled = !isConnected || isPending || raffleState !== RaffleState.OPEN

  function getLabel() {
    if (!isConnected) return '> CONNECT_WALLET_FIRST'
    if (isPending) return '> CONFIRMING...'
    if (raffleState !== RaffleState.OPEN) return '> RAFFLE_CLOSED'
    return '> ENTER_RAFFLE'
  }

  return (
    <button onClick={enter} disabled={isDisabled} className="btn-enter">
      {getLabel()} <span className="cursor-blink">_</span>
      {isConnected && raffleState === RaffleState.OPEN && !isPending && (
        <> // {formatEth(entranceFee)} ETH</>
      )}
    </button>
  )
}
