"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CircularProgressBar } from "./components/circular-progress-bar"
import { QuoteCard } from "./components/quote-card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { StreakIndicator } from "@/components/streak-indicator"
import { getAuth } from "firebase/auth";
import { db } from "@/firebase"; // adjust path to your firebase config
import { getDocs, collection, where, query } from "firebase/firestore";


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

const [totalMemorized, setTotalMemorized] = useState(0);
const [pagesMemorized, setPagesMemorized] = useState<number>(0)

  useEffect(() => {
    const fetchMemorizedCount = async () => {
      // const user = getAuth().currentUser;
      const userId = 123;
      if (!userId) return;

      try {
        const memorizedRef = collection(db, "user_memorized_ayahs");
        const q = query(memorizedRef, where("userId", "==", userId));
        const snapshot = await getDocs(q);

        setTotalMemorized(snapshot.size); // This is your total ayahs memorized
      } catch (error) {
        console.error("Failed to fetch memorized ayahs:", error);
      }
    };

    fetchMemorizedCount();
  }, []);

  useEffect(() => {
    const userId = 123;

    const fetchPages = async () => {

      try {
        const memorizedRef = collection(db, "user_memorized_ayahs")
        const q = query(memorizedRef, where("userId", "==", userId))
        const snapshot = await getDocs(q)

        const pageSet = new Set<number>()

        for (const doc of snapshot.docs) {
          const { surah, ayah } = doc.data()
          const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}`)
          const json = await res.json()
          if (json?.data?.page) {
            pageSet.add(json.data.page)
          }
        }

        setPagesMemorized(pageSet.size)
      } catch (err) {
        console.error("Error fetching memorized pages:", err)
      }
    }

    if (userId) fetchPages()
  }, [pagesMemorized])
  

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger className="lg:hidden" />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <StreakIndicator streak={userData.streak} className="text-sm" />
        </div>
      </header>

      <main className="p-4 lg:p-6 overflow-y-auto">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4 lg:p-6">
              <span className="text-sm font-medium text-muted-foreground">Ayahs Memorized</span>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-2xl font-bold lg:text-3xl">{totalMemorized}</span>
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
                <span className="text-2xl font-bold lg:text-3xl">{pagesMemorized}</span>
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
          <CircularProgressBar percentage={((totalMemorized/userData.totalAyahs))} size={180} />
          <h2 className="mt-4 text-xl font-bold lg:text-2xl">{((totalMemorized/userData.totalAyahs) * 100).toFixed(2)}% Complete</h2>
          <p className="text-center text-sm text-muted-foreground lg:text-base">
            You've memorized {totalMemorized} ayahs so far. Keep going!
          </p>
          <Button className="mt-4 h-12 w-full max-w-xs px-8 text-lg lg:mt-6">Continue Memorizing</Button>
        </div>

        <div className="mt-6 lg:mt-8">
          <QuoteCard />
        </div>
      </main>
    </div>
  )
}
