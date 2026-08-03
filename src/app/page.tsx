import Link from 'next/link'
import { ArrowRight, Server, Shield, Github, Package, Database, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/logo'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Logo size={32} withText textClassName="text-lg" />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#recipes" className="hover:text-foreground transition-colors">Recipes</Link>
            <Link href="#api" className="hover:text-foreground transition-colors">API</Link>
            <a
              href="https://github.com/Purujith-Kadekar/SocialManager"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/api/v1/recipes">Browse API</Link>
            </Button>
            <Button asChild className="bg-indigo-gradient text-white border-0 hover:opacity-90">
              <a
                href="https://github.com/Purujith-Kadekar/SocialManager"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                View Source
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-indigo-radial" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              Self-hosted recipe API • Supabase powered
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              All your messaging apps
              <br />
              <span className="text-indigo-gradient">in one place</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              SocialManager is a free, open-source desktop app that combines WhatsApp, Telegram,
              Discord, Slack, Gmail, and 300+ more services into a single unified inbox.
              This is the recipe API that powers it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild className="bg-indigo-gradient text-white border-0 hover:opacity-90">
                <Link href="/api/v1/recipes">
                  <Server className="mr-2 h-5 w-5" />
                  Browse the recipe catalog
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a
                  href="https://github.com/Purujith-Kadekar/SocialManager"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
              <span>310+ recipes</span>
              <span>Drop-in Ferdium replacement</span>
              <span>Self-hosted</span>
              <span>Open source</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-gradient">310+</div>
              <div className="text-sm text-muted-foreground mt-1">Recipe catalog</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-gradient">5GB</div>
              <div className="text-sm text-muted-foreground mt-1">Storage included</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-gradient">100%</div>
              <div className="text-sm text-muted-foreground mt-1">Open source</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-gradient">$0</div>
              <div className="text-sm text-muted-foreground mt-1">Forever free</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for the SocialManager desktop app
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete backend for serving the recipe catalog — hosted on Vercel + Supabase,
            managed through a private admin dashboard.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Server className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Ferdium-compatible API</CardTitle>
              <CardDescription>
                Drop-in replacement for api.ferdium.org. Same endpoints, same response format,
                zero app code changes needed.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Self-hosted</CardTitle>
              <CardDescription>
                Run it on your own Vercel + Supabase account. Full control over the recipe
                catalog, storage, and admin access. No third-party dependencies.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Code className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Open source</CardTitle>
              <CardDescription>
                MIT licensed. Fork it, customize it, host your own recipe catalog.
                Built with Next.js, Supabase, and the shadcn/ui component library.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* API section */}
      <section id="api" className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="secondary" className="mb-4">Developer API</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Four endpoints. Zero friction.
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              The SocialManager desktop app talks to this API to fetch recipes, search the catalog,
              and download packages. All endpoints are public — no auth required for the desktop app.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <code className="text-primary font-mono text-xs bg-primary/5 px-2 py-1 rounded">GET /api/v1/recipes</code>
                <span className="text-muted-foreground">Full catalog (310+ recipes)</span>
              </li>
              <li className="flex items-start gap-3">
                <code className="text-primary font-mono text-xs bg-primary/5 px-2 py-1 rounded">GET /api/v1/recipes/popular</code>
                <span className="text-muted-foreground">Featured recipes</span>
              </li>
              <li className="flex items-start gap-3">
                <code className="text-primary font-mono text-xs bg-primary/5 px-2 py-1 rounded">GET /api/v1/recipes/search?needle=X</code>
                <span className="text-muted-foreground">Search by name</span>
              </li>
              <li className="flex items-start gap-3">
                <code className="text-primary font-mono text-xs bg-primary/5 px-2 py-1 rounded">GET /api/v1/recipes/download/&#123;id&#125;</code>
                <span className="text-muted-foreground">Download .tar.gz package</span>
              </li>
            </ul>
          </div>
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-sm font-mono">Example response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono overflow-x-auto text-muted-foreground">
{`[
  {
    "id": "whatsapp",
    "name": "WhatsApp",
    "description": "WhatsApp messenger",
    "category": "messaging",
    "icon": "https://...",
    "hasDirectMessages": true,
    "hasIndirectMessages": false
  },
  {
    "id": "telegram",
    "name": "Telegram",
    "category": "messaging",
    ...
  }
]`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recipes showcase */}
      <section id="recipes" className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            310+ services supported
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From the most popular messengers to niche productivity tools —
            there's a recipe for everything.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            'WhatsApp', 'Telegram', 'Discord', 'Slack', 'Gmail', 'Instagram',
            'Twitter', 'Facebook', 'YouTube', 'Reddit', 'Spotify', 'Twitch',
            'Messenger', 'Signal', 'Teams', 'Zoom', 'Notion', 'Linear',
          ].map((name) => (
            <div
              key={name}
              className="aspect-square rounded-lg bg-muted/30 border border-border/40 flex flex-col items-center justify-center p-4 hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-indigo-gradient mb-2 flex items-center justify-center text-white font-bold text-lg">
                {name[0]}
              </div>
              <span className="text-xs text-muted-foreground text-center">{name}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/api/v1/recipes">
              View all 310 recipes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-indigo-gradient text-white border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Browse the recipe catalog right now, or fork the project on GitHub
              to run your own instance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/api/v1/recipes">Browse recipes</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white" asChild>
                <a
                  href="https://github.com/Purujith-Kadekar/SocialManager"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-auto">
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Logo size={24} withText textClassName="font-bold" />
              </div>
              <p className="text-sm text-muted-foreground">
                Open-source messaging app aggregator. Self-hosted recipe API.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="/api/v1/recipes" className="hover:text-foreground">Recipe catalog</Link></li>
                <li><Link href="#api" className="hover:text-foreground">API docs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://github.com/Purujith-Kadekar/SocialManager"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>
              © {new Date().getFullYear()} SocialManager · Developed by Purujith Kadekar
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
