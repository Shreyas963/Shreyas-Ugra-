import type React from "react"
import type { Metadata } from "next"
import { Inter, Sora } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import PersonJsonLd from "@/components/person-json-ld"
import { getSiteUrl, person } from "@/lib/site-config"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" })

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${person.brandName} | Full Stack & AI Developer — Portfolio`,
    template: `%s | ${person.brandName}`,
  },
  description: person.description,
  keywords: [
    person.brandName,
    person.firstName,
    "Shreyas portfolio",
    "Shreyas developer",
    "Shreyas programmer",
    "Shreyas Hamburg",
    "Shreyas Germany",
    "Shreyas Ugra portfolio",
    "Shreyas Ugra developer",
    "Shreyas Ugra Hamburg",
    person.fullName,
    "Shreyas Ugra T V",
    "Shreyas developer Germany",
    "Full Stack Developer Germany",
    "AI Developer portfolio",
    "RPTU Kaiserslautern",
    "MERN stack developer",
  ],
  authors: [{ name: person.brandName, url: siteUrl }],
  creator: person.brandName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: `${person.brandName} — Portfolio`,
    title: `${person.brandName} | Full Stack & AI Developer`,
    description: person.description,
    images: [{ url: "/profile.jpg", width: 1200, height: 1200, alt: person.brandName }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${person.brandName} | Portfolio`,
    description: person.description,
    images: ["/profile.jpg"],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable} font-sans antialiased`}>
        <PersonJsonLd />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
