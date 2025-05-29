'use client'

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from 'react'
import {
  onAuthStateChanged,
  getRedirectResult,
  signOut,
  User,
} from 'firebase/auth'
import { auth } from '@/firebase'

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
    const init = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result?.user) {
          setUser(result.user)
        }
      } catch (err) {
        console.error('getRedirectResult failed:', err)
      } finally {
        // Always listen to auth state
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser)
          setLoading(false)
        })
        return unsubscribe
      }
    }

    const unsubscribePromise = init()
    return () => {
      unsubscribePromise?.then(unsub => unsub && unsub())
    }
  }, [])

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
