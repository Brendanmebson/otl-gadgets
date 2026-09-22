import { Box, Container, Grid, Typography, Stack, TextField, Button, IconButton, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Send } from 'lucide-react'
import { colors } from '@/theme/theme'

const columns = [
  {
    title: 'Categories',
    links: [
      { label: 'Phones & Tablets', to: '/shop?category=phones-tablets' },
      { label: 'Laptops', to: '/shop?category=laptops-computing' },
      { label: 'Audio & Gaming', to: '/shop?category=audio-gaming' },
      { label: 'Accessories', to: '/shop?category=accessories' },
      { label: 'Deals', to: '/shop?deals=1' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'FAQs', to: '/faqs' },
      { label: 'Delivery Information', to: '/delivery' },
      { label: 'Returns Policy', to: '/returns' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Support', to: '/contact' },
      { label: 'WhatsApp', to: '#' },
      { label: 'Email', to: 'mailto:support@otlgadgets.com' },
      { label: 'Phone', to: 'tel:+2348000009999' },
    ],
  },
]

export default function Footer() {
  return (
    <Box sx={{ bgcolor: colors.black, color: colors.white, pt: 8, pb: 4, mt: 10 }}>
      <Container maxWidth="xl">
        <Grid container spacing={5}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              OTL <Box component="span" sx={{ color: colors.red }}>GADGETS</Box>
            </Typography>
            <Typography variant="body2" sx={{ color: colors.grey[300] }}>
              Premium phones, laptops, audio and gaming gadgets — fast, reliable and trusted
              by shoppers across Nigeria.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <IconButton size="small" sx={{ color: colors.white, border: `1px solid ${colors.grey[600]}` }}><Instagram size={16} /></IconButton>
              <IconButton size="small" sx={{ color: colors.white, border: `1px solid ${colors.grey[600]}` }}><Facebook size={16} /></IconButton>
              <IconButton size="small" sx={{ color: colors.white, border: `1px solid ${colors.grey[600]}` }}><Twitter size={16} /></IconButton>
            </Stack>
          </Grid>

          {columns.map((col) => (
            <Grid item xs={6} md={2} key={col.title}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: colors.grey[300] }}>
                {col.title.toUpperCase()}
              </Typography>
              <Stack spacing={1.2}>
                {col.links.map((l) => (
                  <Typography
                    key={l.label}
                    component={Link}
                    to={l.to}
                    variant="body2"
                    sx={{ color: colors.grey[300], textDecoration: 'none', '&:hover': { color: colors.red } }}
                  >
                    {l.label}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          ))}

          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: colors.grey[300] }}>
              GET THE LATEST DEALS
            </Typography>
            <Typography variant="body2" sx={{ color: colors.grey[400], mb: 2 }}>
              Subscribe for new arrivals, exclusive offers and gadget deals.
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Enter your email"
                fullWidth
                sx={{
                  bgcolor: colors.grey[700], borderRadius: 1,
                  '& .MuiOutlinedInput-root': { color: colors.white, '& fieldset': { border: 'none' } },
                }}
              />
              <Button variant="contained" color="secondary" sx={{ minWidth: 44, px: 1.5 }}>
                <Send size={16} />
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: colors.grey[700], my: 4 }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
          <Typography variant="caption" sx={{ color: colors.grey[400] }}>
            © {new Date().getFullYear()} OTL Gadgets. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: colors.grey[400] }}>
            Secure payments powered by Paystack
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
