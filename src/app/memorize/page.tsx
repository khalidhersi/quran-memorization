"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Rewind, Repeat, Check, ChevronRight, Volume2, VolumeX, Minus, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { getAyah } from '../../lib/quran-api';
import ayahCounts from '../../../ayah_counts.json';
import { getReciter } from "../../lib/quran-api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { TimerReset } from "lucide-react";
import { doc, setDoc, getDoc, deleteDoc, getDocs, collection, Timestamp  } from "firebase/firestore";
import { db } from "@/firebase"; // Adjust path if different
import { getAuth } from "firebase/auth"; // Optional if user context is elsewhere
import { LockedProgressCard } from "@/components/locked-progress-card"
import { PrevProgressCard } from "@/components/prev-progress-card"

type MemorizePage = {
  surahNumber: number;
  ayahNumber: number;
};

interface UserMemorizedAyah {
  userId: string;
  user: string
  surah: number;
  ayah: number;
  memorizedAt: Timestamp;
}

const reciters = [
  { id: "mishari", name: "Mishari Rashid al-Afasy" },
  { id: "sudais", name: "Abdur-Rahman As-Sudais" },
  { id: "minshawi", name: "Mohamed Siddiq El-Minshawi" },
  { id: "husary", name: "Mahmoud Khalil Al-Husary" },
  { id: "abdul_basit", name: "Abdul Basit Abdul Samad" },
]


export default function MemorizePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [selectedReciter, setSelectedReciter] = useState(reciters[0].id)
  const [showTranslation, setShowTranslation] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahNumber, setAyahNumber] = useState(1);
  const [ayahData, setAyahData] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMemorized, setIsMemorized] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);


  // both ways load latest ayah can be eoieither used

  useEffect(() => {
    const loadLastMemorized = async () => {
      const last = await getLastMemorizedAyah();
      if (last) {
        setSurahNumber(last.surah);
        setAyahNumber(last.ayah);
      }
    };
    loadLastMemorized();
  }, []);
  

  const getLastMemorizedAyah = async () => {
    const user = getAuth().currentUser;
    if (!user) return null;
  
    const snapshot = await getDocs(collection(db, "user_memorized_ayahs"));
    const userDocs = snapshot.docs
      .filter(doc => doc.id.startsWith(user.uid))
      .map(doc => {
        const data = doc.data() as UserMemorizedAyah;
        return {
          id: doc.id,
          ...data
        };
      })
      .sort((a, b) => b.memorizedAt.seconds - a.memorizedAt.seconds); // Newest first
  
    return userDocs.length > 0
      ? {
          surah: userDocs[0].surah,
          ayah: userDocs[0].ayah,
        }
      : null;
  };

  // both ways load latest ayah can be eoieither used

  //   useEffect(() => {
  //   const loadLastMemorizedAyah = async () => {
  //     const user = getAuth().currentUser;
  //     if (!user) return;

  //     const userPrefix = `${user.uid}_`;
  //     const snapshot = await getDocs(collection(db, "user_memorized_ayahs"));
  //     const userDocs = snapshot.docs.filter(doc => doc.id.startsWith(userPrefix));

  //     if (userDocs.length === 0) return;

  //     // Sort by timestamp (latest memorized)
  //     userDocs.sort((a, b) => {
  //       const aDate = a.data().memorizedAt?.toDate?.() || new Date(0);
  //       const bDate = b.data().memorizedAt?.toDate?.() || new Date(0);
  //       return bDate - aDate;
  //     });

  //     const lastDoc = userDocs[0];
  //     const { surah, ayah } = lastDoc.data();

  //     setSurahNumber(surah);
  //     setAyahNumber(ayah);
  //   };

  //   loadLastMemorizedAyah();
  // }, []);

  useEffect(() => {
    setSelectedSurah(surahNumber);
    setSelectedAyah(ayahNumber);
  }, [surahNumber, ayahNumber]);
  
  // 1️⃣ Fetch Ayah Data
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

  // 2️⃣ Check Memorized Status
  useEffect(() => {
  const checkMemorizedStatus = async () => {
    const user = getAuth().currentUser;
    if (!user) return;

    const docRef = doc(db, "user_memorized_ayahs", `${user.uid}_${surahNumber}_${ayahNumber}`);
    const docSnap = await getDoc(docRef);

    const memorized = docSnap.exists();
    setIsMemorized(memorized);
    setCanGoNext(memorized);
  };

  checkMemorizedStatus();
}, [surahNumber, ayahNumber]);



