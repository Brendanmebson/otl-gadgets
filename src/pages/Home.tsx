import Hero from '@/components/home/Hero'
import TrustFeatures from '@/components/home/TrustFeatures'
import FeaturedCategories from '@/components/home/FeaturedCategories'
import ProductRowSection from '@/components/home/ProductRowSection'
import PromoBanner from '@/components/home/PromoBanner'
import CountdownDeals from '@/components/home/CountdownDeals'
import Testimonials from '@/components/home/Testimonials'
import { useTopDeals, useNewArrivals } from '@/hooks/useProducts'

export default function Home() {
  const { data: deals, isLoading: dealsLoading } = useTopDeals(8)
  const { data: arrivals, isLoading: arrivalsLoading } = useNewArrivals(8)

  return (
    <>
      <Hero />
      <TrustFeatures />
      <FeaturedCategories />
      <ProductRowSection title="TOP DEALS" viewAllHref="/shop?deals=1" products={deals} isLoading={dealsLoading} />
      <ProductRowSection title="NEW ARRIVALS" viewAllHref="/shop?new=1" products={arrivals} isLoading={arrivalsLoading} />
      <PromoBanner />
      <CountdownDeals />
      <Testimonials />
    </>
  )
}
