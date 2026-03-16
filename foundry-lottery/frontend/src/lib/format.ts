import { formatEther } from 'viem'

export function formatEth(wei: bigint): string {
  const eth = formatEther(wei)
  // Remove trailing zeros but keep at least 2 decimal places
  const num = parseFloat(eth)
  if (num === 0) return '0.00'
  if (num < 0.01) return eth
  return num.toFixed(num < 1 ? 4 : 2)
}

export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatCountdown(seconds: number): { minutes: string; seconds: string } {
  if (seconds <= 0) return { minutes: '00', seconds: '00' }
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return {
    minutes: m.toString().padStart(2, '0'),
    seconds: s.toString().padStart(2, '0'),
  }
}
