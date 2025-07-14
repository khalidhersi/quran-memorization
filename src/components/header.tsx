'use client'

import { SidebarTrigger } from '@/components/ui/sidebar' // adjust path if needed
import SignOutButton from '@/components/SignOutButton'   // adjust path if needed

type HeaderProps = {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 justify-between items-center gap-4 border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
        <h1 className="text-xl font-semibold">{title}</h1>
        {/* for future streak counting feature */}
         {/* <StreakIndicator streak={userData.streak} className="text-sm" /> */}
      </div>
      <SignOutButton />
    </header>
  )
}
