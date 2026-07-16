type IconProps = { className?: string }

export function SwordsIcon({ className = 'h-7 w-7' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20L14 10M10 14L20 4M14 10l2-6 4 2-2 2M10 14l-6 2 2 4 2-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  )
}

export function MegaphoneIcon({ className = 'h-7 w-7' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10v4h3l6 3V7L7 10H4zm13 1c1.5.5 2 1.5 2 3s-.5 2.5-2 3M17 8c2 .8 3 2.5 3 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  )
}

export function PaletteIcon({ className = 'h-7 w-7' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4c-5 0-8 3.5-8 8 0 3 2 5 4 5h2c1 0 1.5.8 1.5 1.5S10.5 20 12 20c4 0 8-3 8-8s-3-8-8-8z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="8" cy="10" r="1.2" fill="currentColor" />
      <circle cx="11" cy="7.5" r="1.2" fill="currentColor" />
      <circle cx="15" cy="8" r="1.2" fill="currentColor" />
      <circle cx="16.5" cy="12" r="1.2" fill="currentColor" />
    </svg>
  )
}

export function ShieldIcon({ className = 'h-7 w-7' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  )
}
