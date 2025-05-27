"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LockedProgressCard } from "@/components/locked-progress-card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getAyah } from "@/lib/quran-api"
import ayahCounts from '../../../ayah_counts.json';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase"

type MemorizedMap = {
  [surah: number]: number[] // list of ayah numbers memorized in this surah
}

export default function ProgressDemoPage() {
  const [isMemorized, setIsMemorized] = useState(false)
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahNumber, setAyahNumber] = useState(1);
  const [ayahData, setAyahData] = useState<any>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [memorized, setMemorized] = useState<MemorizedMap>({});
  const [percentMemorized, setPercentMemorized] = useState(ayahNumber);

  // Replace with real user ID
  const userId = "user_123";

  const syncToFirebase = async (memorized: Record<number, number[]>) => {
    try {
      await setDoc(doc(db, "users", userId), { memorized }, { merge: true });
    } catch (err) {
      console.error("Error writing to Firebase:", err);
    }
  };
  

  const handleMarkAsMemorized = () => {
    setIsMemorized(true);
  
    setMemorized((prev) => {
      const updated = { ...prev };
      if (!updated[surahNumber]) updated[surahNumber] = [];
      if (!updated[surahNumber].includes(ayahNumber)) {
        updated[surahNumber].push(ayahNumber);
        syncToFirebase(updated); // 🔥 Sync to Firestore
      }
      return updated;
    });
  };

  useEffect(() => {
    const loadMemorizedFromFirebase = async () => {
      try {
        const docSnap = await getDoc(doc(db, "users", userId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.memorized) {
            setMemorized(data.memorized);
  
            const { lastSurah, lastAyah } = getLastMemorizedPosition(data.memorized);
            setSurahNumber(lastSurah);
            setAyahNumber(lastAyah);
          }
        }
      } catch (err) {
        console.error("Error reading from Firebase:", err);
      }
    };
  
    loadMemorizedFromFirebase();
  }, []);
  
  
  
  useEffect(() => {
    const alreadyMemorized = memorized[surahNumber]?.includes(ayahNumber);
    setIsMemorized(!!alreadyMemorized);
  }, [ayahNumber, surahNumber, memorized]);
  
  // Load memorized from storage:
  useEffect(() => {
    const stored = localStorage.getItem("memorizedAyahs");
    if (stored) {
      setMemorized(JSON.parse(stored));
    }
  }, []);

  // Save to storage whenever memorized updates:
  useEffect(() => {
    localStorage.setItem("memorizedAyahs", JSON.stringify(memorized));
  }, [memorized]);

  useEffect(() => {
  setPercentMemorized(((ayahNumber ) / ayahCounts.ayah_counts[surahNumber - 1]) * 100)
  }, [ayahNumber]);

  useEffect(() => {
    async function fetchAyah() {
      const data = await getAyah(surahNumber, ayahNumber);
      setAyahData({
        surah: data.surah.englishName,
        number: data.numberInSurah,
        arabic: data.text,
        translation: data?.edition?.englishName || "",
        audioUrl: data.audio,
      });
    }
    fetchAyah();
  }, [surahNumber, ayahNumber]);

  const goToNextAyah = () => {
    setIsMemorized(false);
    
    const lastAyahInSurah = ayahCounts.ayah_counts[surahNumber - 1]; // Index is 0-based
    const nextAyah = ayahNumber + 1;

    if (ayahNumber === lastAyahInSurah) {
      // Surah completed
      setShowCongrats(true);
      return;
    }
  
    if (nextAyah > lastAyahInSurah) {
      const nextSurah = surahNumber === 114 ? 1 : surahNumber + 1;
      setSurahNumber(nextSurah);
      setAyahNumber(1);
    } else {
      setAyahNumber(nextAyah);
    }
  };

  const getLastMemorizedPosition = (memorized: MemorizedMap) => {
    let lastSurah = 1;
    let lastAyah = 1;
  
    for (const [surah, ayahs] of Object.entries(memorized)) {
      const surahNum = parseInt(surah);
      if (ayahs.length > 0) {
        if (surahNum > lastSurah || (surahNum === lastSurah && Math.max(...ayahs) > lastAyah)) {
          lastSurah = surahNum;
          lastAyah = Math.max(...ayahs);
        }
      }
    }
  
    return { lastSurah, lastAyah };
  };
  

  return (
    <div className="bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger className="lg:hidden" />
        <h1 className="text-xl font-semibold">Test the Hafidh</h1>
      </header>

      {showCongrats && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
        <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-emerald-600 mb-4">🎉 Congratulations!</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            You’ve completed Surah {ayahData?.surah}!
          </p>
          <Button
            onClick={() => {
              setShowCongrats(false);
              const nextSurah = surahNumber === 114 ? 1 : surahNumber + 1;
              setSurahNumber(nextSurah);
              setAyahNumber(1);
            }}
          >
            Continue to next Surah
          </Button>
        </div>
      </div>
    )}

      <div className="container mx-auto max-w-2xl py-8">
        {/* Current Ayah Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="mb-2 text-xl font-semibold">{ayahData ? `${ayahData.surah} ${ayahData.number}/${ayahCounts.ayah_counts[surahNumber - 1]}` : "Loading..."}</h2>
            <p
              className="font-arabic leading-snug text-[clamp(1rem,3vw,2rem)] p-3 text-center"
              dir="rtl"
              lang="ar"
            >
              {ayahData?.arabic || "Loading..."}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {ayahData?.translation || "Loading..."}
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
          onUnlockedClick={goToNextAyah}
        />

        {/* Progress Indicator */}
        <div className="mt-8">
          <h3 className="mb-2 text-sm font-medium text-gray-500">Progress</h3>
          { Math.round(percentMemorized)}%
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{
                width: `${(ayahNumber / ayahCounts.ayah_counts[surahNumber - 1]) * 100}%`,
              }}
            />
          </div>
          <div className="mt-1 text-right text-xs text-gray-500">
            {ayahNumber} of {ayahCounts.ayah_counts[surahNumber - 1]} ayahs memorized
          </div>
          <div className="mt-1 text-right text-xs text-gray-500">
          </div>
        </div>
      </div>
    </div>
  )
}
