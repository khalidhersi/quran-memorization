"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Clock, Flame, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  // User stats - would come from your backend in a real app
  const [userStats, setUserStats] = useState({
    xp: 1250,
    level: 5,
    xpForNextLevel: 500,
    streak: 7,
    lastStreakMilestone: 0,
  })

  // Notification settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [reminderTime, setReminderTime] = useState("18")
  const [showMilestoneReward, setShowMilestoneReward] = useState(false)

  // Check for streak milestones
  useEffect(() => {
    const milestones = [7, 30, 100, 365]
    const nextMilestone = milestones.find((m) => m === userStats.streak)

    if (nextMilestone && nextMilestone > userStats.lastStreakMilestone) {
      setShowMilestoneReward(true)
      // In a real app, you would update the lastStreakMilestone in the database
      setUserStats((prev) => ({ ...prev, lastStreakMilestone: nextMilestone }))
    }
  }, [userStats.streak, userStats.lastStreakMilestone])

  // Calculate XP progress percentage
  const xpProgress = Math.min(100, ((userStats.xp % userStats.xpForNextLevel) / userStats.xpForNextLevel) * 100)

  // Generate time options for the dropdown
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 === 0 ? 12 : hour % 12
    return {
      value: hour.toString(),
      label: `${displayHour}:00 ${period}`,
    }
  })



 
  // Handle notification toggle
  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled)
  }

  // Handle time selection
  const handleTimeChange = (value: string) => {
    setReminderTime(value)
  }

  // Handle closing milestone reward
  const handleCloseMilestoneReward = () => {
    setShowMilestoneReward(false)
  }

  // Get milestone reward details
  const getMilestoneReward = () => {
    switch (userStats.streak) {
      case 7:
        return {
          title: "One Week Streak!",
          description: "You've memorized Quran for 7 days in a row!",
          reward: "+100 XP Bonus",
        }
      case 30:
        return {
          title: "One Month Streak!",
          description: "Amazing dedication! 30 days of consistent memorization!",
          reward: "+500 XP Bonus",
        }
      case 100:
        return {
          title: "Century Streak!",
          description: "Incredible! 100 days of Quran memorization!",
          reward: "+1000 XP Bonus",
        }
      case 365:
        return {
          title: "One Year Streak!",
          description: "Mashallah! A full year of daily Quran memorization!",
          reward: "+5000 XP Bonus",
        }
      default:
        return {
          title: "Streak Milestone!",
          description: "You've reached a new streak milestone!",
          reward: "+50 XP Bonus",
        }
    }
  }

  const milestoneReward = getMilestoneReward()

  return (
    <div className="bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger className="lg:hidden" />
        <h1 className="text-xl font-semibold">Settings</h1>
      </header>

      <div className="container mx-auto max-w-2xl py-8">
        {/* User Stats Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your memorization journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* XP and Level */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                    <span className="text-xs font-bold">{userStats.level}</span>
                  </div>
                  <span className="font-medium">Level {userStats.level}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {userStats.xp % userStats.xpForNextLevel} / {userStats.xpForNextLevel} XP
                </span>
              </div>
              <Progress value={xpProgress} className="h-2" />
            </div>

            {/* Streak */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Daily Streak</h3>
                  <p className="text-sm text-muted-foreground">Keep memorizing daily to maintain your streak</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-xl font-bold">{userStats.streak}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure your daily reminders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable/Disable Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  {notificationsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                </div>
                <div>
                  <Label htmlFor="notifications" className="text-base font-medium">
                    Daily Reminders
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive daily notifications to memorize Quran</p>
                </div>
              </div>
              <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={handleNotificationToggle} />
            </div>

            <Separator />

            {/* Reminder Time */}
            <div className={cn("space-y-3", !notificationsEnabled && "opacity-50")}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <Label htmlFor="reminder-time" className="text-base font-medium">
                    Reminder Time
                  </Label>
                  <p className="text-sm text-muted-foreground">Choose when to receive your daily reminder</p>
                </div>
              </div>

              <Select value={reminderTime} onValueChange={handleTimeChange} disabled={!notificationsEnabled}>
                <SelectTrigger id="reminder-time" className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Morning</SelectLabel>
                    {timeOptions.slice(5, 12).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Afternoon & Evening</SelectLabel>
                    {timeOptions.slice(12, 22).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Night</SelectLabel>
                    {[...timeOptions.slice(22), ...timeOptions.slice(0, 5)].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Save Settings</Button>
          </CardFooter>
        </Card>

       


        {/* Streak Milestone Reward Popover */}
        {/* <Popover open={showMilestoneReward} onOpenChange={setShowMilestoneReward}>
          <PopoverTrigger asChild>
            <div className="hidden">Trigger</div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
              <div className="absolute -right-4 -top-4 h-24 w-24 rotate-12 text-white/20">
                <Award className="h-full w-full" />
              </div>
              <h3 className="text-xl font-bold">{milestoneReward.title}</h3>
              <p className="mt-1 text-sm text-white/90">{milestoneReward.description}</p>
            </div>
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between rounded-lg bg-amber-50 p-3 dark:bg-amber-950/50">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <span className="font-medium text-amber-700 dark:text-amber-300">Reward</span>
                </div>
                <span className="font-bold text-amber-600 dark:text-amber-400">{milestoneReward.reward}</span>
              </div>
              <Button onClick={handleCloseMilestoneReward} className="w-full">
                Claim Reward
              </Button>
            </div>
          </PopoverContent>
        </Popover> */}
      </div>
    </div>
  )
}
