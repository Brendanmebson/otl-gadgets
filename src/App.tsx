import { Routes, Route } from 'react-router-dom'
import StorefrontLayout from '@/components/layout/StorefrontLayout'
import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import ProductDetails from '@/pages/ProductDetails'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import NotFound from '@/pages/NotFound'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminProducts from '@/pages/admin/AdminProducts'
import AdminOrders from '@/pages/admin/AdminOrders'
import AdminInventory from '@/pages/admin/AdminInventory'

export default function App() {
  return (
    <Routes>
      {/* Admin routes render their own AdminLayout (sidebar), no storefront chrome */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/inventory" element={<AdminInventory />} />

      {/* Storefront routes share header/footer */}
      <Route
        path="*"
        element={
          <StorefrontLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </StorefrontLayout>
        }
      />
    </Routes>
  )
}
