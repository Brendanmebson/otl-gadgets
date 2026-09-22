import { useCallback } from 'react'

declare global {
  interface Window {
    PaystackPop?: {
      setup(options: Record<string, unknown>): { openIframe: () => void }
    }
  }
}

const PAYSTACK_SCRIPT_SRC = 'https://js.paystack.co/v1/inline.js'

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve()
    const script = document.createElement('script')
    script.src = PAYSTACK_SCRIPT_SRC
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Paystack'))
    document.body.appendChild(script)
  })
}

interface PayArgs {
  email: string
  amountNaira: number
  orderId: string
  onSuccess: (reference: string) => void
  onClose?: () => void
}

// SECURITY NOTE: only the Paystack *public* key is used here, which is safe
// to ship to the browser. The secret key must live only in the Supabase
// Edge Function environment (see supabase/functions/verify-payment) — never
// in this React app. That function re-verifies the transaction with
// Paystack's server-side API before marking the order paid and
// decrementing stock.
export function usePaystack() {
  const pay = useCallback(async ({ email, amountNaira, orderId, onSuccess, onClose }: PayArgs) => {
    await loadPaystackScript()
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string

    if (!publicKey) {
      // eslint-disable-next-line no-console
      console.warn('VITE_PAYSTACK_PUBLIC_KEY is not set — payment cannot be initiated.')
      return
    }

    const handler = window.PaystackPop!.setup({
      key: publicKey,
      email,
      amount: Math.round(amountNaira * 100), // kobo
      currency: 'NGN',
      ref: orderId,
      callback: (response: { reference: string }) => onSuccess(response.reference),
      onClose,
    })
    handler.openIframe()
  }, [])

  return { pay }
}
