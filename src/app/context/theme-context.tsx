"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = {
  background: string
  primary: string
  fontColor: string
}

export type ThemeSettings = {
  background: string
  primary: string
  fontColor: string
}

// bg color when page initially loads
const defaultTheme: Theme = {
  background: "#00000", 
  primary: "142.1 70.6% 45.3%",
  fontColor: "white"
}

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  // Load from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme-settings")
    if (storedTheme) {
      try {
        setTheme(JSON.parse(storedTheme))
      } catch {
        console.warn("Invalid theme settings in localStorage.")
      }
    }
  }, [])

  // Save to localStorage when theme changes
  useEffect(() => {
    localStorage.setItem("theme-settings", JSON.stringify(theme))
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--background", theme.background)
    root.style.setProperty("--primary", theme.primary)
    root.style.setProperty("--fontColor", theme.fontColor)
  }, [theme])

   // Save to localStorage when theme changes
   useEffect(() => {
    localStorage.setItem("theme-settings", JSON.stringify(theme))
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
