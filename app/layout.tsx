import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { JotaiProvider } from "@/components/jotai-provider"
import { PrivyProvider } from '@privy-io/react-auth';
import PrivyProviders from "@/components/privy-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CyberShield - Incident Management Platform",
  description: "Track and manage cybersecurity incidents",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <PrivyProviders>
          <JotaiProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </JotaiProvider>
        </PrivyProviders>
      </body>
    </html>
  )
}
