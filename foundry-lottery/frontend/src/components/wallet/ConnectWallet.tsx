import { ConnectKitButton } from 'connectkit'
import { truncateAddress } from '../../lib/format'

export function ConnectWallet() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address }) => (
        <button onClick={show} className="connect-btn">
          {isConnected && address ? truncateAddress(address) : 'CONNECT WALLET'}
        </button>
      )}
    </ConnectKitButton.Custom>
  )
}
