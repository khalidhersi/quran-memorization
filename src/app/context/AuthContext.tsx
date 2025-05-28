'use client'
import { createContext, useEffect, useState, ReactNode, useContext } from "react"
import { getRedirectResult, onAuthStateChanged, signOut, User } from "firebase/auth"
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
    // 🔧 DEBUG: Force logout on every refresh
    // signOut(auth) // ⚠️ Comment this out for production

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, setUser)

  // Get redirect result
  getRedirectResult(auth)
    .then((result) => {
      if (result?.user) {
        setUser(result.user)
      }
    })
    .catch((error) => {
      console.error("Redirect login result failed:", error)
    })

  return () => unsubscribe()
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
