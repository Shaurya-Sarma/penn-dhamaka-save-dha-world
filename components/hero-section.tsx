"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, TreePine, Megaphone, Share2 } from "lucide-react"

interface HeroSectionProps {
  counters: {
    trees: number
    messages: number
    shares: number
  }
}

export function HeroSection({ counters }: HeroSectionProps) {
  const scrollToActions = () => {
    document.getElementById("action-section")?.scrollIntoView({
      behavior: "smooth",
    })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/5 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Title */}
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/images/logo.png" 
            alt="Save Dha World lion logo" 
            className="w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain mb-4 drop-shadow-2xl"
          />
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance text-center">
            <span className="text-foreground">SAVE </span>
            <span className="text-primary">DHA</span>
            <span className="text-foreground"> WORLD</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-12 text-pretty leading-relaxed">
          You just watched Penn Dhamaka show you how to change the world.
          <br />
          Now help us change its future—in <span className="text-primary font-semibold">30 seconds</span>.
        </p>

        {/* Live Impact Counter */}
        <div className="mb-12 p-6 md:p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-sm">
          <p className="text-sm uppercase tracking-widest text-accent font-semibold mb-6 flex items-center justify-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            LIVE IMPACT FROM TONIGHT
          </p>

          <div className="grid grid-cols-3 gap-4 md:gap-8">
            <CounterItem
              icon={<TreePine className="w-5 h-5 md:w-6 md:h-6" />}
              value={counters.trees}
              label="trees planted"
            />
            <CounterItem
              icon={<Megaphone className="w-5 h-5 md:w-6 md:h-6" />}
              value={counters.messages}
              label="messages sent"
            />
            <CounterItem
              icon={<Share2 className="w-5 h-5 md:w-6 md:h-6" />}
              value={counters.shares}
              label="shares"
            />
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={scrollToActions}
          size="lg"
          className="text-lg px-8 py-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25 group"
        >
          Take Action
          <ChevronDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </Button>
      </div>
    </section>
  )
}

function CounterItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: number
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-primary">{icon}</div>
      <span className="text-3xl md:text-5xl font-bold text-foreground tabular-nums">
        {value}
      </span>
      <span className="text-xs md:text-sm text-muted-foreground">{label}</span>
    </div>
  )
}
