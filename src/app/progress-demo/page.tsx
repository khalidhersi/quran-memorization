"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LockedProgressCard } from "@/components/locked-progress-card"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function ProgressDemoPage() {
  const [currentAyah, setCurrentAyah] = useState(1)
  const [isMemorized, setIsMemorized] = useState(false)

  const handleMarkAsMemorized = () => {
    setIsMemorized(true)
  }

  const handleNextAyah = () => {
    setCurrentAyah(currentAyah + 1)
    setIsMemorized(false)
  }

  return (
    <div className="bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger className="lg:hidden" />
        <h1 className="text-xl font-semibold">Progress</h1>
      </header>

      <div className="container mx-auto max-w-2xl py-8">
        {/* Current Ayah Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="mb-2 text-xl font-semibold">Ayah {currentAyah}</h2>
            <p className="mb-4 text-lg font-arabic" dir="rtl" lang="ar">
              {currentAyah === 1
                ? "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                : currentAyah === 2
                  ? "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"
                  : currentAyah === 3
                    ? "الرَّحْمَٰنِ الرَّحِيمِ"
                    : "مَالِكِ يَوْمِ الدِّينِ"}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {currentAyah === 1
                ? "In the name of Allah, the Entirely Merciful, the Especially Merciful"
                : currentAyah === 2
                  ? "All praise is due to Allah, Lord of the worlds"
                  : currentAyah === 3
                    ? "The Entirely Merciful, the Especially Merciful"
                    : "Sovereign of the Day of Recompense"}
            </p>

            <div className="mt-6">
              <Button
                onClick={handleMarkAsMemorized}
                disabled={isMemorized}
                className="flex items-center gap-2"
                variant={isMemorized ? "outline" : "default"}
              >
                <Check className="h-4 w-4" />
                {isMemorized ? "Memorized" : "Mark as Memorized"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Ayah Card (Locked until current is memorized) */}
        <LockedProgressCard
          title="Next Ayah"
          isLocked={!isMemorized}
          tooltipMessage="Memorize this ayah to unlock the next one"
          onUnlockedClick={handleNextAyah}
        />

        {/* Progress Indicator */}
        <div className="mt-8">
          <h3 className="mb-2 text-sm font-medium text-gray-500">Progress</h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((ayahNumber) => (
              <div
                key={ayahNumber}
                className={`h-2 flex-1 rounded-full ${
                  ayahNumber < currentAyah
                    ? "bg-emerald-500"
                    : ayahNumber === currentAyah
                      ? "bg-emerald-200 dark:bg-emerald-900"
                      : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
          <div className="mt-1 text-right text-xs text-gray-500">{currentAyah} of 7 ayahs</div>
        </div>
      </div>
    </div>
  )
}
