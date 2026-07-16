import { Link, useLocation } from 'react-router-dom'

type SiteHeaderProps = {
  variant?: 'hero' | 'roles' | 'detail'
}

export function SiteHeader({ variant = 'hero' }: SiteHeaderProps) {
  const { pathname } = useLocation()
  const isTicketHero = variant === 'hero'

  return (
    <header className={`site-header${isTicketHero ? ' site-header--ticket' : ''}`}>
      <Link to="/" className="brand-lockup" aria-label="FlytBase Hiring Hackathon home">
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-full">HACK TO GET HIRED</span>
        <span className="brand-mobile">HIRE HACK</span>
      </Link>

      <nav className="nav-links" aria-label="Primary navigation">
        {variant !== 'hero' && (
          <Link to="/" className={pathname === '/' ? 'is-active' : undefined}>
            Home
          </Link>
        )}
        {variant === 'detail' && (
          <Link
            to="/roles"
            className={pathname.startsWith('/roles') ? 'is-active' : undefined}
          >
            Classes
          </Link>
        )}
        {variant === 'detail' ? (
          <a className="nav-cta" href="#register">
            Register
          </a>
        ) : (
          <Link className="nav-cta" to="/roles">
            {variant === 'hero' ? 'Board Now' : 'Browse'}
          </Link>
        )}
      </nav>
    </header>
  )
}
