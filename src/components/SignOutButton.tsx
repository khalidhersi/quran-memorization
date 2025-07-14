'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleSignOut = async () => {
    try {
      logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  )
}
