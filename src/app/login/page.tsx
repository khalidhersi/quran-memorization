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

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    const redirected = localStorage.getItem('redirected')

    // If user is signed in after redirect, redirect them to "/"
    if (!loading && user) {
      localStorage.removeItem('redirected')
      router.push('/')
    }

    // If user is not logged in, and came back from redirect
    if (!loading && !user && redirected === 'true') {
      // wait a bit more to allow Firebase to hydrate
      setTimeout(() => {
        if (!auth.currentUser) {
          console.warn('Auth still empty after delay')
          localStorage.removeItem('redirected')
        }
      }, 3000)
    }
  }, [user, loading])

  const isIosSafari = () => {
    const ua = window.navigator.userAgent
    return /iP(ad|od|hone)/i.test(ua) && /WebKit/i.test(ua) && !/CriOS|FxiOS/i.test(ua)
  }
  
  const handleGoogleLogin = async () => {
    try {
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      const forceRedirect = isIOS && isSafari
  
      if (forceRedirect) {
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
