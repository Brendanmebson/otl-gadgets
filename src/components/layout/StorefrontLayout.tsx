import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import Header from './Header'
import Footer from './Footer'

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>{children}</Box>
      <Footer />
    </Box>
  )
}
