import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { getRaffleConfig } from '../config/contracts'
import { useToast } from '../components/notifications/ToastProvider'
import { useEffect } from 'react'

export function useEnterRaffle(entranceFee: bigint) {
  const chainId = useChainId()
  const raffleConfig = getRaffleConfig(chainId)
  const { addToast } = useToast()

  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError,
    reset,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash })

  function enter() {
    if (!raffleConfig) return
    writeContract({
      ...raffleConfig,
      functionName: 'enterRaffle',
      value: entranceFee,
    })
  }

  useEffect(() => {
    if (hash && isConfirming) {
      addToast({
        type: 'pending',
        title: 'TX_PENDING',
        message: `Confirming ${hash.slice(0, 10)}...`,
      })
    }
  }, [hash, isConfirming])

  useEffect(() => {
    if (isConfirmed) {
      addToast({
        type: 'success',
        title: 'TX_CONFIRMED',
        message: 'You have entered the raffle!',
      })
      reset()
    }
  }, [isConfirmed])

  useEffect(() => {
    const error = writeError || receiptError
    if (error) {
      const msg = error.message.includes('User rejected')
        ? 'Transaction rejected by user'
        : error.message.includes('SendMoreToEnterRaffle')
          ? 'Insufficient ETH for entrance fee'
          : error.message.includes('RaffleNotOpen')
            ? 'Raffle is not accepting entries'
            : 'Transaction failed'
      addToast({ type: 'error', title: 'TX_ERROR', message: msg })
    }
  }, [writeError, receiptError])

  return {
    enter,
    isPending: isWritePending || isConfirming,
    isConfirmed,
  }
}
