import type { Role } from '../data/roles'
import { MegaphoneIcon, PaletteIcon, ShieldIcon, SwordsIcon } from './RoleIcons'

const icons = {
  swords: SwordsIcon,
  megaphone: MegaphoneIcon,
  palette: PaletteIcon,
  shield: ShieldIcon,
}

const roleImageBySlug: Partial<Record<Role['slug'], string>> = {
  'customer-success': '/role-icons/customer-success.png',
  'business-development': '/role-icons/business-development.png',
  marketing: '/role-icons/marketing.png',
  creatives: '/role-icons/creatives.png',
}

type RoleCardProps = {
  role: Role
  selected: boolean
  onSelect: () => void
}

export function RoleCard({ role, selected, onSelect }: RoleCardProps) {
  const Icon = icons[role.icon]
  const roleImage = roleImageBySlug[role.slug]

  return (
    <button
      type="button"
      className={`role-card ${selected ? 'is-selected' : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="picked-badge">. PICKED</span>
      <span
        className="role-icon text-ink"
        style={{ background: role.accent }}
        aria-hidden
      >
        {roleImage ? (
          <img className="role-icon__img" src={roleImage} alt="" draggable={false} />
        ) : (
          <Icon />
        )}
      </span>
      <h3>{role.className}</h3>
      <p className="role-tags">{role.tags.join(' · ')}</p>
      <p>{role.description}</p>
      <div className="role-stats">
        {role.stats.map((stat) => (
          <span key={stat.label}>
            {stat.value} {stat.label}
          </span>
        ))}
      </div>
    </button>
  )
}
