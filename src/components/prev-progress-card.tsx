"use client"

import { useState, useEffect } from "react"
import { Lock, ChevronRight, ChevronLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface PrevProgressCardProps {
  title: string
  isLocked: boolean
  tooltipMessage?: string
  onUnlockedClick: () => void
  className?: string
}

export function PrevProgressCard({
  title,
  isLocked,
  tooltipMessage = "Memorize the previous ayah to unlock",
  onUnlockedClick,
  className,
}: PrevProgressCardProps) {
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
                  <ChevronLeft className="h-6 w-6" />
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
                  {isLocked ? "Locked" : "Go back to previous"}
                </p>
              </div>
            </div>



          </Card>
        </TooltipTrigger>
 
      </Tooltip>
    </TooltipProvider>
  )
}
