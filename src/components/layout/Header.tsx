import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  AppBar, Toolbar, Box, Stack, Typography, IconButton, Badge, Drawer,
  List, ListItemButton, ListItemText, Divider, Container, Chip,
} from '@mui/material'
import { Search, User, Heart, ShoppingCart, Menu, X, Sparkles } from 'lucide-react'
import { colors } from '@/theme/theme'
import { useCart } from '@/context/CartContext'
import QuickSearchModal from '@/components/common/QuickSearchModal'

const NAV_LINKS = [
  { label: 'Phones & Tablets', to: '/shop?category=phones-tablets' },
  { label: 'Laptops & Computing', to: '/shop?category=laptops-computing' },
  { label: 'Audio & Gaming', to: '/shop?category=audio-gaming' },
  { label: 'Accessories', to: '/shop?category=accessories' },
  { label: 'Deals', to: '/shop?deals=1', highlight: true },
]

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { itemCount } = useCart()
  const location = useLocation()

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(8, 8, 8, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${colors.grey[700]}`,
          transition: 'all 200ms ease',
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <Toolbar sx={{ minHeight: { xs: 60, md: 68 }, gap: 2.5, px: { xs: 2, md: 3 } }}>
            <IconButton
              sx={{ display: { xs: 'inline-flex', md: 'none' }, color: colors.white }}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </IconButton>

            <Typography
              component={Link}
              to="/"
              variant="h6"
              sx={{
                color: colors.white,
                textDecoration: 'none',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                fontSize: { xs: 18, md: 22 },
              }}
            >
              OTL <Box component="span" sx={{ color: colors.red, display: 'inline-flex', alignItems: 'center' }}>GADGETS</Box>
            </Typography>

            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, ml: 3 }}
            >
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname + location.search === link.to
                return (
                  <Typography
                    key={link.label}
                    component={Link}
                    to={link.to}
                    variant="body2"
                    sx={{
                      color: link.highlight ? colors.red : colors.white,
                      textDecoration: 'none',
                      fontWeight: isActive || link.highlight ? 700 : 600,
                      opacity: isActive ? 1 : 0.85,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      position: 'relative',
                      py: 0.5,
                      transition: 'all 150ms ease',
                      '&:hover': { opacity: 1, color: colors.red },
                      '&::after': isActive ? {
                        content: '""',
                        position: 'absolute',
                        bottom: -4,
                        left: 0,
                        right: 0,
                        height: 2,
                        borderRadius: 1,
                        bgcolor: colors.red,
                      } : {},
                    }}
                  >
                    {link.highlight && <Sparkles size={13} color={colors.red} />}
                    {link.label}
                  </Typography>
                )
              })}
            </Stack>

            <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

            <Box
              onClick={() => setSearchOpen(true)}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 2.5,
                px: 2,
                py: 0.75,
                width: { sm: 200, md: 240 },
                cursor: 'pointer',
                transition: 'all 150ms ease',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.14)',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                },
              }}
            >
              <Search size={16} color={colors.grey[300]} />
              <Typography variant="body2" sx={{ ml: 1.25, color: colors.grey[300], fontSize: 13, flex: 1 }}>
                Search gadgets…
              </Typography>
              <Chip
                label="⌘K"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.12)',
                  color: colors.grey[300],
                  height: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 1,
                }}
              />
            </Box>

            <Stack direction="row" spacing={0.75} alignItems="center">
              <IconButton
                onClick={() => setSearchOpen(true)}
                sx={{ display: { xs: 'inline-flex', sm: 'none' }, color: colors.white }}
                aria-label="Search"
              >
                <Search size={20} />
              </IconButton>
              <IconButton
                component={Link}
                to="/admin"
                sx={{ color: colors.white, display: { xs: 'none', sm: 'inline-flex' } }}
                aria-label="Account / Admin"
              >
                <User size={20} />
              </IconButton>
              <IconButton
                component={Link}
                to="/shop?deals=1"
                sx={{ color: colors.white, display: { xs: 'none', sm: 'inline-flex' } }}
                aria-label="Wishlist"
              >
                <Badge badgeContent={2} color="secondary" overlap="circular">
                  <Heart size={20} />
                </Badge>
              </IconButton>
              <IconButton
                component={Link}
                to="/cart"
                sx={{ color: colors.white }}
                aria-label="Cart"
              >
                <Badge badgeContent={itemCount} color="secondary" overlap="circular">
                  <ShoppingCart size={20} />
                </Badge>
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>

        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 290, bgcolor: colors.black, height: '100%', color: colors.white }} role="presentation">
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                OTL <Box component="span" sx={{ color: colors.red }}>GADGETS</Box>
              </Typography>
              <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: colors.white }} aria-label="Close menu">
                <X size={20} />
              </IconButton>
            </Stack>
            <Divider sx={{ borderColor: colors.grey[700] }} />
            <List sx={{ pt: 1 }}>
              {NAV_LINKS.map((link) => (
                <ListItemButton
                  key={link.label}
                  component={Link}
                  to={link.to}
                  onClick={() => setDrawerOpen(false)}
                  sx={{ py: 1.5, px: 2.5 }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      fontWeight: link.highlight ? 700 : 600,
                      color: link.highlight ? colors.red : colors.white,
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>
      </AppBar>

      <QuickSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

