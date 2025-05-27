"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface XpProgressProps {
  xp: number
  level: number
  xpForNextLevel: number
  className?: string
  showAnimation?: boolean
}

export function XpProgress({ xp, level, xpForNextLevel, className, showAnimation = false }: XpProgressProps) {
  const [animatedXp, setAnimatedXp] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Calculate XP progress percentage
  const xpProgress = Math.min(100, ((xp % xpForNextLevel) / xpForNextLevel) * 100)

  // Animate XP when it changes
  useEffect(() => {
    if (showAnimation) {
      setIsAnimating(true)
      const startXp = animatedXp
      const endXp = xp % xpForNextLevel
      const duration = 1000 // 1 second
      const startTime = Date.now()

      const animateXp = () => {
        const now = Date.now()
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)

        setAnimatedXp(startXp + Math.floor((endXp - startXp) * progress))

        if (progress < 1) {
          requestAnimationFrame(animateXp)
        } else {
          setIsAnimating(false)
        }
      }

      requestAnimationFrame(animateXp)
    } else {
      setAnimatedXp(xp % xpForNextLevel)
    }
  }, [xp, xpForNextLevel, showAnimation, animatedXp])

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            <span className="text-xs font-bold">{level}</span>
          </div>
          <span className="font-medium">Level {level}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={cn("text-sm transition-all", isAnimating && "text-amber-500 font-bold")}>
            {showAnimation ? animatedXp : xp % xpForNextLevel}
          </span>
          <span className="text-sm text-muted-foreground">/ {xpForNextLevel} XP</span>
          {isAnimating && <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />}
        </div>
      </div>
      <Progress
        value={showAnimation ? (animatedXp / xpForNextLevel) * 100 : xpProgress}
        className={cn("h-2 transition-all", isAnimating && "bg-amber-100 dark:bg-amber-900 [&>div]:bg-amber-500")}
      />
    </div>
  )
}
