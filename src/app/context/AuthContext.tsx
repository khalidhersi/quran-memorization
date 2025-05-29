'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth } from '@/firebase'
import { onAuthStateChanged, getRedirectResult, signOut, User } from 'firebase/auth'

type AuthContextType = {
  user: User | null
  loading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result?.user) {
          console.log("Redirected user:", result.user)
          setUser(result.user)
        }
      } catch (e) {
        console.error("getRedirectResult error:", e)
      }

      // Listen to future changes after handling redirect
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        console.log("Auth state changed:", firebaseUser)
        setUser(firebaseUser)
        setLoading(false)
      })

      return () => unsubscribe()
    }

    checkRedirect()
  }, [])

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
