import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog, Box, InputBase, Typography, Stack, Chip, Divider, IconButton,
} from '@mui/material'
import { Search, X, TrendingUp, ChevronRight, ArrowRight } from 'lucide-react'
import { colors } from '@/theme/theme'
import { useProducts } from '@/hooks/useProducts'
import { formatNaira } from '@/lib/format'

interface QuickSearchModalProps {
  open: boolean
  onClose: () => void
}

const POPULAR_SEARCHES = [
  'iPhone 16 Pro',
  'MacBook Pro',
  'AirPods Pro 2',
  'PlayStation 5',
  'Samsung Galaxy S24',
]

export default function QuickSearchModal({ open, onClose }: QuickSearchModalProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { data } = useProducts({ search: query, pageSize: 5 })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (open) onClose()
        else setQuery('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const handleSelectProduct = (slug: string) => {
    onClose()
    setQuery('')
    navigate(`/product/${slug}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onClose()
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  const handleTagClick = (term: string) => {
    onClose()
    navigate(`/shop?search=${encodeURIComponent(term)}`)
    setQuery('')
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          top: -40,
          boxShadow: '0 24px 48px rgba(8, 8, 8, 0.25)',
          overflow: 'hidden',
          bgcolor: colors.white,
        },
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: `1px solid ${colors.grey[100]}` }}>
        <Search size={22} color={colors.red} style={{ marginLeft: 8 }} />
        <InputBase
          autoFocus
          placeholder="Search products, brands, or categories... (Press ↵)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ ml: 1.5, flex: 1, fontSize: 16, fontWeight: 500 }}
        />
        {query ? (
          <IconButton size="small" onClick={() => setQuery('')}>
            <X size={18} />
          </IconButton>
        ) : (
          <Chip label="ESC" size="small" variant="outlined" sx={{ borderRadius: 1.5, fontSize: 11, fontWeight: 700 }} />
        )}
      </Box>

      <Box sx={{ p: 2.5, maxHeight: 420, overflowY: 'auto' }}>
        {query.trim() === '' ? (
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <TrendingUp size={16} color={colors.grey[500]} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: colors.grey[500], letterSpacing: '0.05em' }}>
                POPULAR SEARCHES
              </Typography>
            </Stack>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {POPULAR_SEARCHES.map((term) => (
                <Chip
                  key={term}
                  label={term}
                  onClick={() => handleTagClick(term)}
                  clickable
                  sx={{
                    bgcolor: colors.grey[50],
                    border: `1px solid ${colors.grey[200]}`,
                    fontWeight: 600,
                    fontSize: 13,
                    '&:hover': { bgcolor: colors.grey[100] },
                  }}
                />
              ))}
            </Stack>
          </Box>
        ) : (
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: colors.grey[400], mb: 1, display: 'block' }}>
              PRODUCTS ({data?.items.length ?? 0})
            </Typography>

            {data?.items.length === 0 ? (
              <Typography variant="body2" sx={{ color: colors.grey[500], py: 3, textAlign: 'center' }}>
                No gadgets found matching "{query}".
              </Typography>
            ) : (
              <Stack spacing={1}>
                {data?.items.map((product) => (
                  <Stack
                    key={product.id}
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    onClick={() => handleSelectProduct(product.slug)}
                    sx={{
                      p: 1.25,
                      borderRadius: 2.5,
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                      '&:hover': { bgcolor: colors.grey[50], transform: 'translateX(4px)' },
                    }}
                  >
                    <Box
                      component="img"
                      src={product.images?.[0]?.url}
                      alt={product.name}
                      sx={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 2, bgcolor: colors.grey[100] }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: colors.black }}>
                        {product.name}
                      </Typography>
                      {product.brand && (
                        <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                          {product.brand.name}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: colors.red }}>
                      {formatNaira(product.price)}
                    </Typography>
                    <ChevronRight size={18} color={colors.grey[400]} />
                  </Stack>
                ))}
              </Stack>
            )}

            {query.trim().length > 0 && (
              <Box
                onClick={handleSubmit}
                sx={{
                  mt: 2,
                  pt: 1.5,
                  borderTop: `1px solid ${colors.grey[100]}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  color: colors.red,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                See all results for "{query}"
                <ArrowRight size={16} />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Dialog>
  )
}