useEffect(() => {
  async function fetchReciterAudio() {
    const data = await getReciter(surahNumber, ayahNumber, "ar.alafasy");
    console.log(data.audio);  // Assuming the API returns an `audio` property with the URL
    setAudioUrl(data.audio);  // Assuming the API returns an `audio` property with the URL
  }
  fetchReciterAudio();
}, [surahNumber, ayahNumber, selectedReciter]);

  // Handle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle rewind 5 seconds
  const rewindFiveSeconds = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5)
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  // Handle loop toggle
  const toggleLoop = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping
      setIsLooping(!isLooping)
    }
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  // Handle mute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Update progress bar
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
        }
      }, 100)
    } else if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying])

  // Set up audio element
  useEffect(() => {
    const audio = audioRef.current

    if (audio) {
      // Set initial volume
      audio.volume = volume / 100

      // Event listeners
      const handleLoadedMetadata = () => {
        setDuration(audio.duration)
      }

      const handleEnded = () => {
        if (!isLooping) {
          setIsPlaying(false)
        }
      }

      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
      audio.addEventListener("ended", handleEnded)

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audio.removeEventListener("ended", handleEnded)
      }
    }
  }, [isLooping, volume])

  // Format time (seconds) to MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Handle progress bar click
  const handleProgressChange = (value: number[]) => {
    const newTime = value[0]
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  // Mark ayah as memorized
  const markAsMemorized = async () => {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      alert("Please log in to track memorization.");
      return;
    }

    const docRef = doc(db, "user_memorized_ayahs", `${user.uid}_${surahNumber}_${ayahNumber}`);
    await setDoc(docRef, {
      userId: user.uid,
      surah: surahNumber,
      ayah: ayahNumber,
      memorizedAt: new Date(),
    });

    setIsMemorized(true);
    setCanGoNext(true); // ✅ unlock Next button
  } catch (err) {
    console.error("Failed to mark as memorized:", err);
  }
};


  const unmarkAsMemorized = async () => {
    const user = getAuth().currentUser;
    if (!user) return;
  
    const docRef = doc(db, "user_memorized_ayahs", `${user.uid}_${surahNumber}_${ayahNumber}`);
    await deleteDoc(docRef);
    setIsMemorized(false);
  };

  const goToNextAyah = () => {
    setIsMemorized(false);
    setIsPlaying(false);
    setCurrentTime(0);
  
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  
    const lastAyahInSurah = ayahCounts.ayah_counts[surahNumber - 1]; // Index is 0-based
    
    const nextAyah = ayahNumber + 1;
  
    if (nextAyah > lastAyahInSurah) {
      const nextSurah = surahNumber === 114 ? 1 : surahNumber + 1;
      setSurahNumber(nextSurah);
      setAyahNumber(1);
    } else {
      setAyahNumber(nextAyah);
    }
  };
  
  const goToPreviousAyah = () => {
    setIsMemorized(false);
    setIsPlaying(false);
    setCurrentTime(0);
  
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  
    if (ayahNumber === 1) {
      const prevSurah = surahNumber === 1 ? 114 : surahNumber - 1;
      const lastAyahInPrevSurah = ayahCounts.ayah_counts[prevSurah - 1];
      setSurahNumber(prevSurah);
      setAyahNumber(lastAyahInPrevSurah);
    } else {
      setAyahNumber(ayahNumber - 1);
    }
  };
  
// Load default from localStorage on first render
useEffect(() => {
  const storedRate = localStorage.getItem("playbackRate");
  if (storedRate) {
    const parsedRate = parseFloat(storedRate);
    if (!isNaN(parsedRate)) {
      setPlaybackRate(parsedRate);
    }
  }
}, []);



// Sync audio element when playbackRate changes
useEffect(() => {
  if (audioRef.current) {
    audioRef.current.playbackRate = playbackRate;
  }
  localStorage.setItem("playbackRate", playbackRate.toString());
}, [playbackRate]);

// Assuming surah count is 114 and ayah count comes from some config or static mapping
const [selectedSurah, setSelectedSurah] = useState(surahNumber);
const [selectedAyah, setSelectedAyah] = useState(ayahNumber);

