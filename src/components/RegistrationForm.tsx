import { useState, type FormEvent } from 'react'
import { PixelButton } from './PixelButton'

type RegistrationFormProps = {
  roleName: string
  fantasyClass: string
}

export function RegistrationForm({ roleName, fantasyClass }: RegistrationFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [resumeName, setResumeName] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    setSubmitted(true)
    form.reset()
    setResumeName('')
  }

  if (submitted) {
    return (
      <div className="success-banner" role="status">
        Quest accepted, adventurer. Your {fantasyClass} registration is locked in (UI-only —
        refine backend later).
      </div>
    )
  }

  return (
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
  )
}
