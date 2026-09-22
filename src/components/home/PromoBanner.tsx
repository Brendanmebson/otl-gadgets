import { Container, Box, Grid, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { colors } from '@/theme/theme'

export default function PromoBanner() {
  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ bgcolor: colors.black, borderRadius: 3, overflow: 'hidden' }}>
        <Grid container alignItems="center">
          <Grid item xs={12} md={7} sx={{ p: { xs: 4, md: 6 } }}>
            <Typography variant="h4" sx={{ color: '#fff', mb: 1 }}>
              GADGET DEALS OF THE WEEK
            </Typography>
            <Typography variant="body1" sx={{ color: colors.grey[300], mb: 3 }}>
              Save up to 30% on selected gadgets — for a limited time only.
            </Typography>
            <Button component={Link} to="/shop?deals=1" variant="contained" color="secondary" size="large">
              SHOP DEALS
            </Button>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src="https://placehold.co/700x420/141414/ffffff?text=Featured+Deal"
              alt="Gadget deals of the week"
              sx={{ width: '100%', height: { xs: 200, md: 260 }, objectFit: 'cover', display: 'block' }}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
