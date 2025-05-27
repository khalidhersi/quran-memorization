"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CircularProgressBar } from "./components/circular-progress-bar"
import { QuoteCard } from "./components/quote-card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { StreakIndicator } from "@/components/streak-indicator"
import { getSurahs } from '../lib/quran-api';

export default function Dashboard() {
  // Dummy data - would come from your backend in a real app
  const [userData] = useState({
    name: "Ahmed",
    streak: 12,
    xp: 1450,
    totalAyahsMemorized: 342,
    totalAyahs: 6236,
    lastPage: 23,
    totalPages: 604,
    percentageComplete: 18,
  })
  const [surahs, setSurahs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSurahs() {
      const data = await getSurahs();
      setSurahs(data);
    }
    fetchSurahs();
  }, []);


  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger className="lg:hidden" />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <StreakIndicator streak={userData.streak} className="text-sm" />
        </div>
      </header>

      <main className="p-4 lg:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4 lg:p-6">
              <span className="text-sm font-medium text-muted-foreground">Ayahs Memorized</span>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-2xl font-bold lg:text-3xl">{userData.totalAyahsMemorized}</span>
                <span className="text-xs text-muted-foreground lg:text-sm">/ {userData.totalAyahs}</span>
              </div>
              <Progress
                className="mt-2 h-2 w-full"
                value={(userData.totalAyahsMemorized / userData.totalAyahs) * 100}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4 lg:p-6">
              <span className="text-sm font-medium text-muted-foreground">Current Page</span>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-2xl font-bold lg:text-3xl">{userData.lastPage}</span>
                <span className="text-xs text-muted-foreground lg:text-sm">/ {userData.totalPages}</span>
              </div>
              <Progress className="mt-2 h-2 w-full" value={(userData.lastPage / userData.totalPages) * 100} />
            </CardContent>
          </Card>
          <Card className="md:col-span-1">
            <CardContent className="flex flex-col items-center justify-center p-4 lg:p-6">
              <span className="text-sm font-medium text-muted-foreground">Daily Goal</span>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-2xl font-bold lg:text-3xl">3</span>
                <span className="text-xs text-muted-foreground lg:text-sm">/ 5 pages</span>
              </div>
              <Progress className="mt-2 h-2 w-full" value={60} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex flex-col items-center lg:mt-8">
          <CircularProgressBar percentage={userData.percentageComplete} size={180} />
          <h2 className="mt-4 text-xl font-bold lg:text-2xl">{userData.percentageComplete}% Complete</h2>
          <p className="text-center text-sm text-muted-foreground lg:text-base">
            You've memorized {userData.totalAyahsMemorized} ayahs so far. Keep going!
          </p>
          <Button className="mt-4 h-12 w-full max-w-xs px-8 text-lg lg:mt-6">Continue Memorizing</Button>
        </div>

        <div className="mt-10">
  <h2 className="text-xl font-semibold mb-4">Surahs of the Quran</h2>
  <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {surahs.map((surah) => (
      <li key={surah.number} className="border rounded-xl p-4 shadow-sm bg-white dark:bg-gray-900">
        <p className="font-bold text-lg">{surah.englishName}</p>
        <p className="text-sm text-muted-foreground italic">{surah.englishNameTranslation}</p>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
          Surah {surah.number} · {surah.numberOfAyahs} ayahs
        </p>
      </li>
    ))}
  </ul>
</div>

        <div className="mt-6 lg:mt-8">
          <QuoteCard />
        </div>
      </main>
    </div>
  )
}
