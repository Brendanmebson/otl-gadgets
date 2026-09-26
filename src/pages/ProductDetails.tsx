import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container, Grid, Box, Typography, Stack, Rating, Button, Divider,
  Chip, IconButton, Tabs, Tab, Skeleton, Paper, LinearProgress, Avatar, Dialog,
} from '@mui/material'
import { Heart, ShoppingCart, Minus, Plus, Truck, ShieldCheck, Check, Zap, Maximize2, X } from 'lucide-react'
import { colors } from '@/theme/theme'
import { formatNaira, discountPercent } from '@/lib/format'
import { useProduct } from '@/hooks/useProducts'
import { useCart } from '@/context/CartContext'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import EmptyState from '@/components/common/EmptyState'

const MOCK_REVIEWS = [
  { id: '1', author: 'Chidiebere O.', date: '2 days ago', rating: 5, text: 'Super fast delivery to Ikeja! The phone came 100% factory sealed with valid Apple warranty.' },
  { id: '2', author: 'Amina B.', date: '1 week ago', rating: 5, text: 'Genuine product. Payment on delivery made me feel completely secure purchasing online.' },
  { id: '3', author: 'Tunde A.', date: '2 weeks ago', rating: 4.5, text: 'Clean packaging and excellent customer service response. Highly recommend OTL Gadgets.' },
]

