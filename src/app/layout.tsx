// src/app/layout.tsx
import "./globals.css"
import { Inter } from "next/font/google"
import { notoSansArabic } from "./fonts"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { ThemeProvider as CustomThemeProvider } from "./context/theme-context"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata = {
  title: "Quran Memory",
  description: "A Quran memorization application",
}

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="en" suppressHydrationWarning>
          <body className={`${inter.variable} ${notoSansArabic.variable} font-sans`}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              <CustomThemeProvider>
                <AuthProvider>
                  <SidebarProvider>
                    <ProtectedRoute>
                      {/* ✅ All your app content including SettingsPage is now wrapped in the custom ThemeProvider */}
                      <div className="flex min-h-screen flex-col">
                        <div className="flex flex-1 overflow-hidden">
                          <div className="hidden lg:block">
                            <AppSidebar />
                          </div>
                          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</main>
                        </div>
                        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
                          <BottomNav />
                        </div>
                      </div>
                    </ProtectedRoute>
                  </SidebarProvider>
                </AuthProvider>
              </CustomThemeProvider>
            </ThemeProvider>
          </body>
        </html>
  )
}
