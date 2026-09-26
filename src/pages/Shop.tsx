import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Container, Grid, Box, Typography, Stack, Select, MenuItem, Drawer, Button,
  FormGroup, FormControlLabel, Checkbox, Slider, Divider, Pagination, IconButton, Chip, Paper,
} from '@mui/material'
import { SlidersHorizontal, X, Grid3X3, LayoutGrid, RotateCcw, Filter, Tag, CheckCircle2, Sparkles } from 'lucide-react'
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
  { label: 'Audio & Gaming', category: 'audio-gaming' },
  { label: 'Accessories', category: 'accessories' },
]

const PRICE_PRESETS = [
  { label: 'All Prices', min: 0, max: 2000000 },
  { label: 'Under ₦100k', min: 0, max: 100000 },
  { label: '₦100k - ₦500k', min: 100000, max: 500000 },
  { label: '₦500k+', min: 500000, max: 2000000 },
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
  const activeCount = (filters.categorySlug ? 1 : 0) + (filters.brandIds?.length ?? 0) + (filters.inStockOnly ? 1 : 0) + (filters.onSaleOnly ? 1 : 0) + (filters.priceMin || filters.priceMax !== 2000000 ? 1 : 0)

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid rgba(8, 8, 8, 0.08)`,
        bgcolor: colors.white,
        position: 'sticky',
        top: 90,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Filter size={18} color={colors.red} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.black, letterSpacing: '-0.01em' }}>
            Filter Catalogue
          </Typography>
          {activeCount > 0 && (
            <Chip
              label={activeCount}
              size="small"
              sx={{ bgcolor: colors.red, color: colors.white, fontWeight: 800, height: 20, fontSize: 11 }}
            />
          )}
        </Stack>
        {activeCount > 0 && (
          <Button
            size="small"
            onClick={onReset}
            startIcon={<RotateCcw size={13} />}
            sx={{ color: colors.grey[600], fontSize: 12, fontWeight: 700, p: 0, '&:hover': { color: colors.red } }}
          >
            Reset
          </Button>
        )}
      </Stack>

      <Stack spacing={3}>
        {/* Categories */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: colors.grey[400], letterSpacing: '0.06em', mb: 1.5, display: 'block' }}>
            CATEGORIES
          </Typography>
          <FormGroup>
            {categories.map((c) => {
              const isChecked = filters.categorySlug === c.slug
              return (
                <FormControlLabel
                  key={c.slug}
                  control={
                    <Checkbox
                      size="small"
                      checked={isChecked}
                      onChange={(e) => onChange({ categorySlug: e.target.checked ? c.slug : undefined })}
                      sx={{ color: colors.grey[300], '&.Mui-checked': { color: colors.red } }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: isChecked ? 700 : 500, color: isChecked ? colors.black : colors.grey[700] }}>
                      {c.name}
                    </Typography>
                  }
                />
              )
            })}
          </FormGroup>
        </Box>

        <Divider sx={{ borderColor: colors.grey[100] }} />

        {/* Brands */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: colors.grey[400], letterSpacing: '0.06em', mb: 1.5, display: 'block' }}>
            BRANDS
          </Typography>
          <FormGroup>
            {brands.map((b) => {
              const isChecked = filters.brandIds?.includes(b.id) ?? false
              return (
                <FormControlLabel
                  key={b.id}
                  control={
                    <Checkbox
                      size="small"
                      checked={isChecked}
                      onChange={(e) => {
                        const current = filters.brandIds ?? []
                        onChange({
                          brandIds: e.target.checked ? [...current, b.id] : current.filter((id) => id !== b.id),
                        })
                      }}
                      sx={{ color: colors.grey[300], '&.Mui-checked': { color: colors.red } }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: isChecked ? 700 : 500, color: isChecked ? colors.black : colors.grey[700] }}>
                      {b.name}
                    </Typography>
                  }
                />
              )
            })}
          </FormGroup>
        </Box>

        <Divider sx={{ borderColor: colors.grey[100] }} />

        {/* Price Presets & Slider */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: colors.grey[400], letterSpacing: '0.06em', mb: 1.5, display: 'block' }}>
            PRICE RANGE (₦)
          </Typography>

          {/* Preset Buttons */}
          <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mb: 2 }}>
            {PRICE_PRESETS.map((preset) => {
              const isSelected = filters.priceMin === preset.min && filters.priceMax === preset.max
              return (
                <Chip
                  key={preset.label}
                  label={preset.label}
                  size="small"
                  onClick={() => onChange({ priceMin: preset.min, priceMax: preset.max })}
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    bgcolor: isSelected ? colors.black : colors.grey[100],
                    color: isSelected ? colors.white : colors.grey[700],
                    border: `1px solid ${isSelected ? colors.black : 'transparent'}`,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: isSelected ? colors.black : colors.grey[200] },
                  }}
                />
              )
            })}
          </Stack>

          <Slider
            value={[filters.priceMin ?? 0, filters.priceMax ?? 2000000]}
            min={0}
            max={2000000}
            step={25000}
            onChange={(_, val) => {
              const [min, max] = val as number[]
              onChange({ priceMin: min, priceMax: max })
            }}
            sx={{
              color: colors.red,
              '& .MuiSlider-thumb': {
                width: 18,
                height: 18,
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              },
            }}
          />
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: colors.grey[700] }}>
              {formatNaira(filters.priceMin ?? 0)}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: colors.grey[700] }}>
              {formatNaira(filters.priceMax ?? 2000000)}
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: colors.grey[100] }} />

        {/* Availability & Offers */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: colors.grey[400], letterSpacing: '0.06em', mb: 1.5, display: 'block' }}>
            AVAILABILITY & OFFERS
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={filters.inStockOnly ?? false}
                  onChange={(e) => onChange({ inStockOnly: e.target.checked })}
                  sx={{ color: colors.grey[300], '&.Mui-checked': { color: colors.red } }}
                />
              }
              label={<Typography variant="body2" sx={{ fontWeight: 500 }}>In stock only</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={filters.onSaleOnly ?? false}
                  onChange={(e) => onChange({ onSaleOnly: e.target.checked })}
                  sx={{ color: colors.grey[300], '&.Mui-checked': { color: colors.red } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: colors.red, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Sparkles size={14} /> On sale / Deals
                </Typography>
              }
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
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tech Catalogue' }]} />

      {/* Catalogue Header Hero Banner */}
      <Box
        sx={{
          mb: 4,
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          bgcolor: colors.black,
          color: colors.white,
          position: 'relative',
          overflow: 'hidden',
          background: `radial-gradient(circle at 90% 10%, rgba(227, 28, 37, 0.25) 0%, transparent 60%), ${colors.black}`,
          boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Chip label="AUTHENTIC NIGERIAN STOCK" size="small" sx={{ bgcolor: colors.red, color: colors.white, fontWeight: 800, fontSize: 11 }} />
              <Typography variant="caption" sx={{ color: colors.grey[400], fontWeight: 600 }}>Official Warranty Included</Typography>
            </Stack>
            <Typography variant="h3" sx={{ fontWeight: 900, color: colors.white, letterSpacing: '-0.02em', fontSize: { xs: 26, sm: 34, md: 40 } }}>
              TECH CATALOGUE
            </Typography>
            <Typography variant="body2" sx={{ color: colors.grey[300], mt: 0.5, maxWidth: 540 }}>
              Browse flagship smartphones, laptops, audio gear & luxury tech accessories with nationwide fast delivery.
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Quick Tag Filter Pills */}
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
        {QUICK_TAGS.map((tag) => {
          const isSelected = filters.categorySlug === tag.category
          return (
            <Chip
              key={tag.label}
              label={tag.label}
              onClick={() => updateFilters({ categorySlug: tag.category })}
              clickable
              sx={{
                fontWeight: isSelected ? 800 : 600,
                borderRadius: 2.5,
                px: 1.5,
                py: 2.2,
                fontSize: 13,
                bgcolor: isSelected ? colors.black : colors.white,
                color: isSelected ? colors.white : colors.grey[800],
                border: `1px solid ${isSelected ? colors.black : colors.grey[200]}`,
                boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
                transition: 'all 200ms ease',
                '&:hover': {
                  bgcolor: isSelected ? colors.black : colors.grey[100],
                  borderColor: colors.black,
                },
              }}
            />
          )
        })}
      </Stack>

      {/* Main Grid: Sidebar + Product Grid */}
      <Grid container spacing={3.5}>
        <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          {filterPanel}
        </Grid>

        <Grid item xs={12} md={9}>
          {/* Toolbar: Counter, Mobile Filter Trigger, Column Mode, Sort */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2.5,
              border: `1px solid ${colors.grey[200]}`,
              bgcolor: colors.white,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
            >
              <Typography variant="body2" sx={{ color: colors.grey[700], fontWeight: 700 }}>
                Showing <Box component="span" sx={{ color: colors.red }}>{isLoading ? '…' : data?.items.length ?? 0}</Box> of {data?.total ?? 0} Products
              </Typography>

              <Stack direction="row" spacing={1.5} alignItems="center" width={{ xs: '100%', sm: 'auto' }} justifyContent="space-between">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SlidersHorizontal size={16} />}
                  sx={{ display: { xs: 'inline-flex', md: 'none' }, borderRadius: 2, borderColor: colors.grey[300], color: colors.black, fontWeight: 700 }}
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  Filters {filters.categorySlug || filters.brandIds?.length ? `(${ (filters.categorySlug ? 1 : 0) + (filters.brandIds?.length ?? 0) })` : ''}
                </Button>

                <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  <IconButton
                    size="small"
                    onClick={() => setGridCols(3)}
                    sx={{ color: gridCols === 3 ? colors.red : colors.grey[400], bgcolor: gridCols === 3 ? colors.redGlow : 'transparent', borderRadius: 1.5 }}
                    title="3 Columns Grid"
                  >
                    <Grid3X3 size={18} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setGridCols(4)}
                    sx={{ color: gridCols === 4 ? colors.red : colors.grey[400], bgcolor: gridCols === 4 ? colors.redGlow : 'transparent', borderRadius: 1.5 }}
                    title="4 Columns Grid"
                  >
                    <LayoutGrid size={18} />
                  </IconButton>
                </Stack>

                <Select
                  size="small"
                  value={filters.sort}
                  onChange={(e) => updateFilters({ sort: e.target.value as SortOption })}
                  sx={{ borderRadius: 2, fontWeight: 700, fontSize: 13, minWidth: 160, bgcolor: colors.grey[50] }}
                >
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="newest">Newest Releases</MenuItem>
                  <MenuItem value="price_asc">Price: Low to High</MenuItem>
                  <MenuItem value="price_desc">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                </Select>
              </Stack>
            </Stack>
          </Paper>

          {/* Product Items Grid */}
          {!isLoading && data?.items.length === 0 ? (
            <EmptyState title="No matching gadgets found" subtitle="Try adjusting your category, price range, or brand filters." />
          ) : (
            <Grid container spacing={2.5}>
              {(isLoading ? Array.from({ length: 9 }) : data?.items ?? []).map((p: any, idx: number) => (
                <Grid item xs={6} sm={gridCols === 4 ? 4 : 4} md={gridCols === 4 ? 3 : 4} key={p?.id ?? idx}>
                  {p ? <ProductCard product={p} /> : <ProductCardSkeleton />}
                </Grid>
              ))}
            </Grid>
          )}

          {/* Pagination */}
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

      {/* Mobile Drawer Filter */}
      <Drawer anchor="bottom" open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        <Box sx={{ p: 3, maxHeight: '85vh', overflowY: 'auto' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Filter Products</Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}><X size={20} /></IconButton>
          </Stack>
          {filterPanel}
          <Button fullWidth variant="contained" color="secondary" size="large" sx={{ mt: 3, borderRadius: 2.5, fontWeight: 800 }} onClick={() => setMobileFiltersOpen(false)}>
            Show Results ({data?.total ?? 0})
          </Button>
        </Box>
      </Drawer>
    </Container>
  )
}
