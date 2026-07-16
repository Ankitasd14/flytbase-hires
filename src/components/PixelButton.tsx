import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'magenta'

type CommonProps = {
  children: ReactNode
  variant?: Variant
  className?: string
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: never
  }

type LinkProps = CommonProps & {
  to: string
}

const variantClass: Record<Variant, string> = {
  primary: 'pixel-button--primary',
  secondary: 'pixel-button--secondary',
  magenta: 'pixel-button--magenta',
}

export function PixelButton(props: ButtonProps | LinkProps) {
  const { children, variant = 'primary', className = '' } = props
  const classes = `pixel-button ${variantClass[variant]} ${className}`.trim()

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    )
  }

  const buttonProps = props as ButtonProps
  const {
    children: _c,
    variant: _v,
    className: _cl,
    type = 'button',
    ...rest
  } = buttonProps

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}
