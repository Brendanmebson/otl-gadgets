import { useState } from 'react'
import {
  Typography, Button, Table, TableHead, TableBody, TableRow, TableCell, Box, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton, Switch, FormControlLabel,
} from '@mui/material'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { colors } from '@/theme/theme'
import { formatNaira } from '@/lib/format'
import { mockProducts, withRelations } from '@/data/mockData'
import type { Product } from '@/types'
import AdminLayout from './AdminLayout'

// This page demonstrates the full admin workflow (add/edit/delete, images,
// price, stock, category, featured/new flags) against local mock state.
// Wire each handler to Supabase `products` / `product_images` tables +
// Storage bucket uploads to make it live — the shapes already match the
// schema in supabase/schema.sql.
export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(withRelations(mockProducts))
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const openNew = () => { setEditing(null); setDialogOpen(true) }
  const openEdit = (p: Product) => { setEditing(p); setDialogOpen(true) }

  const handleDelete = (id: string) => setProducts((prev) => prev.filter((p) => p.id !== id))

  const handleSave = (form: Partial<Product>) => {
    if (editing) {
      setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...form } : p)))
    } else {
      setProducts((prev) => [
        {
          id: `p${Date.now()}`,
          name: form.name ?? 'New Product',
          slug: (form.name ?? 'new-product').toLowerCase().replace(/\s+/g, '-'),
          description: form.description ?? '',
          brand_id: 'b1',
          category_id: 'c1',
          price: form.price ?? 0,
          compare_at_price: form.compare_at_price ?? null,
          stock_quantity: form.stock_quantity ?? 0,
          sku: `SKU-${Date.now()}`,
          is_featured: form.is_featured ?? false,
          is_new: form.is_new ?? true,
          is_active: true,
          rating_average: 0,
          rating_count: 0,
          images: [{ id: `img${Date.now()}`, product_id: '', url: 'https://placehold.co/700x700', position: 0 }],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Product,
        ...prev,
      ])
    }
    setDialogOpen(false)
  }

  return (
    <AdminLayout>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">Products</Typography>
        <Button variant="contained" color="secondary" startIcon={<Plus size={16} />} onClick={openNew}>
          Add Product
        </Button>
      </Stack>

      <Box sx={{ bgcolor: '#fff', borderRadius: 2, border: `1px solid ${colors.grey[200]}`, overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box component="img" src={p.images[0]?.url} sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{p.sku}</TableCell>
                <TableCell>{formatNaira(p.price)}</TableCell>
                <TableCell>{p.stock_quantity}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={p.is_active ? 'Active' : 'Draft'}
                    sx={{ bgcolor: p.is_active ? '#E7F6EC' : colors.grey[100], color: p.is_active ? '#1D8A45' : colors.grey[500], fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEdit(p)}><Pencil size={16} /></IconButton>
                  <IconButton size="small" onClick={() => handleDelete(p.id)}><Trash2 size={16} color={colors.red} /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <ProductDialog
        open={dialogOpen}
        product={editing}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </AdminLayout>
  )
}

function ProductDialog({
  open, product, onClose, onSave,
}: {
  open: boolean
  product: Product | null
  onClose: () => void
  onSave: (form: Partial<Product>) => void
}) {
  const [form, setForm] = useState<Partial<Product>>(product ?? {})

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" key={product?.id ?? 'new'}>
      <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Product Name" fullWidth defaultValue={product?.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <TextField label="Description" fullWidth multiline rows={3} defaultValue={product?.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <Stack direction="row" spacing={2}>
            <TextField label="Price (₦)" type="number" fullWidth defaultValue={product?.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
            <TextField label="Compare-at Price (₦)" type="number" fullWidth defaultValue={product?.compare_at_price ?? ''} onChange={(e) => setForm((f) => ({ ...f, compare_at_price: Number(e.target.value) }))} />
          </Stack>
          <TextField label="Stock Quantity" type="number" fullWidth defaultValue={product?.stock_quantity} onChange={(e) => setForm((f) => ({ ...f, stock_quantity: Number(e.target.value) }))} />
          <Stack direction="row" spacing={2}>
            <FormControlLabel control={<Switch defaultChecked={product?.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} />} label="Featured" />
            <FormControlLabel control={<Switch defaultChecked={product?.is_new} onChange={(e) => setForm((f) => ({ ...f, is_new: e.target.checked }))} />} label="New" />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="secondary" onClick={() => onSave(form)}>Save Product</Button>
      </DialogActions>
    </Dialog>
  )
}
