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
  browserLocalPersistence,
  setPersistence,
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

  // useEffect(() => {

  //       // 🔧 DEBUG: Force logout on every refresh
  //   // signOut(auth) // ⚠️ Comment this out for production
  //   // Handle redirect result first (important on mobile)
  //   getRedirectResult(auth)
  //     .then((result) => {
  //       if (result?.user) {
  //         setUser(result.user)
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Redirect login result failed:', error)
  //     })

  //   // Then listen to auth state changes
  //   const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
  //     setUser(firebaseUser)
  //     setLoading(false)
  //   })

  //   return () => unsubscribe()
  // }, [])
  
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
  
    const initAuth = async () => {
      try {
        // 🔐 Ensure session persists (important on mobile)
        await setPersistence(auth, browserLocalPersistence);
  
        // ⏪ Handle mobile redirect sign-ins
        const result = await getRedirectResult(auth);
        if (result?.user) {
          setUser(result.user);
          // Optional: force reload to reflect user state immediately
          // window.location.href = '/'; 
        }
  
        // 👀 Watch for any auth state changes
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser);
          setLoading(false);
        });
      } catch (err) {
        console.error('[Auth Error]', err);
        setLoading(false);
      }
    };
  
    initAuth();
  
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  
  
  

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
