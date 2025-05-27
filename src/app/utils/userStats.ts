import { db } from "@/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export interface UserStats {
  xp: number
  level: number
  xpForNextLevel: number
  streak: number
  lastStreakMilestone: number
}

// Load stats
export async function loadUserStats(userId: string): Promise<UserStats> {
  const docRef = doc(db, "userStats", userId)
  const snap = await getDoc(docRef)

  if (snap.exists()) {
    return snap.data() as UserStats
  } else {
    // Default values if new user
    return {
      xp: 0,
      level: 1,
      xpForNextLevel: 500,
      streak: 0,
      lastStreakMilestone: 0,
    }
  }
}

// Save stats
export async function saveUserStats(userId: string, stats: UserStats) {
  const docRef = doc(db, "userStats", userId)
  await setDoc(docRef, stats)
}
