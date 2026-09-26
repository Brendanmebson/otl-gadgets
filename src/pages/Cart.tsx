import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Grid, Box, Typography, Stack, IconButton, Button, Divider, LinearProgress, Paper, InputBase, Chip } from '@mui/material'
import { Minus, Plus, Trash2, Truck, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react'
import { colors } from '@/theme/theme'
import { formatNaira } from '@/lib/format'
import { useCart } from '@/context/CartContext'
import EmptyState from '@/components/common/EmptyState'

const FREE_SHIPPING_THRESHOLD = 300000
const BASE_DELIVERY_FEE = 3500

export default function Cart() {
  const { items, setQuantity, removeFromCart, subtotal } = useCart()
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <EmptyState
          title="Your cart is empty"
          subtitle="Browse our catalogue and explore authentic tech gadgets with nationwide delivery."
          actionLabel="Explore Gadget Catalogue"
          onAction={() => navigate('/shop')}
        />
      </Container>
    )
  }

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  const deliveryFee = isFreeShipping ? 0 : BASE_DELIVERY_FEE
  const progressPct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const discountAmount = discountApplied ? Math.round(subtotal * 0.05) : 0
  const total = subtotal + deliveryFee - discountAmount

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (promoCode.trim().toUpperCase() === 'OTL5') {
      setDiscountApplied(true)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 800, color: colors.black, mb: 3 }}>
        SHOPPING CART ({items.length})
      </Typography>

      {/* Free Shipping Progress Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 4,
          borderRadius: 2,
          bgcolor: isFreeShipping ? 'rgba(227, 28, 37, 0.06)' : colors.grey[50],
          border: `1.5px dashed ${isFreeShipping ? colors.red : colors.grey[300]}`,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Truck size={20} color={colors.red} />
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: colors.black }}>
            {isFreeShipping
              ? '🎉 Congratulations! You have unlocked FREE Nationwide Delivery!'
              : `Add ${formatNaira(amountNeeded)} more to qualify for FREE Nationwide Delivery`}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progressPct}
          color="secondary"
          sx={{ height: 8, borderRadius: 4, bgcolor: colors.grey[200] }}
        />
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {items.map(({ product, quantity }) => (
              <Paper
                key={product.id}
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  border: `1px solid ${colors.grey[200]}`,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 2,
                }}
              >
                <Box
                  component={Link}
                  to={`/product/${product.slug}`}
                  sx={{ width: { xs: 70, sm: 90 }, height: { xs: 70, sm: 90 }, bgcolor: colors.grey[50], borderRadius: 1.5, flexShrink: 0, overflow: 'hidden' }}
                >
                  <Box component="img" src={product.images?.[0]?.url} alt={product.name} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography component={Link} to={`/product/${product.slug}`} variant="subtitle1" sx={{ fontWeight: 800, textDecoration: 'none', color: colors.black }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.red, fontWeight: 800, mt: 0.5 }}>
                    {formatNaira(product.price)}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent={{ xs: 'space-between', sm: 'flex-start' }}
                  sx={{ border: `1.5px solid ${colors.grey[200]}`, borderRadius: 2, px: 0.5, width: { xs: '100%', sm: 'auto' } }}
                >
                  <IconButton size="small" onClick={() => setQuantity(product.id, quantity - 1)}><Minus size={14} /></IconButton>
                  <Typography sx={{ px: 1.5, fontWeight: 800 }}>{quantity}</Typography>
                  <IconButton size="small" onClick={() => setQuantity(product.id, quantity + 1)}><Plus size={14} /></IconButton>
                </Stack>

                <Stack
                  direction={{ xs: 'row', sm: 'row' }}
                  justifyContent={{ xs: 'space-between', sm: 'flex-start' }}
                  alignItems="center"
                  spacing={1}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                <Typography sx={{ width: { xs: 'auto', sm: 110 }, textAlign: 'right', fontWeight: 800, color: colors.black, fontSize: 16 }}>
                  {formatNaira(product.price * quantity)}
                </Typography>

                <IconButton onClick={() => removeFromCart(product.id)} aria-label="Remove item">
                  <Trash2 size={18} color={colors.grey[400]} />
                </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>

          {/* Promo code bar */}
          <Paper elevation={0} sx={{ mt: 3, p: 2, border: `1px solid ${colors.grey[200]}`, borderRadius: 2 }}>
            <Box component="form" onSubmit={handleApplyPromo} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Tag size={18} color={colors.grey[500]} />
              <InputBase
                placeholder="Enter promo code (Try: OTL5)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                sx={{ flex: 1, fontSize: 14, fontWeight: 600 }}
              />
              <Button type="submit" variant="outlined" color="primary" size="small" sx={{ borderRadius: 2 }}>
                APPLY CODE
              </Button>
            </Box>
            {discountApplied && (
              <Chip
                label="✓ 5% Special Discount Applied"
                color="secondary"
                size="small"
                sx={{ mt: 1.5, fontWeight: 800 }}
              />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.grey[200]}`, borderRadius: 2, position: 'sticky', top: 90 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>ORDER SUMMARY</Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: colors.grey[600] }}>Subtotal</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatNaira(subtotal)}</Typography>
              </Stack>

              {discountApplied && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: colors.red }}>Discount (5% OFF)</Typography>
                  <Typography variant="body2" sx={{ color: colors.red, fontWeight: 800 }}>-{formatNaira(discountAmount)}</Typography>
                </Stack>
              )}

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: colors.grey[600] }}>Estimated Delivery Fee</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: isFreeShipping ? colors.red : colors.black }}>
                  {isFreeShipping ? 'FREE' : formatNaira(BASE_DELIVERY_FEE)}
                </Typography>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: colors.red }}>{formatNaira(total)}</Typography>
              </Stack>
            </Stack>

            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<ArrowRight size={18} />}
              sx={{ mt: 3, py: 1.5, fontSize: 15 }}
              onClick={() => navigate('/checkout')}
            >
              PROCEED TO CHECKOUT
            </Button>

            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mt: 2.5, color: colors.grey[500] }}>
              <ShieldCheck size={16} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Escrow Protected • Pay on Delivery
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

