import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Box, Stack, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { LayoutDashboard, Package, ShoppingBag, Boxes } from 'lucide-react'
import { colors } from '@/theme/theme'

const NAV = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
  { label: 'Inventory', to: '/admin/inventory', icon: Boxes },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <Stack direction="row" sx={{ minHeight: '100vh' }}>
      <Box sx={{ width: 240, bgcolor: colors.black, color: '#fff', flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
        <Typography variant="h6" sx={{ p: 3, fontWeight: 800 }}>
          OTL <Box component="span" sx={{ color: colors.red }}>ADMIN</Box>
        </Typography>
        <List>
          {NAV.map(({ label, to, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <ListItemButton
                key={to}
                component={Link}
                to={to}
                selected={active}
                sx={{
                  color: active ? colors.red : '#fff',
                  '&.Mui-selected': { bgcolor: 'rgba(227,28,37,0.12)' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}><Icon size={18} /></ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            )
          })}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1, bgcolor: colors.bg, p: { xs: 2, md: 4 } }}>{children}</Box>
    </Stack>
  )
}