export default function ProductDetails() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(slug)
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [tab, setTab] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [added, setAdded] = useState(false)

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={480} sx={{ borderRadius: 2 }} /></Grid>
          <Grid item xs={12} md={6}>
            <Skeleton width="30%" height={24} />
            <Skeleton width="85%" height={44} sx={{ my: 1 }} />
            <Skeleton width="40%" height={36} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  if (!product) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <EmptyState title="Product not found" subtitle="This product may have been removed or is no longer available." />
      </Container>
    )
  }

  const pct = discountPercent(product.price, product.compare_at_price)
  const outOfStock = product.stock_quantity <= 0
  const images = product.images?.length ? product.images : [{ id: 'ph', product_id: product.id, url: 'https://placehold.co/700x700', position: 0 }]

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/checkout')
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: product.category?.name ?? 'Catalogue', to: `/shop?category=${product.category?.slug}` },
          { label: product.name },
        ]}
      />

      <Grid container spacing={5} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', bgcolor: colors.grey[50], borderRadius: 2, aspectRatio: '1 / 1', overflow: 'hidden', mb: 2, border: `1px solid ${colors.grey[200]}` }}>
            <Box
              component="img"
              src={images[activeImage]?.url}
              alt={product.name}
              sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
            <IconButton
              onClick={() => setLightboxOpen(true)}
              sx={{ position: 'absolute', bottom: 12, right: 12, bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
            >
              <Maximize2 size={18} />
            </IconButton>
          </Box>
          {images.length > 1 && (
            <Stack direction="row" spacing={1.5}>
              {images.map((img, idx) => (
                <Box
                  key={img.id}
                  component="img"
                  src={img.url}
                  onClick={() => setActiveImage(idx)}
                  sx={{
                    width: 72,
                    height: 72,
                    objectFit: 'cover',
                    borderRadius: 2.5,
                    cursor: 'pointer',
                    border: idx === activeImage ? `2px solid ${colors.red}` : `1px solid ${colors.grey[200]}`,
                    transition: 'all 150ms ease',
                    opacity: idx === activeImage ? 1 : 0.7,
                  }}
                />
              ))}
            </Stack>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={2.5}>
            <Box>
              {product.brand && (
                <Typography variant="caption" sx={{ color: colors.red, fontWeight: 800, letterSpacing: '0.08em' }}>
                  {product.brand.name.toUpperCase()}
                </Typography>
              )}
              <Typography variant="h3" sx={{ mt: 0.5, fontWeight: 800, color: colors.black, lineHeight: 1.15 }}>
                {product.name}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Rating value={product.rating_average} precision={0.5} readOnly size="small" />
              <Typography variant="body2" sx={{ fontWeight: 700, color: colors.black }}>
                {product.rating_average}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                ({product.rating_count} verified reviews)
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="baseline">
              <Typography variant="h3" sx={{ color: colors.red, fontWeight: 800 }}>
                {formatNaira(product.price)}
              </Typography>
              {!!product.compare_at_price && (
                <>
                  <Typography variant="h5" sx={{ color: colors.grey[400], textDecoration: 'line-through' }}>
                    {formatNaira(product.compare_at_price)}
                  </Typography>
                  <Chip label={`SAVE ${pct}%`} sx={{ bgcolor: colors.red, color: colors.white, fontWeight: 800, fontSize: 12 }} />
                </>
              )}
            </Stack>

            <Typography variant="body2" sx={{ color: outOfStock ? colors.grey[400] : colors.grey[700], fontWeight: 600 }}>
              {outOfStock ? 'Out of stock' : product.stock_quantity <= 3 ? `🔥 Only ${product.stock_quantity} left in stock - order soon` : '✓ In stock (Ready for immediate dispatch)'}
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" alignItems="center" sx={{ border: `1.5px solid ${colors.grey[200]}`, borderRadius: 2.5, px: 1, py: 0.5 }}>
                <IconButton size="small" onClick={() => setQuantity((q) => Math.max(1, q - 1))}><Minus size={16} /></IconButton>
                <Typography sx={{ px: 2, fontWeight: 800 }}>{quantity}</Typography>
                <IconButton size="small" onClick={() => setQuantity((q) => Math.min(product.stock_quantity || 99, q + 1))}><Plus size={16} /></IconButton>
              </Stack>
              <IconButton
                onClick={() => setWishlisted((w) => !w)}
                sx={{ border: `1.5px solid ${colors.grey[200]}`, borderRadius: 2.5, p: 1.25 }}
                aria-label="Wishlist"
              >
                <Heart size={20} fill={wishlisted ? colors.red : 'none'} color={wishlisted ? colors.red : colors.black} />
              </IconButton>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
              <Button
                variant={added ? 'contained' : 'outlined'}
                color={added ? 'primary' : 'inherit'}
                size="large"
                fullWidth
                disabled={outOfStock}
                startIcon={added ? <Check size={18} /> : <ShoppingCart size={18} />}
                sx={{ borderColor: colors.black, color: added ? colors.white : colors.black, py: 1.5 }}
                onClick={handleAddToCart}
              >
                {added ? 'ADDED TO CART!' : 'ADD TO CART'}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                disabled={outOfStock}
                startIcon={<Zap size={18} />}
                sx={{ py: 1.5 }}
                onClick={handleBuyNow}
              >
                BUY NOW WITH PAY ON DELIVERY
              </Button>
            </Stack>

            <Stack spacing={1.5} sx={{ p: 2.5, bgcolor: colors.grey[50], borderRadius: 2, border: `1px solid ${colors.grey[200]}` }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Truck size={20} color={colors.red} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Express Nationwide Delivery</Typography>
                  <Typography variant="caption" sx={{ color: colors.grey[500] }}>Lagos: 24 Hours • Other States: 48-72 Hours</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <ShieldCheck size={20} color={colors.red} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>100% Original Brand Guarantee</Typography>
                  <Typography variant="caption" sx={{ color: colors.grey[500] }}>Includes 1-Year Official Manufacturer Warranty</Typography>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        textColor="secondary"
        indicatorColor="secondary"
        sx={{ borderBottom: `1px solid ${colors.grey[200]}`, mb: 4 }}
      >
        <Tab label="Full Description" sx={{ fontWeight: 700, fontSize: 15 }} />
        <Tab label="Specifications Grid" sx={{ fontWeight: 700, fontSize: 15 }} />
        <Tab label={`Customer Reviews (${product.rating_count})`} sx={{ fontWeight: 700, fontSize: 15 }} />
      </Tabs>

      <Box sx={{ pb: 6 }}>
        {tab === 0 && (
          <Box sx={{ maxWidth: 800 }}>
            <Typography variant="body1" sx={{ color: colors.grey[700], lineHeight: 1.8, fontSize: 16 }}>
              {product.description}
            </Typography>
          </Box>
        )}

        {/* 2-Column Spec Card Grid per 23._Taste.md §4.9 */}
        {tab === 1 && (
          <Grid container spacing={2} sx={{ maxWidth: 900 }}>
            {Object.entries(product.specifications ?? {}).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: `1px solid ${colors.grey[200]}`,
                    bgcolor: colors.grey[50],
                    height: '100%',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 800, color: colors.grey[400], letterSpacing: '0.05em', display: 'block', mb: 0.5 }}>
                    {key.toUpperCase()}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: colors.black }}>
                    {value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {tab === 2 && (
          <Box sx={{ maxWidth: 840 }}>
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: colors.grey[50], border: `1px solid ${colors.grey[200]}`, textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: colors.black }}>
                    {product.rating_average}
                  </Typography>
                  <Rating value={product.rating_average} precision={0.5} readOnly sx={{ my: 1 }} />
                  <Typography variant="caption" sx={{ color: colors.grey[500], display: 'block' }}>
                    Based on {product.rating_count} verified buyer ratings
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={8}>
                <Stack spacing={1.5} justifyContent="center" height="100%">
                  {[5, 4, 3, 2, 1].map((stars, idx) => (
                    <Stack direction="row" spacing={2} alignItems="center" key={stars}>
                      <Typography variant="caption" sx={{ fontWeight: 700, width: 40 }}>{stars}★</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={idx === 0 ? 85 : idx === 1 ? 12 : 3}
                        color="secondary"
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" sx={{ color: colors.grey[400], width: 30 }}>
                        {idx === 0 ? '85%' : idx === 1 ? '12%' : '3%'}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Grid>
            </Grid>

            <Stack spacing={2}>
              {MOCK_REVIEWS.map((rev) => (
                <Paper key={rev.id} elevation={0} sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${colors.grey[200]}` }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: colors.black, width: 32, height: 32, fontSize: 13, fontWeight: 700 }}>
                        {rev.author[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{rev.author}</Typography>
                        <Rating value={rev.rating} precision={0.5} size="small" readOnly />
                      </Box>
                    </Stack>
                    <Typography variant="caption" sx={{ color: colors.grey[400] }}>{rev.date}</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: colors.grey[700] }}>{rev.text}</Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Image Lightbox Dialog */}
      <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)} maxWidth="md" fullWidth>
        <Box sx={{ position: 'relative', bgcolor: colors.black, p: 3, textAlign: 'center' }}>
          <IconButton onClick={() => setLightboxOpen(false)} sx={{ position: 'absolute', top: 12, right: 12, color: colors.white }}>
            <X size={24} />
          </IconButton>
          <Box
            component="img"
            src={images[activeImage]?.url}
            alt={product.name}
            sx={{ maxHeight: '75vh', maxWidth: '100%', objectFit: 'contain' }}
          />
        </Box>
      </Dialog>
    </Container>
  )
}

