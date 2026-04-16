"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Megaphone, Share2 } from "lucide-react";

interface HeroSectionProps {
  counters: {
    trees: number;
    messages: number;
    shares: number;
  };
}

export function HeroSection({ counters }: HeroSectionProps) {
  const scrollToActions = () => {
    document.getElementById("action-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden scanlines">
      {/* Edge vignette — CRT screen falloff */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)] pointer-events-none z-10" />

      {/* ● REC indicator — top right */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-2 select-none">
        <span className="w-3 h-3 rounded-full bg-secondary rec-blink" />
        <span className="font-handsc text-secondary text-xl tracking-widest neon-text-magenta">
          REC
        </span>
      </div>

      {/* ▶ NOW PLAYING — top left */}
      <div className="absolute top-5 left-5 z-20 select-none">
        <span className="font-handsc text-primary text-xl tracking-widest neon-text neon-flicker">
          ▶ NOW PLAYING
        </span>
      </div>

      {/* VHS timestamp — bottom right */}
      <div className="absolute bottom-20 right-5 z-20 select-none">
        <span className="font-handsc text-primary/50 text-2xl tracking-widest">
          9:40:53
        </span>
      </div>

      {/* CHANNEL badge — bottom left */}
      <div className="absolute bottom-20 left-5 z-20 select-none">
        <span className="font-handsc text-muted-foreground text-xl tracking-widest">
          CH&nbsp;25
        </span>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Logo with neon phosphor glow */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/images/logo.png"
            alt="Save Dha World lion logo"
            className="w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain mb-6"
            style={{ filter: "drop-shadow(0 0 14px oklch(0.82 0.18 195 / 0.7)) drop-shadow(0 0 30px oklch(0.82 0.18 195 / 0.3))" }}
          />
          {/* Title with chromatic aberration glitch */}
          <h1 className="font-handsc text-5xl md:text-7xl lg:text-8xl tracking-wide text-balance text-center leading-tight">
            <span className="text-primary neon-text">SAVE </span>
            <span className="text-secondary neon-text-magenta">DHA</span>
            <span className="text-accent"> WORLD</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl mx-auto mb-10 text-pretty leading-relaxed">
          You just watched Penn Dhamaka show you how to change the world.
          <br />
          Now help us change its future—in{" "}
          <span className="text-primary neon-text font-semibold">30 seconds</span>.
        </p>

        {/* Live Impact Counter — CRT screen */}
        <div className="mb-10 crt-frame overflow-hidden">
          {/* Scanlines overlaid on screen */}
          <div className="absolute inset-0 scanlines pointer-events-none z-10 rounded-sm" />

          {/* Screen header bar */}
          <div className="relative bg-primary/10 border-b border-primary/30 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="font-handsc text-xl tracking-widest text-primary neon-text">
                LIVE IMPACT FROM TONIGHT
              </span>
            </div>
            <span className="font-handsc text-lg text-muted-foreground tracking-wider hidden sm:block">
              SIGNAL OK
            </span>
          </div>

          {/* Counter grid */}
          <div className="relative grid grid-cols-3 gap-4 md:gap-8 p-6 md:p-8 bg-card">
            <CounterItem
              icon={
                <img
                  src="/images/sunrise-logo.png"
                  alt="Sunrise"
                  className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover"
                />
              }
              value={counters.trees}
              label="donations"
              color="text-primary"
              glowClass="neon-text"
            />
            <CounterItem
              icon={<Megaphone className="w-5 h-5 md:w-6 md:h-6" />}
              value={counters.messages}
              label="messages sent"
              color="text-secondary"
              glowClass="neon-text-magenta"
            />
            <CounterItem
              icon={<Share2 className="w-5 h-5 md:w-6 md:h-6" />}
              value={counters.shares}
              label="shares"
              color="text-accent"
              glowClass=""
            />
          </div>
        </div>

        {/* CTA Button with neon glow */}
        <Button
          onClick={scrollToActions}
          size="lg"
          className="font-handsc text-2xl tracking-widest px-10 py-7 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/50 transition-all duration-200 hover:scale-105 neon-box group"
        >
          Take Action
          <ChevronDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
}

function CounterItem({
  icon,
  value,
  label,
  color,
  glowClass,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
  glowClass: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={color}>{icon}</div>
      <span className={`font-handsc text-4xl md:text-6xl tabular-nums ${color} ${glowClass}`}>
        {value}
      </span>
      <span className="font-handsc text-sm md:text-lg text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
