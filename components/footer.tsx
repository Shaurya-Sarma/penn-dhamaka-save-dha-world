import { ExternalLink, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="py-16 px-4 border-t border-border bg-card/15">
      <div className="max-w-5xl mx-auto">
        {/* Support Banner */}
        <div className="mb-12 p-6 md:p-8 rounded-2xl bg-secondary/10 border border-secondary/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Heart className="w-5 h-5 text-primary" />
                <span className="text-xs uppercase tracking-widest font-bold text-primary">Help Us Perform</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">Support Penn Dhamaka's 2025-26 Season</h3>
              <p className="text-muted-foreground text-sm md:text-base">Help us continue creating performances that inspire climate action.</p>
            </div>
            <Button
              onClick={() => window.open("https://www.gofundme.com/f/support-penn-dhamakas-202526-dance-season", "_blank")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg font-semibold whitespace-nowrap"
              size="lg"
            >
              Donate Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-1">
            Built by <span className="text-primary">Penn Dhamaka</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Turning performance into impact
          </p>
        </div>
      </div>
    </footer>
  )
}
