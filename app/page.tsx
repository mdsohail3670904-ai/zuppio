import { HomeExperience } from '@/components/home/home-experience'
import { PartnerSection } from '@/components/home/partner-section'
import { SiteShell } from '@/components/site/site-shell'
import { getCategories } from '@/lib/services/restaurants'

export default async function HomePage() {
  const categories = await getCategories()
  return (
    <SiteShell>
      <HomeExperience categories={categories} />
      <PartnerSection />
    </SiteShell>
  )
}
