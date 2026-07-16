import { SiteHeader } from '../components/SiteHeader'
import { OneWayTicketHero } from '../components/OneWayTicketHero'

export function HeroPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0618] text-[var(--ink)]">
      <SiteHeader variant="hero" />
      <OneWayTicketHero />
    </div>
  )
}
