"use client"

import { useEffect } from "react"
import { signInWithRedirect, getRedirectResult, signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/firebase"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext" 

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // Redirect to home if logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace("/")
    }
  }, [user, loading, router])

  // Catch redirect result (required after mobile login)
  useEffect(() => {
    getRedirectResult(auth).catch((error) => {
      console.error("Google login failed:", error)
    })
  }, [])


  const handleGoogleLogin = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  
    try {
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider)
      } else {
        await signInWithPopup(auth, googleProvider)
      }
    } catch (error) {
      console.error("Google login failed:", error)
      alert("Google login failed. Please try again.")
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center from-blue-50 to-blue-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Welcome to Quran Memory</h1>
        <p className="mb-6 text-gray-600">Please sign in with your Google account to continue</p>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full px-6 py-3 rounded-md bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
