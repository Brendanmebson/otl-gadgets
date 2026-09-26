import { useState } from 'react'
import { Dialog, Box, Grid, Typography, Stack, Rating, Button, Chip, IconButton, Table, TableBody, TableRow, TableCell } from '@mui/material'
import { X, ShoppingCart, Heart, Truck, Check } from 'lucide-react'
import { colors } from '@/theme/theme'
import { formatNaira, discountPercent } from '@/lib/format'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/types'

interface QuickViewModalProps {
  product: Product | null
  open: boolean
  onClose: () => void
}

export default function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const [activeImg, setActiveImg] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  if (!product) return null

  const pct = discountPercent(product.price, product.compare_at_price)
  const outOfStock = product.stock_quantity <= 0
  const images = product.images?.length ? product.images : [{ id: 'ph', product_id: product.id, url: 'https://placehold.co/600x600', position: 0 }]

  const handleAddToCart = () => {
    addToCart(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          p: 0,
        },
      }}
    >
      <Box sx={{ position: 'relative', p: { xs: 2.5, md: 4 } }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 16, right: 16, bgcolor: colors.grey[100], '&:hover': { bgcolor: colors.grey[200] }, zIndex: 1 }}
        >
          <X size={20} />
        </IconButton>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: colors.grey[50], borderRadius: 2, aspectRatio: '1 / 1', overflow: 'hidden', mb: 1.5 }}>
              <Box
                component="img"
                src={images[activeImg]?.url}
                alt={product.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            {images.length > 1 && (
              <Stack direction="row" spacing={1}>
                {images.map((img, idx) => (
                  <Box
                    key={img.id}
                    component="img"
                    src={img.url}
                    onClick={() => setActiveImg(idx)}
                    sx={{
                      width: 54, height: 54, objectFit: 'cover', borderRadius: 1, cursor: 'pointer',
                      border: idx === activeImg ? `2px solid ${colors.red}` : `1px solid ${colors.grey[200]}`,
                    }}
                  />
                ))}
              </Stack>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box>
                {product.brand && (
                  <Typography variant="caption" sx={{ color: colors.grey[400], fontWeight: 700, letterSpacing: '0.05em' }}>
                    {product.brand.name.toUpperCase()}
                  </Typography>
                )}
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: colors.black }}>
                  {product.name}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Rating value={product.rating_average} precision={0.5} readOnly size="small" />
                <Typography variant="caption" sx={{ color: colors.grey[500], fontWeight: 600 }}>
                  ({product.rating_count} reviews)
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="baseline">
                <Typography variant="h4" sx={{ color: colors.red, fontWeight: 800 }}>
                  {formatNaira(product.price)}
                </Typography>
                {!!product.compare_at_price && (
                  <>
                    <Typography variant="body1" sx={{ color: colors.grey[400], textDecoration: 'line-through' }}>
                      {formatNaira(product.compare_at_price)}
                    </Typography>
                    <Chip size="small" label={`${pct}% OFF`} sx={{ bgcolor: colors.red, color: '#fff', fontWeight: 800 }} />
                  </>
                )}
              </Stack>

              <Typography variant="body2" sx={{ color: colors.grey[600], display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {product.description}
              </Typography>

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <Table size="small">
                  <TableBody>
                    {Object.entries(product.specifications).slice(0, 3).map(([key, val]) => (
                      <TableRow key={key}>
                        <TableCell sx={{ fontWeight: 700, border: 0, p: 0.5, pl: 0, fontSize: 12, color: colors.grey[600] }}>
                          {key}:
                        </TableCell>
                        <TableCell sx={{ border: 0, p: 0.5, fontSize: 12, color: colors.black, fontWeight: 600 }}>
                          {val}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
                <Button
                  variant="contained"
                  color={added ? 'primary' : 'secondary'}
                  size="large"
                  fullWidth
                  disabled={outOfStock}
                  startIcon={added ? <Check size={18} /> : <ShoppingCart size={18} />}
                  onClick={handleAddToCart}
                >
                  {added ? 'ADDED TO CART!' : 'ADD TO CART'}
                </Button>
                <IconButton
                  onClick={() => setWishlisted((w) => !w)}
                  sx={{ border: `1.5px solid ${colors.grey[200]}`, borderRadius: 2.5, px: 1.5 }}
                >
                  <Heart size={20} fill={wishlisted ? colors.red : 'none'} color={wishlisted ? colors.red : colors.black} />
                </IconButton>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1.5, bgcolor: colors.grey[50], borderRadius: 1.5 }}>
                <Truck size={18} color={colors.grey[500]} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: colors.grey[600] }}>
                  Express 24-48h Delivery in Nigeria • Pay on Delivery available
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  )
}
