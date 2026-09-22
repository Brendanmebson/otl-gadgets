// supabase/functions/create-payment/index.ts
//
// Deploy with: supabase functions deploy create-payment
// Set the secret with: supabase secrets set PAYSTACK_SECRET_KEY=sk_live_xxx
//
// This function is optional if you initiate payment purely client-side with
// Paystack's inline Popup (as usePaystack.ts does). Use this instead if you
// prefer to initialize the transaction server-side (recommended once you
// need custom metadata, split payments, or subaccounts).

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const { order_id, email, amount_naira } = await req.json()
    if (!order_id || !email || !amount_naira) {
      return new Response(JSON.stringify({ error: 'order_id, email and amount_naira are required' }), { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Confirm the order exists and the amount matches what's in the DB —
    // never trust an amount sent from the client for a real charge.
    const { data: order, error } = await supabase.from('orders').select('id, total').eq('id', order_id).single()
    if (error || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 })
    }
    if (Math.round(order.total) !== Math.round(amount_naira)) {
      return new Response(JSON.stringify({ error: 'Amount mismatch' }), { status: 400 })
    }

    const initResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(order.total * 100), // kobo
        reference: order_id,
        callback_url: Deno.env.get('CHECKOUT_CALLBACK_URL') ?? undefined,
      }),
    })

    const initData = await initResponse.json()
    if (!initResponse.ok) {
      return new Response(JSON.stringify({ error: initData?.message ?? 'Paystack init failed' }), { status: 502 })
    }

    return new Response(JSON.stringify(initData.data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
