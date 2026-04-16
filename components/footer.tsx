import { ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="py-16 px-4 bg-background scanlines">
      <div className="max-w-5xl mx-auto">
        {/* Donation Banner — neon cyan glow frame */}
        <div
          className="mb-12 p-6 md:p-8 rounded-sm bg-card border border-primary/40"
          style={{
            boxShadow:
              "0 0 12px oklch(0.82 0.18 195 / 0.3), 0 0 40px oklch(0.82 0.18 195 / 0.10), inset 0 0 20px rgba(0,0,0,0.3)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Heart className="w-4 h-4 text-secondary neon-text-magenta" />
                <span className="font-handsc text-lg tracking-widest text-secondary neon-text-magenta uppercase">
                  Help Us Perform
                </span>
              </div>
              <h3 className="font-handsc text-2xl md:text-3xl text-foreground tracking-wide mb-1 glitch-title">
                Support Penn Dhamaka&apos;s 2025-26 Season
              </h3>
              <p className="text-muted-foreground font-medium text-sm md:text-base">
                Help us continue creating performances that inspire climate action.
              </p>
            </div>
            <Button
              onClick={() =>
                window.open(
                  "https://www.gofundme.com/f/support-penn-dhamakas-202526-dance-season",
                  "_blank",
                )
              }
              className="bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/50 font-handsc text-xl tracking-widest whitespace-nowrap neon-box"
              size="lg"
            >
              Donate Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Attribution */}
        <div className="text-center">
          <p className="font-handsc text-2xl tracking-widest text-muted-foreground">
            Built by{" "}
            <span className="text-primary neon-text neon-flicker">
              Penn Dhamaka
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
