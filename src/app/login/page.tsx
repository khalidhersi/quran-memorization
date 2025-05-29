'use client'

import { useEffect } from 'react'
import {
  signInWithPopup,
  signInAnonymously,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
} from 'firebase/auth'
import { auth, googleProvider } from '@/firebase'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push('/') // ✅ Go to homepage after login
    }
    if (isInStandaloneMode()) {
        alert('Sign-in is not supported inside the app. Please open in Safari or Chrome.')
        return
      }
  }, [user, loading])

  // ✅ Check for popup support
  const isPopupSupported = () => {
    try {
      const popup = window.open('', '', 'width=1,height=1')
      if (!popup) return false
      popup.close()
      return true
    } catch (e) {
      return false
    }
  }

  const handleGoogleLogin = async () => {
    try {
      if (isPopupSupported()) {
        await signInWithPopup(auth, googleProvider)
      } else {
        alert('Sign-in not supported in this browser. Please open in Chrome or Safari.')
      }
    } catch (error) {
      console.error('Google login failed:', error)
    }
  }

  const isInStandaloneMode = () => {
    // Extend navigator type to safely access `standalone`
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (typeof navigator !== 'undefined' && (navigator as any).standalone === true)
    )
  }
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Welcome to Quran Memory</h1>
        <p className="mb-6 text-gray-600">Please sign in with your Google account to continue</p>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full px-6 py-3 rounded-md bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
