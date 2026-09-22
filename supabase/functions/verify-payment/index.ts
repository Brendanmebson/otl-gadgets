// supabase/functions/verify-payment/index.ts
//
// Deploy with: supabase functions deploy verify-payment
// Set secrets with:
//   supabase secrets set PAYSTACK_SECRET_KEY=sk_live_xxx
//
// Call this from the frontend right after Paystack's Popup calls back with
// a `reference` (see usePaystack.ts), or wire it as a Paystack webhook
// (recommended for production so payment confirmation doesn't depend on the
// customer's browser staying open).
//
// This is the ONLY place stock should ever be decremented — never trust the
// client-side "success" callback alone.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const { reference } = await req.json()
    if (!reference) {
      return new Response(JSON.stringify({ error: 'reference is required' }), { status: 400 })
    }

    // 1. Verify the transaction directly with Paystack's server API.
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    })
    const verifyData = await verifyRes.json()

    if (!verifyRes.ok || verifyData?.data?.status !== 'success') {
      return new Response(JSON.stringify({ error: 'Payment verification failed', detail: verifyData }), { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // 2. Idempotency: if this reference was already processed, don't double-decrement stock.
    const { data: order, error: orderError } = await supabase
      .from('orders').select('id, payment_status, total').eq('id', reference).single()
    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found for reference' }), { status: 404 })
    }
    if (order.payment_status === 'paid') {
      return new Response(JSON.stringify({ status: 'already_processed' }), { headers: { 'Content-Type': 'application/json' } })
    }

    const paidAmountNaira = verifyData.data.amount / 100
    if (Math.round(paidAmountNaira) !== Math.round(order.total)) {
      return new Response(JSON.stringify({ error: 'Paid amount does not match order total' }), { status: 400 })
    }

    // 3. Mark the order paid and record the payment.
    await supabase.from('orders').update({
      payment_status: 'paid',
      order_status: 'processing',
      paystack_reference: reference,
      updated_at: new Date().toISOString(),
    }).eq('id', order.id)

    await supabase.from('payments').insert({
      order_id: order.id,
      paystack_reference: reference,
      amount: paidAmountNaira,
      status: 'paid',
      raw_response: verifyData.data,
    })

    // 4. Decrement stock for each item, safely (row-locked in the SQL function).
    const { data: items } = await supabase.from('order_items').select('product_id, quantity').eq('order_id', order.id)
    for (const item of items ?? []) {
      if (item.product_id) {
        await supabase.rpc('decrement_stock', { p_product_id: item.product_id, p_quantity: item.quantity })
      }
    }

    return new Response(JSON.stringify({ status: 'paid' }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
