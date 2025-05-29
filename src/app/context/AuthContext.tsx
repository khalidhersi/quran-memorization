"use client"
import { createContext, useEffect, useState, ReactNode, useContext } from "react"
import { onAuthStateChanged, getRedirectResult, User, signOut } from "firebase/auth"
import { auth } from "@/firebase"

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
    let unsub: () => void

    const initAuth = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result?.user) {
          setUser(result.user)
        }

        unsub = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser)
          setLoading(false)
        })
      } catch (error) {
        console.error("Redirect result error:", error)
        setLoading(false)
      }
    }

    initAuth()

    return () => {
      if (unsub) unsub()
    }
  }, [])

  const logout = () => {
    signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
