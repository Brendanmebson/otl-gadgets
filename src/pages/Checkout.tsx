import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Container, Grid, Box, Typography, Stack, TextField, MenuItem, Button, Divider, Alert, Paper, RadioGroup, Radio, FormControlLabel, Chip,
} from '@mui/material'
import { ShieldCheck, Lock, CreditCard, Banknote, Building2, CheckCircle2, ArrowRight } from 'lucide-react'
import { colors } from '@/theme/theme'
import { formatNaira } from '@/lib/format'
import { useCart } from '@/context/CartContext'
import { useCreateOrder } from '@/hooks/useOrders'
import { usePaystack } from '@/hooks/usePaystack'
import EmptyState from '@/components/common/EmptyState'

const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Kano', 'Ogun', 'Enugu', 'Kaduna', 'Delta', 'Anambra',
]

const BASE_DELIVERY_FEE = 3500

const checkoutSchema = z.object({
  full_name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(10, 'Enter a valid phone number (e.g. 08012345678)'),
  state: z.string().min(1, 'Select a delivery state'),
  city: z.string().min(2, 'Enter your delivery city'),
  address: z.string().min(5, 'Enter your full street delivery address'),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { mutateAsync: createOrder, isPending } = useCreateOrder()
  const { pay } = usePaystack()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'pod' | 'transfer'>('paystack')
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle')

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  })

  if (items.length === 0 && paymentState !== 'success') {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <EmptyState title="Your cart is empty" subtitle="Add items to your cart before checking out." actionLabel="Explore Catalogue" onAction={() => navigate('/shop')} />
      </Container>
    )
  }

  const deliveryFee = subtotal >= 300000 ? 0 : BASE_DELIVERY_FEE
  const total = subtotal + deliveryFee

  const onSubmit = async (formData: CheckoutForm) => {
    setPaymentState('processing')
    try {
      const order = await createOrder({
        items,
        address: formData,
        subtotal,
        deliveryFee,
        discount: 0,
        total,
      })

      if (paymentMethod === 'paystack') {
        await pay({
          email: formData.email,
          amountNaira: total,
          orderId: order.id,
          onSuccess: () => {
            setPaymentState('success')
            clearCart()
          },
          onClose: () => setPaymentState('idle'),
        })
      } else {
        // Pay on Delivery or Bank Transfer Mock
        setTimeout(() => {
          setPaymentState('success')
          clearCart()
        }, 1200)
      }
    } catch (err) {
      setPaymentState('failed')
    }
  }

  if (paymentState === 'success') {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Paper elevation={0} sx={{ p: 5, borderRadius: 2, border: `1px solid ${colors.grey[200]}`, bgcolor: colors.white }}>
          <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: colors.redGlow, color: colors.red, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
            <CheckCircle2 size={36} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: colors.black }}>
            Order Successfully Placed!
          </Typography>
          <Typography variant="body1" sx={{ color: colors.grey[500], mb: 4, lineHeight: 1.6 }}>
            Thank you for shopping with OTL Gadgets. A confirmation email and tracking link have been dispatched to your email address.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            fullWidth
            onClick={() => navigate('/shop')}
            sx={{ py: 1.5 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, color: colors.black }}>
        CHECKOUT & DELIVERY
      </Typography>

      {paymentState === 'failed' && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Payment processing could not be completed. Please verify your details or select another payment option.
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Stack spacing={4}>
              <Paper elevation={0} sx={{ p: 3.5, border: `1px solid ${colors.grey[200]}`, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>1. Customer Details</Typography>
                <Stack spacing={2.5}>
                  <TextField label="Full Name *" fullWidth {...register('full_name')} error={!!errors.full_name} helperText={errors.full_name?.message} />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField label="Email Address *" fullWidth {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
                    <TextField label="Phone Number (WhatsApp) *" fullWidth {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} />
                  </Stack>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 3.5, border: `1px solid ${colors.grey[200]}`, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>2. Nationwide Shipping Address</Typography>
                <Stack spacing={2.5}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField select label="State *" fullWidth defaultValue="" {...register('state')} error={!!errors.state} helperText={errors.state?.message}>
                      {NIGERIAN_STATES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </TextField>
                    <TextField label="City *" fullWidth {...register('city')} error={!!errors.city} helperText={errors.city?.message} />
                  </Stack>
                  <TextField label="Full Delivery Address *" fullWidth multiline rows={3} placeholder="Street name, landmark, house number..." {...register('address')} error={!!errors.address} helperText={errors.address?.message} />
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 3.5, border: `1px solid ${colors.grey[200]}`, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>3. Select Payment Method</Typography>
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
                  <Stack spacing={1.5}>
                    <Paper
                      elevation={0}
                      onClick={() => setPaymentMethod('paystack')}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1.5px solid ${paymentMethod === 'paystack' ? colors.red : colors.grey[200]}`,
                        bgcolor: paymentMethod === 'paystack' ? 'rgba(227, 28, 37, 0.03)' : colors.white,
                        cursor: 'pointer',
                      }}
                    >
                      <FormControlLabel
                        value="paystack"
                        control={<Radio color="secondary" />}
                        label={
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <CreditCard size={20} color={colors.red} />
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Paystack (Debit Card, USSD, Transfer)</Typography>
                              <Typography variant="caption" sx={{ color: colors.grey[500] }}>Instant secure payment via Paystack gateway</Typography>
                            </Box>
                          </Stack>
                        }
                      />
                    </Paper>

                    <Paper
                      elevation={0}
                      onClick={() => setPaymentMethod('pod')}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1.5px solid ${paymentMethod === 'pod' ? colors.red : colors.grey[200]}`,
                        bgcolor: paymentMethod === 'pod' ? 'rgba(227, 28, 37, 0.03)' : colors.white,
                        cursor: 'pointer',
                      }}
                    >
                      <FormControlLabel
                        value="pod"
                        control={<Radio color="secondary" />}
                        label={
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Banknote size={20} color={colors.red} />
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Pay on Delivery (POS / Cash)</Typography>
                              <Typography variant="caption" sx={{ color: colors.grey[500] }}>Inspect items before payment upon courier arrival</Typography>
                            </Box>
                          </Stack>
                        }
                      />
                    </Paper>

                    <Paper
                      elevation={0}
                      onClick={() => setPaymentMethod('transfer')}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1.5px solid ${paymentMethod === 'transfer' ? colors.red : colors.grey[200]}`,
                        bgcolor: paymentMethod === 'transfer' ? 'rgba(227, 28, 37, 0.03)' : colors.white,
                        cursor: 'pointer',
                      }}
                    >
                      <FormControlLabel
                        value="transfer"
                        control={<Radio color="secondary" />}
                        label={
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Building2 size={20} color={colors.red} />
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Direct Bank Transfer</Typography>
                              <Typography variant="caption" sx={{ color: colors.grey[500] }}>Transfer directly to OTL Gadgets business bank account</Typography>
                            </Box>
                          </Stack>
                        }
                      />
                    </Paper>
                  </Stack>
                </RadioGroup>
              </Paper>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 3.5, border: `1px solid ${colors.grey[200]}`, borderRadius: 2, position: 'sticky', top: 90 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>YOUR ORDER SUMMARY</Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                {items.map(({ product, quantity }) => (
                  <Stack key={product.id} direction="row" spacing={2} alignItems="center">
                    <Box component="img" src={product.images?.[0]?.url} alt={product.name} sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: colors.grey[50], objectFit: 'contain' }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: colors.black }}>{product.name}</Typography>
                      <Typography variant="caption" sx={{ color: colors.grey[500] }}>Qty: {quantity}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: colors.black }}>
                      {formatNaira(product.price * quantity)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: colors.grey[600] }}>Subtotal</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatNaira(subtotal)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: colors.grey[600] }}>Delivery Fee</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: deliveryFee === 0 ? colors.red : colors.black }}>
                    {deliveryFee === 0 ? 'FREE' : formatNaira(deliveryFee)}
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total Payable</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: colors.red }}>{formatNaira(total)}</Typography>
                </Stack>
              </Stack>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowRight size={18} />}
                disabled={isPending || paymentState === 'processing'}
                sx={{ mt: 3.5, py: 1.6, fontSize: 16 }}
              >
                {paymentState === 'processing'
                  ? 'PROCESSING ORDER…'
                  : paymentMethod === 'paystack'
                  ? 'PAY NOW WITH PAYSTACK'
                  : 'CONFIRM ORDER'}
              </Button>

              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mt: 2.5, color: colors.grey[500] }}>
                <Lock size={15} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  256-Bit SSL Encrypted & Escrow Protected
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

