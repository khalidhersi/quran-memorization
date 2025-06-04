"use client"

import { useEffect, useState} from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CircularProgressBar } from "./components/circular-progress-bar"
import { QuoteCard } from "./components/quote-card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { StreakIndicator } from "@/components/streak-indicator"
import { getAuth } from "firebase/auth";
import { db } from "@/firebase"; // adjust path to your firebase config
import { getDocs, collection, where, query, doc, getDoc } from "firebase/firestore";
import lastAyahsPerPage from "../../lastAyahsPerPage.json"
import { useRouter } from 'next/navigation'; // ✅ for App Router

 

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
      const userId = 123;
      if (!user) return;

      try {
        const memorizedRef = collection(db, "user_memorized_ayahs");
        const q = query(memorizedRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        setTotalMemorized(snapshot.size); // This is your total ayahs memorized
      } catch (error) {
        console.error("Failed to fetch memorized ayahs:", error);
      }
    };

    fetchMemorizedCount();
  }, []);

  // useEffect(() => {
  //   const userId = 123;

  //   const fetchPages = async () => {

  //     try {
  //       const memorizedRef = collection(db, "user_memorized_ayahs")
  //       const q = query(memorizedRef, where("userId", "==", userId))
  //       const snapshot = await getDocs(q)

  //       const pageSet = new Set<number>()

  //       for (const doc of snapshot.docs) {
  //         const { surah, ayah } = doc.data()
  //         const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}`)
  //         const json = await res.json()
  //         if (json?.data?.page) {
  //           pageSet.add(json.data.page)
  //         }
  //       }

  //       setPagesMemorized(pageSet.size)
  //     } catch (err) {
  //       console.error("Error fetching memorized pages:", err)
  //     }
  //   }

  //   if (userId) fetchPages()
  // }, [pagesMemorized])
  

  useEffect(() => {
    const userId = 123; // replace with dynamic userId if available
    const user = getAuth().currentUser;
    if (!user) return;
    async function countPagesMemorized() {
      try {
        if (!user) return;
        // Get all memorized ayahs for user
        const memorizedRef = collection(db, "user_memorized_ayahs")
        const q = query(memorizedRef, where("userId", "==", user.uid))
        const snapshot = await getDocs(q)
  
        // Create a map surah -> max ayah memorized
        const userMemorizedMap : any = {}
  
        snapshot.docs.forEach(doc => {
          const { surah, ayah } = doc.data()
          if (!userMemorizedMap[surah] || userMemorizedMap[surah] < ayah) {
            userMemorizedMap[surah] = ayah
          }
        })
  
        // Count pages where last ayah is memorized
        let memorizedPageCount = 0
        for (const pageStr of Object.keys(lastAyahsPerPage)) {
          const page : any = Number(pageStr)
          const lastAyah = lastAyahsPerPage[page]
          if (!lastAyah) continue
  
          const { surah, ayah } = lastAyah
          if ((userMemorizedMap[surah] ?? 0) >= ayah) {
            memorizedPageCount++
          }
        }
  
        setPagesMemorized(memorizedPageCount)
      } catch (err) {
        console.error("Error calculating memorized pages:", err)
      }
    }
  
    if (user.uid) {
      countPagesMemorized()
    }
  }, [])
  // useEffect(() => {
  //   const fetchDailyGoal = async () => {
  //     const userId = 123;
  //     const userRef = doc(db, "users", userId.toString());
  
  //     try {
  //       const userSnap = await getDoc(userRef);
  //       if (userSnap.exists()) {
  //         const userData = userSnap.data();
  //         if (userData.dailyGoal) {
  //           setDailyGoal(userData.dailyGoal);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch daily goal:", error);
  //     }
  //   };
  
  //   fetchDailyGoal();
  // }, []);

  return (
    <div className=" flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger className="lg:hidden" />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <StreakIndicator streak={userData.streak} className="text-sm" />
        </div>
      </header>

      <main className="p-4 lg:p-6 flex-1 overflow-y-auto">
        <div className="grid gap-4 md:grid-cols-2">
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
          <CircularProgressBar percentage={((totalMemorized/userData.totalAyahs)*100)} size={180} />
          <h2 className="mt-4 text-xl font-bold lg:text-2xl">{((totalMemorized/userData.totalAyahs) * 100).toFixed(2)}% Complete</h2>
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
