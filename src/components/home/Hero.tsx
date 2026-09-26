import { Box, Container, Grid, Typography, Button, Stack, Chip } from '@mui/material'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react'
import { colors } from '@/theme/theme'

export default function Hero() {
  return (
    <Box
      sx={{
        bgcolor: colors.bg,
        overflow: 'hidden',
        position: 'relative',
        py: { xs: 6, md: 8 },
        borderBottom: `1px solid ${colors.grey[200]}`,
        background: `radial-gradient(circle at 80% 20%, rgba(227, 28, 37, 0.04) 0%, transparent 50%), ${colors.bg}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container alignItems="center" spacing={4} sx={{ minHeight: { xs: 'auto', md: 540 } }}>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                icon={<Zap size={14} color={colors.red} />}
                label="NATIONWIDE 24-48H DISPATCH"
                size="small"
                sx={{
                  bgcolor: 'rgba(227, 28, 37, 0.08)',
                  color: colors.red,
                  fontWeight: 800,
                  fontSize: 11,
                  letterSpacing: '0.05em',
                  borderRadius: 2,
                  px: 0.5,
                }}
              />
            </Stack>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 36, sm: 48, md: 56, lg: 62 },
                lineHeight: 1.08,
                mb: 2.5,
                color: colors.black,
                fontWeight: 800,
              }}
            >
              PREMIUM GADGETS.<br />
              <Box component="span" sx={{ color: colors.red }}>AUTHENTIC & FAST</Box> IN NIGERIA.
            </Typography>

            <Typography variant="body1" sx={{ color: colors.grey[600], mb: 4, maxWidth: 500, fontSize: { xs: 15, md: 17 }, lineHeight: 1.6 }}>
              Shop 100% factory-sealed iPhones, MacBooks, gaming rigs & accessories. Pay on delivery with official nationwide warranty.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
              <Button
                component={Link}
                to="/shop?deals=1"
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowRight size={18} />}
                sx={{ py: 1.5, px: 3.5, fontSize: 15 }}
              >
                SHOP LATEST RELEASES
              </Button>
              <Button
                component={Link}
                to="/shop"
                variant="outlined"
                size="large"
                sx={{ borderColor: colors.black, color: colors.black, py: 1.5, px: 3.5, fontSize: 15 }}
              >
                EXPLORE CATALOGUE
              </Button>
            </Stack>

            <Stack direction="row" spacing={3} alignItems="center" sx={{ pt: 1, borderTop: `1px solid ${colors.grey[200]}` }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <ShieldCheck size={18} color={colors.red} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: colors.grey[700] }}>
                  100% Authentic Brand Warranty
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Award size={18} color={colors.red} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: colors.grey[700] }}>
                  Pay on Delivery Available
                </Typography>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: 280, sm: 360, md: 500 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: '85%',
                  height: '85%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(227,28,37,0.12) 0%, rgba(255,255,255,0) 70%)',
                  filter: 'blur(30px)',
                }}
              />
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop"
                alt="Featured Apple iPhone 16 Pro Max and flagship gadgets"
                sx={{
                  position: 'relative',
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 24px 36px rgba(8, 8, 8, 0.20))',
                  borderRadius: 2,
                  transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': { transform: 'scale(1.03) translateY(-4px)' },
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 24,
                  left: { xs: 10, sm: 30 },
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(12px)',
                  p: 2,
                  borderRadius: 2,
                  boxShadow: '0 12px 28px rgba(8,8,8,0.12)',
                  border: `1px solid ${colors.grey[200]}`,
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    bgcolor: colors.redGlow,
                    color: colors.red,
                    p: 1,
                    borderRadius: 2,
                    display: 'flex',
                  }}
                >
                  <Zap size={20} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: colors.black }}>
                    Flash Sale Live!
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.grey[500] }}>
                    Up to 25% OFF on flagship smartphones
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

