"use client"

import { useState, useEffect } from "react"
import { Award, Flame, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StreakMilestoneRewardProps {
  streak: number
  isOpen: boolean
  onClose: () => void
  onClaim: () => void
  className?: string
}

export function StreakMilestoneReward({ streak, isOpen, onClose, onClaim, className }: StreakMilestoneRewardProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  // Get milestone reward details based on streak count
  const getMilestoneDetails = () => {
    switch (streak) {
      case 7:
        return {
          title: "One Week Streak!",
          description: "You've memorized Quran for 7 days in a row!",
          reward: "+100 XP",
          color: "from-amber-500 to-orange-500",
          xpAmount: 100,
        }
      case 30:
        return {
          title: "One Month Streak!",
          description: "Amazing dedication! 30 days of consistent memorization!",
          reward: "+500 XP",
          color: "from-emerald-500 to-teal-500",
          xpAmount: 500,
        }
      case 100:
        return {
          title: "Century Streak!",
          description: "Incredible! 100 days of Quran memorization!",
          reward: "+1000 XP",
          color: "from-blue-500 to-indigo-500",
          xpAmount: 1000,
        }
      case 365:
        return {
          title: "One Year Streak!",
          description: "Mashallah! A full year of daily Quran memorization!",
          reward: "+5000 XP",
          color: "from-purple-500 to-pink-500",
          xpAmount: 5000,
        }
      default:
        return {
          title: "Streak Milestone!",
          description: "You've reached a new streak milestone!",
          reward: "+50 XP",
          color: "from-gray-500 to-slate-500",
          xpAmount: 50,
        }
    }
  }

  const { title, description, reward, color } = getMilestoneDetails()

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", className)}>
      <div
        className={cn(
          "w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-900 sm:max-w-md",
          isAnimating && "animate-bounce-small",
        )}
      >
        <div className={cn("relative overflow-hidden bg-gradient-to-r p-4 text-white sm:p-6", color)}>
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-full bg-white/20 p-1 text-white hover:bg-white/30"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute -right-4 -top-4 h-20 w-20 rotate-12 text-white/20 sm:h-24 sm:w-24">
            <Award className="h-full w-full" />
          </div>
          <div
            className={cn(
              "mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 sm:h-16 sm:w-16",
              isAnimating && "animate-pulse",
            )}
          >
            <Award className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
          <p className="mt-1 text-sm text-white/90 sm:text-base">{description}</p>
        </div>
        <div className="p-4 sm:p-6">
          <div className="mb-4 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-amber-50 p-3 dark:bg-amber-950/50">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500 sm:h-5 sm:w-5" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300 sm:text-base">Reward</span>
              </div>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400 sm:text-base">{reward}</span>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/50">
              <Flame className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300 sm:text-base">
                Current Streak: {streak} days
              </span>
            </div>
          </div>

          <Button onClick={onClaim} className="w-full">
            Claim Reward
          </Button>
        </div>
      </div>
    </div>
  )
}
