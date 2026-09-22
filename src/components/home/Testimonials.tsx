import { Container, Grid, Box, Typography, Avatar, Stack } from '@mui/material'
import { colors } from '@/theme/theme'

const TESTIMONIALS = [
  { name: 'Amaka N.', location: 'Lagos', quote: 'Ordered a phone and it arrived in two days, exactly as described. Very trustworthy.' },
  { name: 'Tunde O.', location: 'Abuja', quote: 'Great prices and the customer support team actually responds quickly on WhatsApp.' },
  { name: 'Chiamaka B.', location: 'Port Harcourt', quote: 'My go-to store for authentic gadgets now. Zero regrets buying my laptop here.' },
]

export default function Testimonials() {
  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography variant="overline" sx={{ color: colors.red, fontWeight: 700 }}>TESTIMONIAL</Typography>
      <Typography variant="h4" sx={{ mb: 4 }}>TRUSTWORTHY NIGERIAN SERVICE</Typography>
      <Grid container spacing={3}>
        {TESTIMONIALS.map((t) => (
          <Grid item xs={12} md={4} key={t.name}>
            <Box sx={{ p: 3, border: `1px solid ${colors.grey[200]}`, borderRadius: 2, height: '100%' }}>
              <Typography variant="body2" sx={{ color: colors.grey[600], mb: 2, fontStyle: 'italic' }}>
                “{t.quote}”
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: colors.grey[200], color: colors.black, fontWeight: 700 }}>
                  {t.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{t.name}</Typography>
                  <Typography variant="caption" sx={{ color: colors.grey[400] }}>{t.location}</Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
