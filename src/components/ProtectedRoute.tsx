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
      router.push('/dashboard'); 
    }
  }, [user, pathname])

  if (!user && pathname !== "/login") return null


if (user) return null; // already redirected


  return <>{children}</>
}
