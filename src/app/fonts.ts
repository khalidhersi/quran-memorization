import { Noto_Sans_Arabic } from "next/font/google"

// Arabic font for Quran text
export const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-arabic",
})
