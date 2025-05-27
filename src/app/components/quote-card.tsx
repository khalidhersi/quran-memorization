"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { QuoteIcon } from "lucide-react"

// Sample quotes
const quotes = [
  {
    text: "The best among you are those who learn the Quran and teach it.",
    source: "Prophet Muhammad ﷺ",
  },
  {
    text: "Whoever recites a letter from the Book of Allah will receive a hasanah (good deed), and each hasanah is worth ten like it.",
    source: "Prophet Muhammad ﷺ",
  },
  {
    text: "The Quran will meet its companion on the Day of Resurrection when his grave is opened for him, in the form of a pale man. It will say to him: 'Do you recognize me?' He will say: 'I do not recognize you.' It will say: 'I am your companion the Quran, who kept you thirsty during the day and kept you awake at night.'",
    source: "Ibn Majah",
  },
  {
    text: "The example of a believer who recites the Quran is like that of a citron (a citrus fruit) which is good in taste and good in smell.",
    source: "Sahih al-Bukhari",
  },
  {
    text: "Verily, the one who recites the Quran beautifully, smoothly, and precisely will be in the company of the noble and obedient angels.",
    source: "Sahih al-Bukhari",
  },
]

export function QuoteCard() {
  const [quote, setQuote] = useState(quotes[0])

  // Change quote daily
  useEffect(() => {
    // Get day of year to ensure same quote shows all day
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)

    // Use day of year to select quote
    const quoteIndex = dayOfYear % quotes.length
    setQuote(quotes[quoteIndex])
  }, [])

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <QuoteIcon className="h-8 w-8 shrink-0 text-emerald-600" />
          <div>
            <p className="text-lg font-medium italic">"{quote.text}"</p>
            <p className="mt-2 text-sm text-muted-foreground">— {quote.source}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
