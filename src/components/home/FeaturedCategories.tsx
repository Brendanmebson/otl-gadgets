import { Container, Grid, Box, Typography, Stack, Skeleton } from '@mui/material'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { colors } from '@/theme/theme'
import { useCategories } from '@/hooks/useProducts'

export default function FeaturedCategories() {
  const { data: categories, isLoading } = useCategories()

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="caption" sx={{ color: colors.red, fontWeight: 800, letterSpacing: '0.08em' }}>
            CURATED DEPARTMENTS
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: colors.black, mt: 0.5 }}>
            SHOP BY CATEGORY
          </Typography>
        </Box>
        <Typography
          component={Link}
          to="/shop"
          variant="body2"
          sx={{
            color: colors.red,
            fontWeight: 800,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            transition: 'gap 150ms ease',
            '&:hover': { gap: 1 },
          }}
        >
          View All Departments →
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Grid item xs={12} sm={6} md={idx === 0 ? 6 : 3} key={idx}>
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
              </Grid>
            ))
          : (categories ?? []).slice(0, 4).map((cat, idx) => {
              const isLarge = idx === 0 || idx === 3
              return (
                <Grid item xs={12} sm={6} md={isLarge ? 6 : 3} key={cat.id}>
                  <Box
                    component={Link}
                    to={`/shop?category=${cat.slug}`}
                    sx={{
                      display: 'block',
                      textDecoration: 'none',
                      position: 'relative',
                      borderRadius: 4,
                      overflow: 'hidden',
                      height: 230,
                      bgcolor: colors.grey[800],
                      transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px -12px rgba(8, 8, 8, 0.25)',
                        '& .cat-img': { transform: 'scale(1.08)' },
                        '& .cat-btn': { bgcolor: colors.red, color: colors.white, transform: 'translate(2px, -2px)' },
                      },
                    }}
                  >
                    <Box
                      className="cat-img"
                      component="img"
                      src={cat.image_url ?? undefined}
                      alt={cat.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.75,
                        transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        background: 'linear-gradient(to top, rgba(8, 8, 8, 0.88) 0%, rgba(8, 8, 8, 0.25) 60%, transparent 100%)',
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(8px)',
                            color: colors.white,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {cat.product_count} items
                        </Box>

                        <Box
                          className="cat-btn"
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            color: colors.black,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 200ms ease',
                          }}
                        >
                          <ArrowUpRight size={18} />
                        </Box>
                      </Stack>

                      <Box>
                        <Typography variant="h5" sx={{ color: colors.white, fontWeight: 800 }}>
                          {cat.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.grey[300], fontWeight: 500 }}>
                          Explore authentic {cat.name.toLowerCase()} collections
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              )
            })}
      </Grid>
    </Container>
  )
}

