"use client"

import { useEffect } from "react"
import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth"
import { auth, googleProvider } from "@/firebase"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { user } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.replace("/")
  }, [user, router])

  // Handle Google redirect result
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          router.push("/")
        }
      })
      .catch((error) => {
        console.error("Google redirect login failed:", error)
      })
  }, [router])

  const handleGoogleLogin = () => {
    signInWithRedirect(auth, googleProvider)
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
