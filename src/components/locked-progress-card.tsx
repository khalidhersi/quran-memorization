"use client"

import { useState, useEffect } from "react"
import { Lock, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface LockedProgressCardProps {
  title: string
  isLocked: boolean
  tooltipMessage?: string
  onUnlockedClick: () => void
  className?: string
}

export function LockedProgressCard({
  title,
  isLocked,
  tooltipMessage = "Memorize the previous ayah to unlock",
  onUnlockedClick,
  className,
}: LockedProgressCardProps) {
  const [wasLocked, setWasLocked] = useState(isLocked)
  const [showAnimation, setShowAnimation] = useState(false)

  // Track when the card transitions from locked to unlocked to trigger animation
  useEffect(() => {
    if (wasLocked && !isLocked) {
      setShowAnimation(true)
      const timer = setTimeout(() => {
        setShowAnimation(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
    setWasLocked(isLocked)
  }, [isLocked, wasLocked])

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              "relative flex h-24 cursor-pointer items-center justify-between p-4 transition-all duration-300",
              isLocked
                ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800",
              showAnimation && "animate-pulse border-emerald-500",
              className,
            )}
            onClick={() => !isLocked && onUnlockedClick()}
            tabIndex={isLocked ? -1 : 0}
            aria-disabled={isLocked}
            role="button"
          >
            <div className="flex items-center gap-3">
              {isLocked ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                  <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300">
                  <ChevronRight className="h-6 w-6" />
                </div>
              )}
              <div>
                <h3
                  className={cn(
                    "text-lg font-medium",
                    isLocked ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100",
                  )}
                >
                  {title}
                </h3>
                <p
                  className={cn(
                    "text-sm",
                    isLocked ? "text-gray-400 dark:text-gray-500" : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  {isLocked ? "Locked" : "Continue to next"}
                </p>
              </div>
            </div>

            {/* Overlay for locked state */}
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-200/50 backdrop-blur-[1px] dark:bg-gray-800/50">
                <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-sm dark:bg-gray-900/90">
                  <Lock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Locked</span>
                </div>
              </div>
            )}
          </Card>
        </TooltipTrigger>
        {isLocked && (
          <TooltipContent side="top" className="max-w-xs text-center">
            <p>{tooltipMessage}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}
