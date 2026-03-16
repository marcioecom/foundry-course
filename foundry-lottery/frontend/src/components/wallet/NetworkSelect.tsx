import { useState, useRef, useEffect } from 'react'
import { useAccount, useSwitchChain, useChainId } from 'wagmi'
import { sepolia, foundry } from 'wagmi/chains'

const chains = [
  { id: sepolia.id, name: 'Sepolia' },
  { id: foundry.id, name: 'Localhost' },
]

function EthIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 417" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M127.961 0L125.166 9.5V285.168L127.961 287.958L255.923 212.32L127.961 0Z" fill="#a78bfa" />
      <path d="M127.962 0L0 212.32L127.962 287.958V154.158V0Z" fill="#c4b5fd" />
      <path d="M127.961 312.187L126.386 314.107V412.306L127.961 416.905L255.999 236.587L127.961 312.187Z" fill="#a78bfa" />
      <path d="M127.962 416.905V312.187L0 236.587L127.962 416.905Z" fill="#c4b5fd" />
    </svg>
  )
}

function AnvilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="10" width="12" height="3" rx="1" fill="#a78bfa" />
      <rect x="4" y="7" width="8" height="3" rx="1" fill="#c4b5fd" />
      <rect x="6" y="3" width="4" height="4" rx="1" fill="#a78bfa" />
    </svg>
  )
}

function getChainIcon(chainId: number) {
  if (chainId === foundry.id) return <AnvilIcon />
  return <EthIcon />
}

export function NetworkSelect() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = chains.find((c) => c.id === chainId)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!isConnected) return null

  return (
    <div className="network-dropdown" ref={ref}>
      <button className="network-trigger" onClick={() => setOpen(!open)}>
        {getChainIcon(chainId)}
        <span>{current?.name ?? 'Unknown'}</span>
      </button>
      {open && (
        <div className="network-menu">
          {chains.map((c) => (
            <button
              key={c.id}
              className={`network-option ${c.id === chainId ? 'active' : ''}`}
              onClick={() => {
                switchChain({ chainId: c.id })
                setOpen(false)
              }}
            >
              {getChainIcon(c.id)}
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
