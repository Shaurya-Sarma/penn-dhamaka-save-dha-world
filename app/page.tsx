"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { ActionSection } from "@/components/action-section"
import { Footer } from "@/components/footer"

export default function SaveDhaWorldPage() {
  const [counters, setCounters] = useState({
    trees: 0,
    messages: 0,
    shares: 0,
  })

  const incrementCounter = (type: "trees" | "messages" | "shares") => {
    setCounters((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }))
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection counters={counters} />
      <ActionSection onAction={incrementCounter} />
      <Footer />
    </main>
  )
}
