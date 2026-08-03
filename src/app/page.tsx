import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowRight, Download, Server, Shield, Zap, Github, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-gradient flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">SocialManager</span>
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
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild className="bg-indigo-gradient text-white border-0 hover:opacity-90">
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
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
                <Link href="/signup">
                  <Download className="mr-2 h-5 w-5" />
                  Get Started Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/api/v1/recipes">
                  <Server className="mr-2 h-5 w-5" />
                  Browse API
                </Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
              <span>✓ 310+ recipes</span>
              <span>✓ Cross-device sync</span>
              <span>✓ Custom recipe uploads</span>
              <span>✓ Open source</span>
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
              <div className="text-3xl font-bold text-indigo-gradient">3</div>
              <div className="text-sm text-muted-foreground mt-1">Auth methods</div>
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
            A complete backend infrastructure — recipe catalog, user accounts, cross-device sync,
            and admin management — all hosted on Vercel + Supabase.
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
              <CardTitle>Secure auth</CardTitle>
              <CardDescription>
                Email + password, magic link, and Google OAuth — all powered by Supabase Auth
                with Row Level Security.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Cross-device sync</CardTitle>
              <CardDescription>
                Sign in on any device and your services, settings, and workspaces sync instantly.
                Powered by Supabase Postgres.
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
              download packages, and sync your services. All endpoints are public except service sync,
              which requires authentication.
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
              Create an account to sync your services across devices, or browse the recipe
              catalog right now — no signup required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Create free account</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white" asChild>
                <Link href="/api/v1/recipes">Browse recipes</Link>
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
                <div className="h-6 w-6 rounded bg-indigo-gradient flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">SocialManager</span>
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
                <li><Link href="/signup" className="hover:text-foreground">Sign up</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Sign in</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/admin" className="hover:text-foreground">Admin dashboard</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground">User dashboard</Link></li>
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
          <div className="border-t border-border/40 pt-6 text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} SocialManager. Open source under MIT License.
          </div>
        </div>
      </footer>
    </div>
  )
}
