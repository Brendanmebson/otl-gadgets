import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Container, Grid, Box, Typography, Stack, Select, MenuItem, Drawer, Button,
  FormGroup, FormControlLabel, Checkbox, Slider, Divider, Pagination, IconButton, Chip, Paper,
} from '@mui/material'
import { SlidersHorizontal, X, Grid2X2, Grid3X3, LayoutGrid, RotateCcw } from 'lucide-react'
import { colors } from '@/theme/theme'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import EmptyState from '@/components/common/EmptyState'
import ProductCard from '@/components/product/ProductCard'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton'
import { useProducts, useBrands, useCategories } from '@/hooks/useProducts'
import { formatNaira } from '@/lib/format'
import type { ProductFilters, SortOption } from '@/types'

const PAGE_SIZE = 12

const QUICK_TAGS = [
  { label: 'All Gadgets', category: undefined },
  { label: 'Phones & Tablets', category: 'phones-tablets' },
  { label: 'Laptops', category: 'laptops-computing' },
  { label: 'Audio', category: 'audio-gaming' },
  { label: 'Accessories', category: 'accessories' },
]

function FiltersPanel({
  brands, categories, filters, onChange, onReset,
}: {
  brands: { id: string; name: string }[]
  categories: { slug: string; name: string }[]
  filters: ProductFilters
  onChange: (next: Partial<ProductFilters>) => void
  onReset: () => void
}) {
  const activeCount = (filters.categorySlug ? 1 : 0) + (filters.brandIds?.length ?? 0) + (filters.inStockOnly ? 1 : 0) + (filters.onSaleOnly ? 1 : 0)

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: `1px solid ${colors.grey[200]}`,
        bgcolor: colors.white,
        position: 'sticky',
        top: 90,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.black }}>
            Filters
          </Typography>
          {activeCount > 0 && (
            <Chip
              label={activeCount}
              size="small"
              sx={{ bgcolor: colors.red, color: colors.white, fontWeight: 800, height: 20 }}
            />
          )}
        </Stack>
        {activeCount > 0 && (
          <Button
            size="small"
            onClick={onReset}
            startIcon={<RotateCcw size={14} />}
            sx={{ color: colors.grey[500], fontSize: 12, p: 0 }}
          >
            Reset
          </Button>
        )}
      </Stack>

      <Stack spacing={3}>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: colors.grey[400], letterSpacing: '0.05em', mb: 1, display: 'block' }}>
            CATEGORIES
          </Typography>
          <FormGroup>
            {categories.map((c) => (
              <FormControlLabel
                key={c.slug}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.categorySlug === c.slug}
                    onChange={(e) => onChange({ categorySlug: e.target.checked ? c.slug : undefined })}
                  />
                }
                label={<Typography variant="body2" sx={{ fontWeight: filters.categorySlug === c.slug ? 700 : 500 }}>{c.name}</Typography>}
              />
            ))}
          </FormGroup>
        </Box>

        <Divider sx={{ borderColor: colors.grey[100] }} />

        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: colors.grey[400], letterSpacing: '0.05em', mb: 1, display: 'block' }}>
            BRANDS
          </Typography>
          <FormGroup>
            {brands.map((b) => (
              <FormControlLabel
                key={b.id}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.brandIds?.includes(b.id) ?? false}
                    onChange={(e) => {
                      const current = filters.brandIds ?? []
                      onChange({
                        brandIds: e.target.checked ? [...current, b.id] : current.filter((id) => id !== b.id),
                      })
                    }}
                  />
                }
                label={<Typography variant="body2" sx={{ fontWeight: filters.brandIds?.includes(b.id) ? 700 : 500 }}>{b.name}</Typography>}
              />
            ))}
          </FormGroup>
        </Box>

        <Divider sx={{ borderColor: colors.grey[100] }} />

        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: colors.grey[400], letterSpacing: '0.05em', mb: 1.5, display: 'block' }}>
            PRICE RANGE (₦)
          </Typography>
          <Slider
            value={[filters.priceMin ?? 0, filters.priceMax ?? 2000000]}
            min={0}
            max={2000000}
            step={25000}
            onChange={(_, val) => {
              const [min, max] = val as number[]
              onChange({ priceMin: min, priceMax: max })
            }}
            color="secondary"
          />
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: colors.grey[600] }}>
              {formatNaira(filters.priceMin ?? 0)}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: colors.grey[600] }}>
              {formatNaira(filters.priceMax ?? 2000000)}
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: colors.grey[100] }} />

        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: colors.grey[400], letterSpacing: '0.05em', mb: 1, display: 'block' }}>
            AVAILABILITY & OFFERS
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={filters.inStockOnly ?? false}
                  onChange={(e) => onChange({ inStockOnly: e.target.checked })}
                />
              }
              label={<Typography variant="body2">In stock only</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={filters.onSaleOnly ?? false}
                  onChange={(e) => onChange({ onSaleOnly: e.target.checked })}
                />
              }
              label={<Typography variant="body2" sx={{ color: colors.red, fontWeight: 700 }}>On sale / Flash Deals</Typography>}
            />
          </FormGroup>
        </Box>
      </Stack>
    </Paper>
  )
}

