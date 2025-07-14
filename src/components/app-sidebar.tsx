"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, PencilRulerIcon, Home, Sliders } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar, // ✅ import hook
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar() // ✅ access context

  if (isMobile) return null // ✅ Hide sidebar entirely on mobile

  const navItems = [
    { title: "Dashboard", icon: Home, href: "/" },
    { title: "Memorize", icon: Book, href: "/sandbox" },
    { title: "Test the Hafidh", icon: PencilRulerIcon, href: "/exam" },
    { title: "Settings", icon: Sliders, href: "/settings/memorization" },
    { title: "Sandbox", icon: Sliders, href: "/memorize" },
  ]

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false) // ✅ close sidebar on mobile
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <Book className="h-6 w-6 text-emerald-600" />
          <span className="text-m font-semibold">Memorize the Quran</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                onClick={handleNavClick} // ✅ attach handler here
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Ahmed</span>
            <span className="text-xs text-muted-foreground">View Profile</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
