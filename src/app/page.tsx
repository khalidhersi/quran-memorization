"use client"

import { useEffect, useState} from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CircularProgressBar } from "./components/circular-progress-bar"
import { QuoteCard } from "./components/quote-card"
import { getAuth } from "firebase/auth";
import { db } from "@/firebase"; // adjust path to your firebase config
import { getDocs, collection, where, query, doc, getDoc } from "firebase/firestore";
import lastAyahsPerPage from "../../lastAyahsPerPage.json"
import { useRouter } from 'next/navigation'; // ✅ for App Router
import Header from "@/components/header"

 

export default function Dashboard() {
  const TOTAL_AYAHS = 6236;
  const TOTAL_PAGES = 604;


  const [totalMemorized, setTotalMemorized] = useState(0);
  const [pagesMemorized, setPagesMemorized] = useState(0);
  // const [dailyGoal, setDailyGoal] = useState(5); // e.g., goal is 5 pages/day
  // const [dailyProgress, setDailyProgress] = useState(0); // pages memorized today

  const router = useRouter();

    const routeChange = () => {
      router.push('/memorize'); // 🔁 Change to your target path
    };

    useEffect(() => {
    const fetchMemorizedCount = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      try {
        const docSnap = await getDoc(doc(db, "memorizeTable", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          const memorized = data.memorized || {};

          // Count total number of ayahs
          let total = 0;
          for (const surah in memorized) {
            total += memorized[surah]?.length || 0;
          }

          setTotalMemorized(total);
        }
      } catch (error) {
        console.error("Failed to fetch memorized ayahs:", error);
      }
    };

    fetchMemorizedCount();
  }, []);


    useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) return;

    const countPagesMemorized = async () => {
      try {
        const docSnap = await getDoc(doc(db, "memorizeTable", user.uid));
        if (!docSnap.exists()) return;

        const data = docSnap.data();
        const memorized = data.memorized || {};

        // Create surah & then the highest memorized ayah
        const userMemorizedMap: Record<number, number> = {};

        for (const surahStr in memorized) {
          const ayahs = memorized[surahStr];
          const surah = Number(surahStr);
          const maxAyah = Math.max(...ayahs);
          userMemorizedMap[surah] = maxAyah;
        }

        // Count fully memorized pages
        let memorizedPageCount = 0;
        for (const pageStr in lastAyahsPerPage) {
          const page = Number(pageStr);
          const lastAyah = lastAyahsPerPage[page];
          if (!lastAyah) continue;

          const { surah, ayah } = lastAyah;
          if ((userMemorizedMap[surah] ?? 0) >= ayah) {
            memorizedPageCount++;
          }
        }

        setPagesMemorized(memorizedPageCount);
      } catch (err) {
        console.error("Error calculating memorized pages:", err);
      }
    };

    countPagesMemorized();
  }, []);


    return (
      <div className=" flex flex-col min-h-screen bg-background">
        {/* <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <SidebarTrigger className="lg:hidden" />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <StreakIndicator streak={userData.streak} className="text-sm" />
          </div>
        </header> */}
        <Header title={"Dashboard"} />

        <main className="p-4 lg:p-6 flex-1 overflow-y-auto">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4 lg:p-6">
                <span className="text-sm font-medium text-muted-foreground">Ayahs Memorized</span>
                <div className="mt-2 flex items-end gap-1">
                 <span className="text-2xl font-bold lg:text-3xl">{totalMemorized}</span>
                 <span className="text-xs text-muted-foreground lg:text-sm">/ {TOTAL_AYAHS}</span>
                </div>
                <Progress
                  className="mt-2 h-2 w-full"
                  value={(totalMemorized / TOTAL_AYAHS) * 100}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4 lg:p-6">
                <span className="text-sm font-medium text-muted-foreground">Current Page</span>
                <div className="mt-2 flex items-end gap-1">
                 <span className="text-2xl font-bold lg:text-3xl">{pagesMemorized}</span>
                 <span className="text-xs text-muted-foreground lg:text-sm">/ {TOTAL_PAGES}</span>
                </div>
                <Progress className="mt-2 h-2 w-full" value={(pagesMemorized / TOTAL_PAGES) * 100} />
              </CardContent>
            </Card>
            {/* <Card className="md:col-span-1">
              <CardContent className="flex flex-col items-center justify-center p-4 lg:p-6">
                <span className="text-sm font-medium text-muted-foreground">Daily Goal</span>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-2xl font-bold lg:text-3xl">{dailyProgress}</span>
                  <span className="text-xs text-muted-foreground lg:text-sm">/ {dailyGoal} pages</span>
                </div>
                <Progress
                  className="mt-2 h-2 w-full"
                  value={(dailyProgress / dailyGoal) * 100}
                />
              </CardContent>
            </Card> */}
          </div>

          <div className="mt-6 flex flex-col items-center lg:mt-8">
            <CircularProgressBar percentage={(totalMemorized / TOTAL_AYAHS) * 100} size={180} />
            <h2 className="mt-4 text-xl font-bold lg:text-2xl">{((totalMemorized / TOTAL_AYAHS) * 100).toFixed(2)}% Complete</h2>
            <p className="text-center text-sm text-muted-foreground lg:text-base">
              You've memorized {totalMemorized} ayahs so far. Keep going!
            </p>
            <Button onClick={routeChange} className="mt-4 h-12 w-full max-w-xs px-8 text-lg lg:mt-6">Continue Memorizing</Button>
          </div>

          <div className="mt-6 lg:mt-8">
            <QuoteCard />
          </div>
        </main>
      </div>
    )
}
