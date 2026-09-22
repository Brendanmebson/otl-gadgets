import { Link } from 'react-router-dom'
import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material'
import { colors } from '@/theme/theme'

interface Crumb {
  label: string
  to?: string
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <MuiBreadcrumbs separator="/" sx={{ fontSize: 13, color: colors.grey[400], mb: 2 }}>
      {items.map((item, idx) =>
        item.to ? (
          <Typography
            key={idx}
            component={Link}
            to={item.to}
            variant="caption"
            sx={{ color: colors.grey[400], textDecoration: 'none', '&:hover': { color: colors.red } }}
          >
            {item.label}
          </Typography>
        ) : (
          <Typography key={idx} variant="caption" sx={{ color: colors.black, fontWeight: 600 }}>
            {item.label}
          </Typography>
        )
      )}
    </MuiBreadcrumbs>
  )
}
