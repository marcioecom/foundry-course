import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { config } from './config/wagmi'
import { ToastProvider } from './components/notifications/ToastProvider'
import { Background } from './components/layout/Background'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { HeroTitle } from './components/hero/HeroTitle'
import { AsciiDecoration } from './components/raffle/AsciiDecoration'
import { RaffleCard } from './components/raffle/RaffleCard'
import { WinnerSection } from './components/history/WinnerHistory'
import { ToastContainer } from './components/notifications/ToastContainer'
import { DrawAnimation } from './components/effects/DrawAnimation'
import { Confetti } from './components/effects/Confetti'
import { useRaffleReads } from './hooks/useRaffleReads'
import { useIsWinner } from './hooks/useIsWinner'
import { RaffleState } from './types/raffle'

const queryClient = new QueryClient()

function RaffleApp() {
  const raffleData = useRaffleReads()
  const isWinner = useIsWinner(raffleData.recentWinner)

  return (
    <>
      <Background />
      <div className="container">
        <Header />
        <HeroTitle />
        <AsciiDecoration />
        <RaffleCard data={raffleData} />
        <WinnerSection recentWinner={raffleData.recentWinner} />
        <Footer />
      </div>
      <ToastContainer />
      {raffleData.raffleState === RaffleState.CALCULATING && <DrawAnimation />}
      {isWinner && <Confetti />}
    </>
  )
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="midnight">
          <ToastProvider>
            <RaffleApp />
          </ToastProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
