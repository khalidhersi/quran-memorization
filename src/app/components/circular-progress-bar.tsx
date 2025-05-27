"use client"

import { useEffect, useState } from "react"

interface CircularProgressBarProps {
  percentage: number
  size?: number
  strokeWidth?: number
  circleColor?: string
  progressColor?: string
}

export function CircularProgressBar({
  percentage,
  size = 200,
  strokeWidth = 15,
  circleColor = "#e6e6e6",
  progressColor = "#10b981",
}: CircularProgressBarProps) {
  const [progress, setProgress] = useState(0)

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage)
    }, 100)

    return () => clearTimeout(timer)
  }, [percentage])

  // Calculate values
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={circleColor} strokeWidth={strokeWidth} />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>

      {/* Percentage text in the middle */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}
