// src/components/ProtectedRoute.tsx
"use client"

import { useAuth } from "@/app/context/AuthContext"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.push("/")
    }
  }, [user, pathname, loading])

  if (!user && pathname !== "/login") return null

  return <>{children}</>
}
