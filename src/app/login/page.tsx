"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { signInWithPopup, signInWithRedirect } from "firebase/auth"
import { auth, googleProvider } from "@/firebase"
import { isMobile } from "react-device-detect"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/")
      }
    }
  }, [user, loading])

  const handleGoogleLogin = async () => {
    if (isMobile) {
      await signInWithRedirect(auth, googleProvider)
    } else {
      await signInWithPopup(auth, googleProvider)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome</h1>
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
