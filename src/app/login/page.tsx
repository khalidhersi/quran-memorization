'use client'

import { useEffect } from 'react'
import {
  signInWithRedirect,
  signInWithPopup,
} from 'firebase/auth'
import { auth, googleProvider } from '@/firebase'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { isMobile } from 'react-device-detect'

function isSafari() {
  return (
    typeof navigator !== 'undefined' &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    const redirected = localStorage.getItem('redirected')

    if (!loading && user) {
      localStorage.removeItem('redirected')
      // Safari needs slight delay to properly restore auth session
      if (isSafari()) {
        setTimeout(() => {
          router.push('/')
        }, 500)
      } else {
        router.push('/')
      }
    }

    if (!loading && !user && redirected === 'true') {
      // Let Firebase hydrate session a bit longer on Safari
      setTimeout(() => {
        if (!auth.currentUser) {
          console.warn('Firebase auth still empty after delay.')
          localStorage.removeItem('redirected')
        }
      }, 3000)
    }
  }, [user, loading])

  const handleGoogleLogin = async () => {
    try {
      if (isMobile || isSafari()) {
        localStorage.setItem('redirected', 'true')
        await signInWithRedirect(auth, googleProvider)
      } else {
        await signInWithPopup(auth, googleProvider)
      }
    } catch (error) {
      console.error('Google login failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Quran Memory</h1>
        <p className="mb-6">Please sign in with your Google account</p>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
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
