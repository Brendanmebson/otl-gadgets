import { Container, Grid, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { colors } from '@/theme/theme'
import ProductCard from '@/components/product/ProductCard'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton'
import type { Product } from '@/types'

interface Props {
  title: string
  viewAllHref?: string
  products?: Product[]
  isLoading?: boolean
}

export default function ProductRowSection({ title, viewAllHref, products, isLoading }: Props) {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">{title}</Typography>
        {viewAllHref && (
          <Typography component={Link} to={viewAllHref} variant="body2" sx={{ color: colors.red, fontWeight: 700, textDecoration: 'none' }}>
            View All →
          </Typography>
        )}
      </Stack>

      <Grid container spacing={2}>
        {(isLoading ? Array.from({ length: 4 }) : products ?? []).map((p: any, idx: number) => (
          <Grid item xs={6} sm={6} md={3} key={p?.id ?? idx}>
            {p ? <ProductCard product={p} /> : <ProductCardSkeleton />}
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
