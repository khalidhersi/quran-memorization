import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { notoSansArabic } from "./fonts"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Quran Memory",
  description: "A Quran memorization application",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansArabic.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <div className="flex min-h-screen flex-col">
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - only visible on larger screens */}
                <div className="hidden lg:block">
                  <AppSidebar />
                </div>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</main>
              </div>

              {/* Bottom navigation - only visible on mobile */}
              <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
                <BottomNav />
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
