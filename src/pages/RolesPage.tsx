import { useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { roles } from '../data/roles'
import { SiteHeader } from '../components/SiteHeader'
import { RoleCard } from '../components/RoleCard'

export function RolesPage() {
  const navigate = useNavigate()
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  function handleSelect(slug: string) {
    setSelectedSlug(slug)
    window.setTimeout(() => {
      navigate(`/roles/${slug}`)
    }, 280)
  }

  return (
    <div className="pixel-page pb-20">
      <SiteHeader variant="roles" />

      <main className="section-shell pt-28 md:pt-32">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow fade-up">/ STEP 01</p>
          <h1
            className="fade-up mt-3 font-display text-[clamp(1.2rem,3vw,2rem)] leading-[1.4] uppercase text-ink"
            style={{ '--delay': '60ms' } as CSSProperties}
          >
            Pick your class
          </h1>
          <p
            className="fade-up mt-4 max-w-xl text-sm leading-relaxed text-[#2f6b4f] md:text-base"
            style={{ '--delay': '120ms' } as CSSProperties}
          >
            Choosing a class customizes your hackathon track — challenge, judges, and outcomes —
            so you fight the boss that fits your build.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role, index) => (
            <div
              key={role.slug}
              className="fade-up"
              style={{ '--delay': `${160 + index * 70}ms` } as CSSProperties}
            >
              <RoleCard
                role={role}
                selected={selectedSlug === role.slug}
                onSelect={() => handleSelect(role.slug)}
              />
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}
