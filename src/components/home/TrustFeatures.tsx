import { Container, Grid, Stack, Typography, Box } from '@mui/material'
import { ShieldCheck, CreditCard, Truck, Headset } from 'lucide-react'
import { colors } from '@/theme/theme'

const FEATURES = [
  { icon: ShieldCheck, title: 'Authentic Products', subtitle: '100% genuine gadgets' },
  { icon: CreditCard, title: 'Secure Payment', subtitle: 'Safe and trusted checkout' },
  { icon: Truck, title: 'Fast Delivery', subtitle: 'Nationwide delivery' },
  { icon: Headset, title: 'Customer Support', subtitle: "We're here to help" },
]

export default function TrustFeatures() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
      <Grid container spacing={2}>
        {FEATURES.map(({ icon: Icon, title, subtitle }) => (
          <Grid item xs={6} md={3} key={title}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ p: 2, border: `1px solid ${colors.grey[200]}`, borderRadius: 2, height: '100%' }}
            >
              <Box
                sx={{
                  width: 40, height: 40, borderRadius: '50%', bgcolor: colors.grey[50],
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <Icon size={20} color={colors.red} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{title}</Typography>
                <Typography variant="caption" sx={{ color: colors.grey[400] }}>{subtitle}</Typography>
              </Box>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
