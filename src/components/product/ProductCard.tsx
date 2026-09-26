import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Box, Typography, IconButton, Button, Chip, Stack, Rating } from '@mui/material'
import { Heart, ShoppingCart, Eye, Check } from 'lucide-react'
import { colors } from '@/theme/theme'
import { formatNaira, discountPercent } from '@/lib/format'
import { useCart } from '@/context/CartContext'
import QuickViewModal from '@/components/product/QuickViewModal'
import type { Product } from '@/types'

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  const pct = discountPercent(product.price, product.compare_at_price)
  const outOfStock = product.stock_quantity <= 0
  const lowStock = product.stock_quantity > 0 && product.stock_quantity <= 3

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <>
      <Card
        variant="outlined"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderColor: colors.grey[200],
          borderRadius: 2,
          bgcolor: colors.white,
          transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered ? 'translateY(-6px)' : 'none',
          boxShadow: hovered ? '0 16px 32px -8px rgba(8, 8, 8, 0.12)' : '0 2px 8px rgba(8, 8, 8, 0.04)',
        }}
      >
        <Box sx={{ position: 'relative', bgcolor: colors.grey[50], aspectRatio: '1 / 1', overflow: 'hidden' }}>
          <Box
            component={Link}
            to={`/product/${product.slug}`}
            sx={{ display: 'block', width: '100%', height: '100%' }}
          >
            <Box
              component="img"
              src={product.images?.[0]?.url}
              alt={product.name}
              loading="lazy"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                transform: hovered ? 'scale(1.07)' : 'scale(1)',
                opacity: outOfStock ? 0.5 : 1,
              }}
            />
          </Box>

          <Stack sx={{ position: 'absolute', top: 12, left: 12 }} spacing={0.75}>
            {pct > 0 && (
              <Chip
                size="small"
                label={`-${pct}%`}
                sx={{ bgcolor: colors.red, color: colors.white, fontWeight: 800, fontSize: 11, height: 22 }}
              />
            )}
            {product.is_new && (
              <Chip
                size="small"
                label="NEW"
                sx={{ bgcolor: colors.black, color: colors.white, fontWeight: 800, fontSize: 11, height: 22 }}
              />
            )}
          </Stack>

          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault()
              setWishlisted((w) => !w)
            }}
            aria-label="Add to wishlist"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              '&:hover': { bgcolor: colors.white },
            }}
          >
            <Heart size={16} fill={wishlisted ? colors.red : 'none'} color={wishlisted ? colors.red : colors.black} />
          </IconButton>

          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault()
              setQuickViewOpen(true)
            }}
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              bgcolor: colors.white,
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.9)',
              transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
              '&:hover': { bgcolor: colors.black, color: colors.white },
            }}
            aria-label="Quick view"
          >
            <Eye size={16} />
          </IconButton>
        </Box>

        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {product.brand && (
            <Typography variant="caption" sx={{ color: colors.grey[400], fontWeight: 700, letterSpacing: '0.04em' }}>
              {product.brand.name.toUpperCase()}
            </Typography>
          )}
          <Typography
            component={Link}
            to={`/product/${product.slug}`}
            variant="body2"
            sx={{
              fontWeight: 700,
              color: colors.black,
              textDecoration: 'none',
              mb: 0.75,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.35,
              transition: 'color 150ms ease',
              '&:hover': { color: colors.red },
            }}
          >
            {product.name}
          </Typography>

          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
            <Rating value={product.rating_average} precision={0.5} size="small" readOnly />
            <Typography variant="caption" sx={{ color: colors.grey[400], fontWeight: 600 }}>
              ({product.rating_count})
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: lowStock || outOfStock ? 0.75 : 1.5, mt: 'auto' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.red, fontSize: 16 }}>
              {formatNaira(product.price)}
            </Typography>
            {!!product.compare_at_price && (
              <Typography variant="caption" sx={{ color: colors.grey[400], textDecoration: 'line-through' }}>
                {formatNaira(product.compare_at_price)}
              </Typography>
            )}
          </Stack>

          {outOfStock && (
            <Typography variant="caption" sx={{ color: colors.grey[400], fontWeight: 600, mb: 1 }}>
              Out of stock
            </Typography>
          )}
          {lowStock && (
            <Typography variant="caption" sx={{ color: colors.red, fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              • Only {product.stock_quantity} left in stock
            </Typography>
          )}

          <Button
            variant={outOfStock ? 'outlined' : added ? 'contained' : 'contained'}
            color={outOfStock ? 'inherit' : added ? 'primary' : 'secondary'}
            size="small"
            fullWidth
            disabled={outOfStock}
            startIcon={added ? <Check size={15} /> : <ShoppingCart size={15} />}
            sx={{
              mt: 'auto',
              py: 0.85,
              fontSize: 13,
              fontWeight: 700,
            }}
            onClick={handleAddToCart}
          >
            {outOfStock ? 'OUT OF STOCK' : added ? 'ADDED!' : 'ADD TO CART'}
          </Button>
        </Box>
      </Card>

      <QuickViewModal
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  )
}

