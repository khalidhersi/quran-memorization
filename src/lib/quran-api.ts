// src/lib/quran-api.ts
const BASE_URL = "https://api.alquran.cloud/v1";

export async function getSurahs() {
  const res = await fetch(`${BASE_URL}/surah`);
  const data = await res.json();
  return data.data; // array of surahs
}

export async function getSurahByNumber(surahNumber: number) {
  const res = await fetch(`${BASE_URL}/surah/${surahNumber}`);
  const data = await res.json();
  return data.data; // surah details
}

export async function getAyah(surahNumber : any, ayahNumber: any) {
    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}`);
    const data = await res.json();
    return data.data;
  }