import { Grid, Box, Typography, Stack } from '@mui/material'
import { DollarSign, ShoppingBag, Package, Users, AlertTriangle } from 'lucide-react'
import { colors } from '@/theme/theme'
import { formatNaira } from '@/lib/format'
import { mockProducts } from '@/data/mockData'
import AdminLayout from './AdminLayout'

const lowStock = mockProducts.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 3)

const STATS = [
  { label: 'Total Sales', value: formatNaira(8_450_000), icon: DollarSign },
  { label: 'Orders', value: '164', icon: ShoppingBag },
  { label: 'Products', value: String(mockProducts.length), icon: Package },
  { label: 'Customers', value: '312', icon: Users },
  { label: 'Low Stock', value: String(lowStock.length), icon: AlertTriangle },
]

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Typography variant="h5" sx={{ mb: 3 }}>Dashboard</Typography>
      <Grid container spacing={2}>
        {STATS.map(({ label, value, icon: Icon }) => (
          <Grid item xs={6} md={2.4} key={label}>
            <Box sx={{ p: 2.5, bgcolor: '#fff', borderRadius: 2, border: `1px solid ${colors.grey[200]}` }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" sx={{ color: colors.grey[400] }}>{label}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{value}</Typography>
                </Box>
                <Icon size={18} color={colors.red} />
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>

      {lowStock.length > 0 && (
        <Box sx={{ mt: 4, p: 2.5, bgcolor: '#fff', borderRadius: 2, border: `1px solid ${colors.grey[200]}` }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>Low Stock Alerts</Typography>
          <Stack spacing={1}>
            {lowStock.map((p) => (
              <Stack key={p.id} direction="row" justifyContent="space-between">
                <Typography variant="body2">{p.name}</Typography>
                <Typography variant="body2" sx={{ color: colors.red, fontWeight: 700 }}>{p.stock_quantity} left</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
    </AdminLayout>
  )
}
