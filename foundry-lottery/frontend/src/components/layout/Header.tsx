import { ConnectWallet } from '../wallet/ConnectWallet'
import { NetworkSelect } from '../wallet/NetworkSelect'
import { UserBalance } from '../wallet/UserBalance'

export function Header() {
  return (
    <nav className="nav">
      <div className="logo">
        <span>[</span> RAFFLE <span>]</span>
      </div>
      <div className="nav-right">
        <UserBalance />
        <NetworkSelect />
        <ConnectWallet />
      </div>
    </nav>
  )
}
