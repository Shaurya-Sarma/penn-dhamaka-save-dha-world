"use client"

import useSWR from "swr"
import { HeroSection } from "@/components/hero-section"
import { ActionSection } from "@/components/action-section"
import { Footer } from "@/components/footer"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function SaveDhaWorldPage() {
  const { data: counters, mutate } = useSWR("/api/impact", fetcher, {
    fallbackData: { trees: 0, messages: 0, shares: 0 },
    refreshInterval: 5000, // Refresh every 5 seconds to see other users' actions
  })

  const incrementCounter = async (type: "trees" | "messages" | "shares") => {
    // Optimistically update the UI
    mutate(
      { ...counters, [type]: counters[type] + 1 },
      false
    )

    // Send the update to the server
    const response = await fetch("/api/impact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: type }),
    })

    if (response.ok) {
      // Revalidate with server data
      mutate()
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection counters={counters} />
      <ActionSection onAction={incrementCounter} />
      <Footer />
    </main>
  )
}
