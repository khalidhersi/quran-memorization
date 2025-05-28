"use client"

import { useState } from "react"
import { Bell, BellOff, Book, Clock, Save, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

// List of reciters
const reciters = [
  { id: "mishari", name: "Mishari Rashid al-Afasy" },
  { id: "sudais", name: "Abdur-Rahman As-Sudais" },
  { id: "minshawi", name: "Mohamed Siddiq El-Minshawi" },
  { id: "husary", name: "Mahmoud Khalil Al-Husary" },
  { id: "abdul_basit", name: "Abdul Basit Abdul Samad" },
  { id: "al_ajmi", name: "Ahmed Al-Ajmi" },
  { id: "al_ghamdi", name: "Saad Al-Ghamdi" },
  { id: "al_muaiqly", name: "Maher Al-Muaiqly" },
]

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

export default function MemorizationSettingsPage() {
  // State for all settings
  const [settings, setSettings] = useState({
    memorizeMode: "line-by-line",
    reciterId: "mishari",
    remindersEnabled: true,
    reminderTime: "18", // 6:00 PM default
  })
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [reminderTime, setReminderTime] = useState("18")

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled)
  }

  // Handle time selection
  const handleTimeChange = (value: string) => {
    setReminderTime(value)
  }

  // Handle memorization mode change
  const handleMemorizeModeChange = (value: string) => {
    setSettings({ ...settings, memorizeMode: value })
  }

  // Handle reciter change
  const handleReciterChange = (value: string) => {
    setSettings({ ...settings, reciterId: value })
  }

  // Handle reminders toggle
  const handleRemindersToggle = (checked: boolean) => {
    setSettings({ ...settings, remindersEnabled: checked })
  }

  // Handle reminder time change
  const handleReminderTimeChange = (value: string) => {
    setSettings({ ...settings, reminderTime: value })
  }

  // Handle save settings
  const handleSaveSettings = () => {
    // In a real app, you would save these settings to a database or local storage
    console.log("Saving settings:", settings)

    // Show success toast
    toast({
      title: "Settings saved",
      description: "Your memorization preferences have been updated.",
    })
  }

  return (
    <div className="bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger className="lg:hidden" />
        <h1 className="text-xl font-semibold">Memorization Settings</h1>
      </header>

      <div className="mx-auto max-w-2xl p-4 lg:p-6">
        <div className="mb-4 space-y-1 lg:mb-6 lg:space-y-2">
          <h2 className="text-xl font-bold lg:text-2xl">Customize Your Experience</h2>
          <p className="text-sm text-muted-foreground lg:text-base">
            Configure your memorization preferences to enhance your Quran learning journey.
          </p>
        </div>

        {/* Memorization Mode Card */}
        <Card className="mb-4 lg:mb-6">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <Book className="h-5 w-5 text-emerald-600" />
              Memorization Mode
            </CardTitle>
            <CardDescription>Choose how you want to memorize the Quran</CardDescription>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <RadioGroup
              value={settings.memorizeMode}
              onValueChange={handleMemorizeModeChange}
              className="space-y-3 lg:space-y-4"
            >
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="line-by-line" id="line-by-line" />
                <div className="grid gap-1 leading-none">
                  <Label htmlFor="line-by-line" className="font-medium">
                    Line-by-Line
                  </Label>
                  <p className="text-xs text-muted-foreground lg:text-sm">
                    Memorize one line at a time. Best for beginners and detailed focus.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="page-by-page" id="page-by-page" />
                <div className="grid gap-1 leading-none">
                  <Label htmlFor="page-by-page" className="font-medium">
                    Page-by-Page
                  </Label>
                  <p className="text-xs text-muted-foreground lg:text-sm">
                    Memorize an entire page at once. Recommended for advanced learners.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Reciter Selection Card */}
        <Card className="mb-4 lg:mb-6">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <User className="h-5 w-5 text-emerald-600" />
              Reciter Selection
            </CardTitle>
            <CardDescription>Choose your preferred Quran reciter</CardDescription>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <Select value={settings.reciterId} onValueChange={handleReciterChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a reciter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Reciters</SelectLabel>
                  {reciters.map((reciter) => (
                    <SelectItem key={reciter.id} value={reciter.id}>
                      {reciter.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {settings.reciterId && (
              <div className="mt-3 rounded-lg bg-muted p-3 lg:mt-4">
                <p className="text-xs font-medium lg:text-sm">
                  Selected: {reciters.find((r) => r.id === settings.reciterId)?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Audio quality and download speed may vary based on your internet connection.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reminders Card */}
        <Card className="mb-4 lg:mb-6">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <Bell className="h-5 w-5 text-emerald-600" />
              Daily Reminders
            </CardTitle>
            <CardDescription>Configure your memorization reminders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 lg:space-y-6 lg:p-6">
            {/* Enable/Disable Reminders */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reminders" className="text-sm lg:text-base">
                  Enable Daily Reminders
                </Label>
                <p className="text-xs text-muted-foreground lg:text-sm">
                  Receive notifications to maintain your memorization streak
                </p>
              </div>
              <Switch id="reminders" checked={settings.remindersEnabled} onCheckedChange={handleRemindersToggle} />
            </div>

            <Separator />

            {/* Reminder Time */}
            <div className="space-y-2 lg:space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600 lg:h-5 lg:w-5" />
                <Label htmlFor="reminder-time" className="text-sm lg:text-base">
                  Reminder Time
                </Label>
              </div>
              <p className="text-xs text-muted-foreground lg:text-sm">
                Choose when you want to receive your daily reminder
              </p>

              <Select
                value={settings.reminderTime}
                onValueChange={handleReminderTimeChange}
                disabled={!settings.remindersEnabled}
              >
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
        </Card>

        {/* Save Button */}
        <Button onClick={handleSaveSettings} className="w-full gap-2" size="lg">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
