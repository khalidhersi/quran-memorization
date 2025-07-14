"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Minus, Pause, Play, Repeat, Rewind, TimerReset, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LockedProgressCard } from "@/components/locked-progress-card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getAyah } from "@/lib/quran-api"
import ayahCounts from '../../../ayah_counts.json';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase"
import { getAuth } from "firebase/auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { getReciter } from "../../lib/quran-api";
import { PrevProgressCard } from "@/components/prev-progress-card"
import SignOutButton from "@/components/SignOutButton"
import Header from "@/components/header"

type MemorizedMap = {
  [surah: number]: number[] // list of ayah numbers memorized in this surah
}

const reciters = [
  { id: "mishari", name: "Mishari Rashid al-Afasy" },
  { id: "sudais", name: "Abdur-Rahman As-Sudais" },
  { id: "minshawi", name: "Mohamed Siddiq El-Minshawi" },
  { id: "husary", name: "Mahmoud Khalil Al-Husary" },
  { id: "abdul_basit", name: "Abdul Basit Abdul Samad" },
]

export default function MemorizePage() {
  const [isMemorized, setIsMemorized] = useState(false)
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahNumber, setAyahNumber] = useState(1);
  const [ayahData, setAyahData] = useState<any>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [memorized, setMemorized] = useState<MemorizedMap>({});
  const [percentMemorized, setPercentMemorized] = useState(ayahNumber);
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [selectedReciter, setSelectedReciter] = useState(reciters[0].id)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [audioUrl, setAudioUrl] = useState('');
  const [playbackRate, setPlaybackRate] = useState(1);

  const syncToFirebase = async (memorized: Record<number, number[]>) => {
  const user = getAuth().currentUser;

  if (!user) {
    console.warn("No user found — is auth not loaded?");
    return null;
  }

  console.log("Syncing to Firestore for UID:", user.uid);

  try {
    await setDoc(doc(db, "memorizeTable", user.uid), { memorized }, { merge: true });
    console.log("Successfully wrote to Firestore.");
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

    const handleUnmarkAsMemorized = () => {
      setIsMemorized(false);

      setMemorized((prev) => {
        const updated = { ...prev };

        // Remove the ayah from the list
        if (updated[surahNumber]) {
          updated[surahNumber] = updated[surahNumber].filter((ayah) => ayah !== ayahNumber);

          // If the list becomes empty, remove the surah key entirely (optional)
          if (updated[surahNumber].length === 0) {
            delete updated[surahNumber];
          }

          syncToFirebase(updated); // 🔥 Sync updated data to Firestore
        }

        return updated;
      });
    };


  useEffect(() => {
    const loadMemorizedFromFirebase = async () => {
      const user = getAuth().currentUser;
    if (!user) return null;
      try {
        const docSnap = await getDoc(doc(db, "memorizeTable", user.uid));
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
    <div className="bg-background min-h-screen w-full max-w-full overflow-x-hidden px-2 sm:px-4">
      <Header title={"Memorize Ayah by Ayah"} />

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




      <div className="mx-auto w-full max-w-4xl p-4 lg:p-6  overflow-x-hidden">



        {/* Reciter Selection */}
        <div className="flex flex-wrap  justify-center mb-4 sm:mb-3">
          <div className="flex flex-wrap  flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2 items-center">
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
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs sm:text-sm"
              >
                Continue
              </button>
              </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Reciter:</span>
              <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                <SelectTrigger className="w-full lg:max-w-[250px]">
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

       {/* Progress Indicator */}
    
         <div className="flex mt-1 ">
          <h3 className="mb-2s">Progress: {Math.round(percentMemorized)}%</h3>
          </div>

          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{
                width: `${(ayahNumber / ayahCounts.ayah_counts[surahNumber - 1]) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1 text-right text-xs text-gray-500">
           <p> Memoried</p>
           <p> {ayahNumber} of {ayahCounts.ayah_counts[surahNumber - 1]} ayahs memorized</p>
          </div>
          <div className="mt-1 text-right text-xs text-gray-500">
          </div>
       

        {/* Current Ayah Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="mb-2 text-xl font-semibold">
              {ayahData ? `${ayahData.surah} ${ayahData.number}/${ayahCounts.ayah_counts[surahNumber - 1]}` : "Loading..."}
            </h2>
            <p
              className="font-arabic leading-snug text-[clamp(1.25rem,4vw,2rem)] p-3 text-center"
              dir="rtl"
              lang="ar"
            >
              {ayahData?.arabic || "Loading..."}
            </p>


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
            <div className="mb-2 w-full">
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
            <div className="flex flex-col sm:flex-row sm:justify-between items-stretch gap-3 w-full">
              {/* Play, Rewind, Loop, Speed */}
              <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
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
                      className="h-10 w-10 sm:h-9 sm:w-9"
                    >
                      <TimerReset className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <DropdownMenuItem
                        key={rate}
                        onClick={() => setPlaybackRate(rate)}
                        className={cn("cursor-pointer", playbackRate === rate && "font-bold text-emerald-600")}
                      >
                        {rate}x
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mute + Volume */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
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
                  className="w-full sm:w-28 md:w-32 "
                />
              </div>
            </div>



            <div className="flex flex-col justify-between mt-6 sm:flex-row">
              <Button
                onClick={handleMarkAsMemorized}
                disabled={isMemorized}
                className="flex items-center gap-2 text-sm sm:text-base"
                variant={isMemorized ? "outline" : "default"}
              >
                <Check className="h-4 w-4" />
                {isMemorized ? "Memorized" : "Mark as Memorized"}
              </Button>

              {isMemorized && 
               <Button
                onClick={handleUnmarkAsMemorized}
                className="flex items-center gap-2 text-sm sm:text-base bg-red-600 hover:bg-red-600/80 text-white-100"
                >
                <Minus className="h-4 w-4" />
                {isMemorized ? "Unmark as Memorized" : "Unmark as Memorized"}
              </Button>}
            </div>
            
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <PrevProgressCard
              title="Previous Ayah"
              tooltipMessage="Memorize this ayah to unlock the next one"
              onUnlockedClick={goToPreviousAyah} isLocked={false}        
            />
          {/* Next Ayah Card (Locked until current is memorized) */}
          <LockedProgressCard
            title="Next Ayah"
            isLocked={!isMemorized}
            tooltipMessage="Memorize this ayah to unlock the next one"
            onUnlockedClick={goToNextAyah}
          />
        </div>
      </div>
    </div>
  )
}
