"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, BarChart, Home, Settings, PencilRulerIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/",
    },
    {
      title: "Memorize",
      icon: Book,
      href: "/memorize",
    },
    // {
    //   title: "Stats",
    //   icon: BarChart,
    //   href: "/progress-stats",
    // },
    { title: "Test the Hafidh", icon: PencilRulerIcon, href: "/exam" },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings/memorization",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-neutral-900 border-t">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          if (!pathname) return null;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center",
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  )
}
