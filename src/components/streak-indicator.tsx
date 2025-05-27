"use client"

import { useState, useEffect } from "react"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakIndicatorProps {
  streak: number
  className?: string
  showAnimation?: boolean
}

export function StreakIndicator({ streak, className, showAnimation = false }: StreakIndicatorProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (showAnimation) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [streak, showAnimation])

  return (
    <div
      className={cn("flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 dark:bg-orange-900/30", className)}
    >
      <div className={cn("flex items-center justify-center", isAnimating && "animate-bounce")}>
        <Flame className={cn("h-5 w-5 text-orange-500", isAnimating && "text-orange-600 animate-pulse")} />
      </div>
      <span className={cn("font-medium text-orange-700 dark:text-orange-300", isAnimating && "font-bold")}>
        {streak} Day{streak !== 1 ? "s" : ""}
      </span>
    </div>
  )
}
