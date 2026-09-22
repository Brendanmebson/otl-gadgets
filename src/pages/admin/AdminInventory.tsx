import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Box, Chip } from '@mui/material'
import { colors } from '@/theme/theme'
import { formatNaira } from '@/lib/format'
import { mockProducts } from '@/data/mockData'
import AdminLayout from './AdminLayout'

function stockStatus(qty: number) {
  if (qty <= 0) return { label: 'Out of Stock', bg: '#FDEAEA', fg: colors.red }
  if (qty <= 3) return { label: 'Low Stock', bg: '#FFF4E5', fg: '#B26A00' }
  return { label: 'In Stock', bg: '#E7F6EC', fg: '#1D8A45' }
}

export default function AdminInventory() {
  return (
    <AdminLayout>
      <Typography variant="h5" sx={{ mb: 3 }}>Inventory</Typography>
      <Box sx={{ bgcolor: '#fff', borderRadius: 2, border: `1px solid ${colors.grey[200]}`, overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockProducts.map((p) => {
              const status = stockStatus(p.stock_quantity)
              return (
                <TableRow key={p.id} hover sx={{ bgcolor: p.stock_quantity <= 3 ? '#FFFBF5' : 'transparent' }}>
                  <TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
                  <TableCell>{p.sku}</TableCell>
                  <TableCell>{p.stock_quantity}</TableCell>
                  <TableCell>
                    <Chip size="small" label={status.label} sx={{ bgcolor: status.bg, color: status.fg, fontWeight: 700 }} />
                  </TableCell>
                  <TableCell>{formatNaira(p.price)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>
    </AdminLayout>
  )
}
