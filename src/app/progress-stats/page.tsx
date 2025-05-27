"use client"

import { useState, useEffect } from "react"
import { Plus, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { XpProgress } from "@/components/xp-progress"
import { StreakIndicator } from "@/components/streak-indicator"
import { StreakMilestoneReward } from "@/components/streak-milestone-reward"

export default function ProgressStatsPage() {
  // User stats - would come from your backend in a real app
  const [userStats, setUserStats] = useState({
    xp: 1250,
    level: 5,
    xpForNextLevel: 500,
    streak: 6,
    lastStreakMilestone: 0,
  })

  const [showMilestoneReward, setShowMilestoneReward] = useState(false)
  const [showXpAnimation, setShowXpAnimation] = useState(false)
  const [showStreakAnimation, setShowStreakAnimation] = useState(false)

  // Check for streak milestones
  useEffect(() => {
    const milestones = [7, 30, 100, 365]
    const nextMilestone = milestones.find((m) => m === userStats.streak)

    if (nextMilestone && nextMilestone > userStats.lastStreakMilestone) {
      setShowMilestoneReward(true)
    }
  }, [userStats.streak, userStats.lastStreakMilestone])

  // Handle adding XP (demo function)
  const handleAddXp = () => {
    setUserStats((prev) => {
      const newXp = prev.xp + 50
      const xpForNextLevel = prev.xpForNextLevel
      const newLevel = prev.level + Math.floor((newXp - prev.xp) / xpForNextLevel)

      setShowXpAnimation(true)
      setTimeout(() => setShowXpAnimation(false), 2000)

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
      }
    })
  }

  // Handle increasing streak (demo function)
  const handleIncreaseStreak = () => {
    setUserStats((prev) => {
      setShowStreakAnimation(true)
      setTimeout(() => setShowStreakAnimation(false), 2000)

      return {
        ...prev,
        streak: prev.streak + 1,
      }
    })
  }

  // Handle claiming milestone reward
  const handleClaimReward = () => {
    setShowMilestoneReward(false)

    // Add XP based on milestone
    let xpBonus = 0
    if (userStats.streak === 7) xpBonus = 100
    else if (userStats.streak === 30) xpBonus = 500
    else if (userStats.streak === 100) xpBonus = 1000
    else if (userStats.streak === 365) xpBonus = 5000
    else xpBonus = 50

    setUserStats((prev) => {
      const newXp = prev.xp + xpBonus
      const xpForNextLevel = prev.xpForNextLevel
      const newLevel = prev.level + Math.floor(xpBonus / xpForNextLevel)

      setShowXpAnimation(true)
      setTimeout(() => setShowXpAnimation(false), 2000)

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        lastStreakMilestone: prev.streak,
      }
    })
  }

  return (
    <div className="bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger className="lg:hidden" />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-xl font-semibold">Progress Stats</h1>
          <StreakIndicator streak={userStats.streak} showAnimation={showStreakAnimation} className="text-sm" />
        </div>
      </header>

      <div className="mx-auto max-w-2xl p-4 lg:p-6">
        <Card className="mb-4 lg:mb-6">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your memorization journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 lg:space-y-6 lg:p-6">
            {/* XP and Level */}
            <XpProgress
              xp={userStats.xp}
              level={userStats.level}
              xpForNextLevel={userStats.xpForNextLevel}
              showAnimation={showXpAnimation}
            />

            {/* Streak */}
            <div className="flex items-center justify-between rounded-lg border p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300 lg:h-10 lg:w-10 ${showStreakAnimation ? "animate-pulse" : ""}`}
                >
                  <Trophy className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Daily Streak</h3>
                  <p className="text-xs text-muted-foreground lg:text-sm">
                    Keep memorizing daily to maintain your streak
                  </p>
                </div>
              </div>
              <StreakIndicator
                streak={userStats.streak}
                showAnimation={showStreakAnimation}
                className="bg-transparent dark:bg-transparent px-0"
              />
            </div>

            {/* Demo Controls */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button onClick={handleAddXp} className="flex-1 gap-2">
                <Plus className="h-4 w-4" />
                Add 50 XP
              </Button>
              <Button onClick={handleIncreaseStreak} variant="outline" className="flex-1 gap-2">
                <Trophy className="h-4 w-4" />
                Increase Streak
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Milestone information */}
        <Card>
          <CardHeader className="p-4 lg:p-6">
            <CardTitle>Streak Milestones</CardTitle>
            <CardDescription>Earn rewards for consistent memorization</CardDescription>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <div className="grid gap-3 lg:gap-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300">
                    <span className="text-xs font-bold">7</span>
                  </div>
                  <span className="text-sm lg:text-base">One Week Streak</span>
                </div>
                <span className="text-xs font-medium text-amber-600 lg:text-sm">+100 XP</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300">
                    <span className="text-xs font-bold">30</span>
                  </div>
                  <span className="text-sm lg:text-base">One Month Streak</span>
                </div>
                <span className="text-xs font-medium text-emerald-600 lg:text-sm">+500 XP</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <span className="text-xs font-bold">100</span>
                  </div>
                  <span className="text-sm lg:text-base">Century Streak</span>
                </div>
                <span className="text-xs font-medium text-blue-600 lg:text-sm">+1000 XP</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                    <span className="text-xs font-bold">365</span>
                  </div>
                  <span className="text-sm lg:text-base">One Year Streak</span>
                </div>
                <span className="text-xs font-medium text-purple-600 lg:text-sm">+5000 XP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streak Milestone Reward */}
      <StreakMilestoneReward
        streak={userStats.streak}
        isOpen={showMilestoneReward}
        onClose={() => setShowMilestoneReward(false)}
        onClaim={handleClaimReward}
      />
    </div>
  )
}
