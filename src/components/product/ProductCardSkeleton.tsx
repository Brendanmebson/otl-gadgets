import { Card, Box, Skeleton } from '@mui/material'

export default function ProductCardSkeleton() {
  return (
    <Card variant="outlined">
      <Skeleton variant="rectangular" sx={{ aspectRatio: '1 / 1', width: '100%' }} />
      <Box sx={{ p: 1.75 }}>
        <Skeleton width="40%" height={16} />
        <Skeleton width="90%" height={20} sx={{ my: 0.5 }} />
        <Skeleton width="60%" height={16} />
        <Skeleton width="50%" height={24} sx={{ my: 1 }} />
        <Skeleton variant="rectangular" height={34} sx={{ borderRadius: 1 }} />
      </Box>
    </Card>
  )
}