export default function Shop() {
  const [searchParams] = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [gridCols, setGridCols] = useState<3 | 4>(3)
  const [page, setPage] = useState(1)
  const [localFilters, setLocalFilters] = useState<Partial<ProductFilters>>({})

  const filters: ProductFilters = useMemo(
    () => ({
      categorySlug: localFilters.categorySlug ?? searchParams.get('category') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      onSaleOnly: searchParams.get('deals') === '1' || localFilters.onSaleOnly,
      sort: (searchParams.get('sort') as SortOption) ?? localFilters.sort ?? 'featured',
      page,
      pageSize: PAGE_SIZE,
      ...localFilters,
    }),
    [searchParams, localFilters, page]
  )

  const { data, isLoading } = useProducts(filters)
  const { data: brands } = useBrands()
  const { data: categories } = useCategories()

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE))

  const updateFilters = (next: Partial<ProductFilters>) => {
    setPage(1)
    setLocalFilters((prev) => ({ ...prev, ...next }))
  }

  const resetFilters = () => {
    setPage(1)
    setLocalFilters({
      categorySlug: undefined,
      brandIds: undefined,
      priceMin: undefined,
      priceMax: undefined,
      inStockOnly: undefined,
      onSaleOnly: undefined,
    })
  }

  const filterPanel = (
    <FiltersPanel
      brands={brands ?? []}
      categories={categories ?? []}
      filters={filters}
      onChange={updateFilters}
      onReset={resetFilters}
    />
  )

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop Catalogue' }]} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: colors.black, mb: 1 }}>
          EXPLORE GADGETS
        </Typography>
        <Typography variant="body1" sx={{ color: colors.grey[500] }}>
          Browse authentic tech gadgets in Nigeria with official warranty and flexible delivery.
        </Typography>
      </Box>

      {/* Quick Tag Pills */}
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
        {QUICK_TAGS.map((tag) => {
          const isSelected = filters.categorySlug === tag.category
          return (
            <Chip
              key={tag.label}
              label={tag.label}
              onClick={() => updateFilters({ categorySlug: tag.category })}
              clickable
              color={isSelected ? 'secondary' : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{
                fontWeight: 700,
                borderRadius: 2.5,
                px: 1,
                py: 2,
                fontSize: 13,
              }}
            />
          )
        })}
      </Stack>

      <Grid container spacing={4}>
        <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          {filterPanel}
        </Grid>

        <Grid item xs={12} md={9}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            sx={{
              mb: 3,
              pb: 2,
              borderBottom: `1px solid ${colors.grey[200]}`,
            }}
          >
            <Typography variant="body2" sx={{ color: colors.grey[600], fontWeight: 600 }}>
              Showing {isLoading ? '…' : data?.items.length ?? 0} of {data?.total ?? 0} Products
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="center" width={{ xs: '100%', sm: 'auto' }} justifyContent="space-between">
              <IconButton
                sx={{ display: { xs: 'inline-flex', md: 'none' }, border: `1px solid ${colors.grey[300]}`, borderRadius: 2 }}
                onClick={() => setMobileFiltersOpen(true)}
                aria-label="Open filters"
              >
                <SlidersHorizontal size={18} />
              </IconButton>

              <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <IconButton
                  size="small"
                  onClick={() => setGridCols(3)}
                  sx={{ color: gridCols === 3 ? colors.red : colors.grey[400], bgcolor: gridCols === 3 ? colors.redGlow : 'transparent' }}
                >
                  <Grid3X3 size={18} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setGridCols(4)}
                  sx={{ color: gridCols === 4 ? colors.red : colors.grey[400], bgcolor: gridCols === 4 ? colors.redGlow : 'transparent' }}
                >
                  <LayoutGrid size={18} />
                </IconButton>
              </Stack>

              <Select
                size="small"
                value={filters.sort}
                onChange={(e) => updateFilters({ sort: e.target.value as SortOption })}
                sx={{ borderRadius: 2.5, fontWeight: 600, fontSize: 13, minWidth: 160 }}
              >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="newest">Newest Releases</MenuItem>
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
              </Select>
            </Stack>
          </Stack>

          {!isLoading && data?.items.length === 0 ? (
            <EmptyState title="No products found" subtitle="Try adjusting your category or price filters to explore more items." />
          ) : (
            <Grid container spacing={2.5}>
              {(isLoading ? Array.from({ length: 9 }) : data?.items ?? []).map((p: any, idx: number) => (
                <Grid item xs={6} sm={gridCols === 4 ? 4 : 4} md={gridCols === 4 ? 3 : 4} key={p?.id ?? idx}>
                  {p ? <ProductCard product={p} /> : <ProductCardSkeleton />}
                </Grid>
              ))}
            </Grid>
          )}

          {totalPages > 1 && (
            <Stack alignItems="center" sx={{ mt: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, p) => setPage(p)}
                color="secondary"
                size="large"
                shape="rounded"
              />
            </Stack>
          )}
        </Grid>
      </Grid>

      <Drawer anchor="bottom" open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        <Box sx={{ p: 3, maxHeight: '80vh', overflowY: 'auto' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Filters</Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}><X size={20} /></IconButton>
          </Stack>
          {filterPanel}
          <Button fullWidth variant="contained" color="secondary" size="large" sx={{ mt: 3 }} onClick={() => setMobileFiltersOpen(false)}>
            Apply & Show Results
          </Button>
        </Box>
      </Drawer>
    </Container>
  )
}

