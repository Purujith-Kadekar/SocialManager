import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'

/**
 * Shared layout for legal pages (/terms, /privacy).
 * Renders a slim header with the logo + back-to-home link and a footer
 * with the copyright + cross-links to the other legal page.
 */
export function LegalPage({
  title,
  effectiveDate,
  children,
}: {
  title: string
  effectiveDate: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/40 sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo size={32} withText textClassName="text-lg" />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to home
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex-1 w-full max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: {effectiveDate}
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:font-medium [&_h3]:mt-6 [&_h3]:mb-2 [&_a]:text-primary [&_a]:underline [&_a:hover]:opacity-80 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_li]:leading-relaxed [&_p]:leading-relaxed">
          {children}
        </div>
      </main>

      <footer className="border-t border-border/40 mt-16">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>
              © {new Date().getFullYear()} SocialManager · Developed by Purujith Kadekar
            </span>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <a
                href="https://github.com/Purujith-Kadekar/SocialManager"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
