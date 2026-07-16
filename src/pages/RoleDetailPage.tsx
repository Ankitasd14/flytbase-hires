import { Link, Navigate, useParams } from 'react-router-dom'
import { getRoleBySlug } from '../data/roles'
import { SiteHeader } from '../components/SiteHeader'
import { RegistrationForm } from '../components/RegistrationForm'
import { PixelButton } from '../components/PixelButton'

function OutcomesSection({ outcomes }: { outcomes: string[] }) {
  return (
    <section id="outcomes" className="mb-10">
      <div className="panel panel--outcomes">
        <span className="section-kicker">Outcomes</span>
        <h2 className="mt-3 font-display text-[clamp(0.95rem,2vw,1.25rem)] leading-[1.5] uppercase text-ink">
          What you walk away with
        </h2>
        <ul className="outcomes-list mt-6 grid list-none gap-3 p-0 md:grid-cols-2">
          {outcomes.map((outcome, index) => (
            <li
              key={outcome}
              className={
                index === 0
                  ? 'outcome-card outcome-card--winner md:col-span-2'
                  : 'outcome-card'
              }
            >
              {index === 0 && (
                <span className="outcome-card__badge" aria-hidden="true">
                  ★ Winner&apos;s prize
                </span>
              )}
              <p className="outcome-card__text">{outcome}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function RoleDetailPage() {
  const { slug = '' } = useParams()
  const role = getRoleBySlug(slug)
  const isDealDuelist = role?.slug === 'business-development'

  if (!role) {
    return <Navigate to="/roles" replace />
  }

  return (
    <div className="pixel-page pb-24">
      <SiteHeader variant="detail" />

      <main className="section-shell pt-28 md:pt-32">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="eyebrow">/ STEP 02 · {role.name}</p>
            <h1 className="mt-3 font-display text-[clamp(1.15rem,2.8vw,1.85rem)] leading-[1.4] uppercase text-ink">
              {role.className}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
              {role.description}
            </p>
            {isDealDuelist ? (
              <p className="mt-3 font-display text-[9px] tracking-wide text-cyan uppercase">
                {role.details.schedule}
              </p>
            ) : (
              <p className="mt-3 font-display text-[9px] tracking-wide text-magenta uppercase">
                Details will be published soon
              </p>
            )}
          </div>
          <PixelButton to="/roles" variant="secondary">
            Change class
          </PixelButton>
        </div>

        {isDealDuelist ? (
          <section id="details" className="mb-10">
            <div className="panel">
              <span className="section-kicker">Hackathon details</span>
              <h2 className="mt-3 font-display text-[clamp(0.95rem,2vw,1.25rem)] leading-[1.5] uppercase">
                The mission brief
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink md:text-base">
                {role.details.summary}
              </p>
              <ul className="mt-6 grid list-none gap-3 p-0 md:grid-cols-2">
                {role.details.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="relative border-2 border-ink bg-surface px-4 py-3 pl-10 text-sm leading-snug shadow-[3px_3px_0_#1a1b41]"
                  >
                    <span
                      className="absolute top-1/2 left-3 h-3 w-3 -translate-y-1/2 border-2 border-ink"
                      style={{ background: role.accent }}
                      aria-hidden
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : (
          <section id="details" className="mb-10">
            <div className="panel">
              <span className="section-kicker">Updates</span>
              <h2 className="mt-3 font-display text-[clamp(0.95rem,2vw,1.25rem)] leading-[1.5] uppercase">
                Details will be published soon
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink md:text-base">
                This track is opening shortly. Join the waitlist now and we will notify you as
                soon as the full brief, schedule, and challenge details are live.
              </p>
            </div>
          </section>
        )}

        <OutcomesSection outcomes={role.outcomes} />

        <section id="register">
          <div className="panel">
            <span className="section-kicker">{isDealDuelist ? 'Registration' : 'Waitlist'}</span>
            <h2 className="mt-3 mb-6 font-display text-[clamp(0.95rem,2vw,1.25rem)] leading-[1.5] uppercase">
              {isDealDuelist ? 'Join the raid' : 'Join the waitlist'}
            </h2>
            <RegistrationForm roleName={role.name} fantasyClass={role.className} />
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-muted">
          Wrong track?{' '}
          <Link to="/roles" className="text-magenta underline underline-offset-2">
            Pick another class
          </Link>
        </p>
      </main>
    </div>
  )
}