// Call this when user clicks "Continue"
const handleContinueFromSelection = () => {
  setSurahNumber(selectedSurah);
  setAyahNumber(selectedAyah);
};


  return (
    <div className="bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger className="lg:hidden" />
        <h1 className="text-xl font-semibold">Memorize Quran</h1>
      </header>

      <div className="mx-auto max-w-4xl p-4 lg:p-6">

        {/* {!canGoNext && (
        <p className="text-xs text-muted-foreground mt-2 color-red">Please mark this ayah as memorized to continue.</p>
      )} */}

        {/* Reciter Selection */}
        <div className="flex flex-col mb-4 lg:mb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold lg:text-xl">
            {ayahData ? `${ayahData.surah} (${ayahData.number})` : "Loading..."}
            </h2>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <span>Surah:</span>
                <select
                  value={selectedSurah}
                  onChange={(e) => {
                    const surah = parseInt(e.target.value);
                    setSelectedSurah(surah);
                    setSelectedAyah(1);
                  }}
                  className="border rounded px-1 py-0.5 text-xs"
                >
                  {[...Array(114)].map((_, i) => (
                    <option defaultValue={ayahNumber} key={i + 1} value={i + 1} >
                      {i + 1}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2">
                <span>Ayah:</span>
                <select
                  value={selectedAyah}
                  onChange={(e) => setSelectedAyah(parseInt(e.target.value))}
                  className="border rounded px-1 py-0.5 text-xs"
                >
                  {[...Array(ayahCounts.ayah_counts[selectedSurah - 1])].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </label>

              <button
                onClick={handleContinueFromSelection}
                className="bg-green-600 text-white px-2 py-0.5 m- rounded hover:bg-green-700 text-xs shrink"
              >
                Continue
              </button>
              </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Reciter:</span>
              <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                <SelectTrigger className="w-[180px] lg:w-[200px]">
                  <SelectValue placeholder="Select reciter" />
                </SelectTrigger>
                <SelectContent>
                  {reciters.map((reciter) => (
                    <SelectItem key={reciter.id} value={reciter.id}>
                      {reciter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Ayah Display */}
        <Card className="mb-4 lg:mb-6">
          <CardContent className="p-4 lg:p-6">
            {/* Arabic Text */}
            <div
              className=" leading-snug text-[clamp(2rem,3vw,2rem)] p-3 text-center"
              dir="rtl"
              lang="ar"
            >
              {ayahData?.arabic || "Loading..."}
            </div>

            <Separator className="my-3 lg:my-4" />

            {/* Translation Toggle for Mobile */}
            <div className="mb-3 flex items-center justify-between lg:hidden">
              <Label htmlFor="show-translation" className="text-sm font-medium">
                Show Translation
              </Label>
              <Switch id="show-translation" checked={showTranslation} onCheckedChange={setShowTranslation} />
            </div>

            {/* Translation */}
            <div
              className={cn(
                "text-sm leading-relaxed text-muted-foreground lg:text-base",
                !showTranslation && "hidden lg:block",
              )}
            >
              {/* needs to be dynaimic  */}
              {ayahData?.translation || "Loading..."}
            </div>
          </CardContent>
        </Card>

        {/* Audio Player */}
        <Card className="mb-4 lg:mb-6">
          <CardContent className="p-4 lg:p-6">
          {audioUrl ? (
           <audio ref={audioRef} src={audioUrl} loop onLoadedMetadata={() => {
            if (audioRef.current) {
              audioRef.current.playbackRate = playbackRate;
            }
          }} />
          ) : (
          <p>Loading audio...</p>
        )}

            {/* Progress Bar */}
            <div className="mb-2">
              <Slider
                value={[currentTime]}
                min={0}
                max={duration || 100}
                step={0.1}
                onValueChange={handleProgressChange}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={togglePlayPause}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="h-10 w-10 lg:h-9 lg:w-9"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={rewindFiveSeconds}
                  aria-label="Rewind 5 seconds"
                  className="h-10 w-10 lg:h-9 lg:w-9"
                >
                  <Rewind className="h-4 w-4" />
                </Button>

                <Button
                  variant={isLooping ? "default" : "outline"}
                  size="icon"
                  onClick={toggleLoop}
                  aria-label={isLooping ? "Disable loop" : "Enable loop"}
                  className={cn("h-10 w-10 lg:h-9 lg:w-9", isLooping ? "bg-emerald-600 hover:bg-emerald-700" : "")}
                >
                  <Repeat className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Playback speed"
                      className="h-10 w-10 lg:h-9 lg:w-9"
                    >
                      <TimerReset className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <DropdownMenuItem
                        key={rate}
                        onClick={() => setPlaybackRate(rate)}
                        className={cn(
                          "cursor-pointer",
                          playbackRate === rate && "font-bold text-emerald-600"
                        )}
                      >
                        {rate}x
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  className="h-10 w-10 lg:h-9 lg:w-9"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>

                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-20 lg:w-24"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memorization Controls */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            onClick={markAsMemorized}
            disabled={isMemorized}
            className={cn(
              "flex h-12 items-center justify-center gap-2",
              isMemorized ? "bg-emerald-600 hover:bg-emerald-600" : "",
            )}
          >
            <Check className="h-4 w-4" />
            Marked as Memorized
          </Button>

          <Button
            onClick={unmarkAsMemorized}
            disabled={!isMemorized}
            className={cn(
              "flex h-12 items-center justify-center gap-2",
              isMemorized ? "bg-red-600 hover:bg-red-600/80 text-white-100" : "",
            )}
          >
            <Minus className="h-4 w-4" />
            Not Memorized
          </Button>

          {/* <Button
            onClick={goToPreviousAyah}
            className="flex h-12 items-center justify-center gap-2"
          >
          <ChevronLeft className="h-4 w-4" />
            Previous Ayah
          </Button>
         */}

         <PrevProgressCard
            title="Previous Ayah"
            tooltipMessage="Memorize this ayah to unlock the next one"
            onUnlockedClick={goToPreviousAyah} isLocked={false}        
          />
          <LockedProgressCard
            title="Next Ayah"
            isLocked={!canGoNext} // 🔒 Disable unless marked
            tooltipMessage="Memorize this ayah to unlock the next one"
            onUnlockedClick={goToNextAyah}
          />
        </div>
      </div>
    </div>
  )
}
