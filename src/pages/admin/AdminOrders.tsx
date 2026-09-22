import { useState } from 'react'
import {
  Typography, Table, TableHead, TableBody, TableRow, TableCell, Box, Chip, Select, MenuItem,
} from '@mui/material'
import { colors } from '@/theme/theme'
import { formatNaira } from '@/lib/format'
import type { OrderStatus } from '@/types'
import AdminLayout from './AdminLayout'

interface MockOrder {
  id: string
  customer: string
  amount: number
  paymentStatus: 'pending' | 'paid' | 'failed'
  status: OrderStatus
  date: string
}

const INITIAL_ORDERS: MockOrder[] = [
  { id: 'ORD-1042', customer: 'Amaka Nwosu', amount: 1350000, paymentStatus: 'paid', status: 'shipped', date: '2026-09-06' },
  { id: 'ORD-1041', customer: 'Tunde Okafor', amount: 195000, paymentStatus: 'paid', status: 'processing', date: '2026-09-05' },
  { id: 'ORD-1040', customer: 'Chiamaka Bello', amount: 620000, paymentStatus: 'paid', status: 'delivered', date: '2026-09-03' },
  { id: 'ORD-1039', customer: 'David Eze', amount: 42000, paymentStatus: 'pending', status: 'pending', date: '2026-09-02' },
  { id: 'ORD-1038', customer: 'Fatima Bello', amount: 850000, paymentStatus: 'failed', status: 'cancelled', date: '2026-09-01' },
]

const STATUS_COLORS: Record<OrderStatus, { bg: string; fg: string }> = {
  pending: { bg: colors.grey[100], fg: colors.grey[500] },
  paid: { bg: '#E7F6EC', fg: '#1D8A45' },
  processing: { bg: '#FFF4E5', fg: '#B26A00' },
  shipped: { bg: '#E8F0FE', fg: '#1A56DB' },
  delivered: { bg: '#E7F6EC', fg: '#1D8A45' },
  cancelled: { bg: '#FDEAEA', fg: colors.red },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState(INITIAL_ORDERS)

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  return (
    <AdminLayout>
      <Typography variant="h5" sx={{ mb: 3 }}>Orders</Typography>
      <Box sx={{ bgcolor: '#fff', borderRadius: 2, border: `1px solid ${colors.grey[200]}`, overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{o.id}</TableCell>
                <TableCell>{o.customer}</TableCell>
                <TableCell>{formatNaira(o.amount)}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={o.paymentStatus}
                    sx={{
                      textTransform: 'capitalize', fontWeight: 700,
                      bgcolor: o.paymentStatus === 'paid' ? '#E7F6EC' : o.paymentStatus === 'failed' ? '#FDEAEA' : colors.grey[100],
                      color: o.paymentStatus === 'paid' ? '#1D8A45' : o.paymentStatus === 'failed' ? colors.red : colors.grey[500],
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                    sx={{
                      textTransform: 'capitalize', fontWeight: 700, minWidth: 130,
                      bgcolor: STATUS_COLORS[o.status].bg, color: STATUS_COLORS[o.status].fg,
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    }}
                  >
                    {(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((s) => (
                      <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{o.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </AdminLayout>
  )
}
