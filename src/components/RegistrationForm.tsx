import { useEffect, useState, type FormEvent } from 'react'
import { PixelButton } from './PixelButton'

type RegistrationFormProps = {
  roleName: string
  fantasyClass: string
}

const INFO_SESSIONS = [
  {
    id: 'session-a',
    label: 'Info Session 1',
    href: 'https://luma.com/a8x9qmix',
  },
  {
    id: 'session-b',
    label: 'Info Session 2',
    href: 'https://luma.com/bi0htb5w',
  },
] as const

export function RegistrationForm({ roleName, fantasyClass }: RegistrationFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [showSessionsPopup, setShowSessionsPopup] = useState(false)
  const [resumeName, setResumeName] = useState('')

  useEffect(() => {
    if (!showSessionsPopup) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowSessionsPopup(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showSessionsPopup])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    setSubmitted(true)
    setShowSessionsPopup(true)
    form.reset()
    setResumeName('')
  }

  return (
    <>
      {submitted ? (
        <div className="success-banner" role="status">
          Thanks for registering for the hackathon as <strong>{fantasyClass}</strong>. Check the
          info sessions above for a better overall understanding.
        </div>
      ) : (
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <p className="m-0 text-sm leading-relaxed text-muted">
            Applying for <strong>{roleName}</strong> as <strong>{fantasyClass}</strong>.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" required autoComplete="name" placeholder="Ada Lovelane" />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@college.edu"
              />
            </div>
            <div className="form-field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+91 90000 00000"
              />
            </div>
            <div className="form-field">
              <label htmlFor="college">College / University</label>
              <input
                id="college"
                name="college"
                required
                autoComplete="organization"
                placeholder="Pixel Institute of Technology"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="resume">Resume (PDF)</label>
            <input
              id="resume"
              name="resume"
              type="file"
              accept="application/pdf"
              required
              onChange={(e) => setResumeName(e.target.files?.[0]?.name ?? '')}
            />
            {resumeName ? (
              <span className="text-xs text-muted">Selected: {resumeName}</span>
            ) : null}
          </div>

          <div>
            <PixelButton type="submit" variant="primary">
              Submit quest
            </PixelButton>
          </div>
        </form>
      )}

      {showSessionsPopup && (
        <div
          className="register-popup"
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-popup-title"
        >
          <button
            type="button"
            className="register-popup__backdrop"
            aria-label="Close notification"
            onClick={() => setShowSessionsPopup(false)}
          />
          <div className="register-popup__panel">
            <button
              type="button"
              className="register-popup__close"
              aria-label="Close"
              onClick={() => setShowSessionsPopup(false)}
            >
              ×
            </button>
            <p className="register-popup__kicker">Registration confirmed</p>
            <h3 id="register-popup-title" className="register-popup__title">
              Thanks for registering for the hackathon!
            </h3>
            <p className="register-popup__copy">
              For a better overall understanding of the hackathon, it&apos;s good to attend these
              info sessions. Pick a session below to RSVP on Luma.
            </p>
            <div className="register-popup__actions">
              {INFO_SESSIONS.map((session) => (
                <a
                  key={session.id}
                  className="pixel-button pixel-button--primary register-popup__session-btn"
                  href={session.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {session.label}
                </a>
              ))}
            </div>
            <button
              type="button"
              className="register-popup__dismiss"
              onClick={() => setShowSessionsPopup(false)}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  )
}
