import { Box, Typography, Button } from '@mui/material'
import { PackageSearch } from 'lucide-react'
import { colors } from '@/theme/theme'

interface Props {
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ title, subtitle, actionLabel, onAction }: Props) {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <PackageSearch size={40} color={colors.grey[300]} />
      <Typography variant="h6" sx={{ mt: 2 }}>{title}</Typography>
      {subtitle && <Typography variant="body2" sx={{ color: colors.grey[400], mt: 0.5 }}>{subtitle}</Typography>}
      {actionLabel && onAction && (
        <Button variant="contained" color="secondary" sx={{ mt: 3 }} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}
