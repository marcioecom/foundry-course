import { useAccount, useBalance } from 'wagmi'
import { formatEth } from '../../lib/format'

export function UserBalance() {
  const { address, isConnected } = useAccount()
  const { data } = useBalance({ address })

  if (!isConnected || !data) return null

  return (
    <div className="user-balance">
      {formatEth(data.value)} ETH
    </div>
  )
}
