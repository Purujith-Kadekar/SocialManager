import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "SocialManager API",
  description: "Self-hosted recipe API for SocialManager",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
