// context/AuthContext.tsx
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
    const checkAuth = async () => {
      try {
        await getRedirectResult(auth) // resolves silently if no redirect
      } catch (err) {
        console.error('Redirect result error:', err)
      }
  
      const unsub = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser)
        setLoading(false)
      })
  
      return () => unsub()
    }
  
    checkAuth()
  }, [])
  

  const logout = () => {
    localStorage.removeItem('redirected')
    signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
