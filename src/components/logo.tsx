import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * SocialManager brand logo — the same shield + lock mark used by the
 * desktop Electron app. Keeps the webapp visually consistent with the
 * desktop client.
 *
 * Usage:
 *   <Logo />                       // 32x32 shield, links to /
 *   <Logo size={40} />             // 40x40 shield, links to /
 *   <Logo withText />              // shield + "SocialManager" wordmark
 *   <Logo withText size={40} textClassName="text-lg font-bold" />
 *   <Logo asLink={false} />        // just the mark, no link wrapper
 */
type LogoProps = {
  size?: number
  withText?: boolean
  asLink?: boolean
  className?: string
  textClassName?: string
}

export function Logo({
  size = 32,
  withText = false,
  asLink = true,
  className,
  textClassName,
}: LogoProps) {
  const mark = (
    <Image
      src="/logo.svg"
      alt="SocialManager logo"
      width={size}
      height={size}
      priority
      className={cn('shrink-0', className)}
    />
  )

  const content = withText ? (
    <span className="flex items-center gap-2">
      {mark}
      <span className={cn('font-bold', textClassName)}>SocialManager</span>
    </span>
  ) : (
    mark
  )

  if (!asLink) return content

  return (
    <Link href="/" aria-label="SocialManager home" className="inline-flex">
      {content}
    </Link>
  )
}
