import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SocialManager — All your messaging apps in one place",
  description:
    "SocialManager is a free, open-source desktop app that organizes your messaging apps, email, and productivity tools into one unified inbox. Self-hosted recipe API powered by Supabase.",
  keywords: [
    "SocialManager",
    "Ferdium",
    "messaging",
    "WhatsApp",
    "Telegram",
    "Discord",
    "desktop app",
    "recipe API",
    "Supabase",
  ],
  authors: [{ name: "SocialManager" }],
  openGraph: {
    title: "SocialManager",
    description: "All your messaging apps in one place. Self-hosted recipe API.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SocialManager",
    description: "All your messaging apps in one place.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
