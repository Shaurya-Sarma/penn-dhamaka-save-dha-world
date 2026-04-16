"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Megaphone, Share2, ExternalLink } from "lucide-react";
import { EmailRepDialog } from "@/components/email-rep-dialog";

interface ActionSectionProps {
  onAction: (type: "trees" | "messages" | "shares") => void;
}

export function ActionSection({ onAction }: ActionSectionProps) {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const handleDonate = () => {
    onAction("trees");
    window.open("https://secure.actblue.com/donate/sunrise-web-2023?amount=5", "_blank");
  };

  const handleSendMessage = () => {
    onAction("messages");
    setEmailDialogOpen(true);
  };

  const handleEmailSent = () => {
    onAction("messages");
  };

  const handleShare = () => {
    onAction("shares");
    const shareText = encodeURIComponent(
      "I just helped save the world with Penn Dhamaka 🌍 #SaveDhaWorld",
    );
    const shareUrl = encodeURIComponent(window.location.href);

    if (navigator.share) {
      navigator
        .share({
          title: "Save Dha World",
          text: "I just helped save the world with Penn Dhamaka 🌍 #SaveDhaWorld",
          url: window.location.href,
        })
        .catch(() => {
          window.open(
            `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
            "_blank",
          );
        });
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
        "_blank",
      );
    }
  };

  return (
    <>
      <EmailRepDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onEmailSent={handleEmailSent}
      />

      {/* Neon horizontal rule — like a TV channel separator */}
      <div className="w-full h-px bg-primary/40 shadow-[0_0_8px_oklch(0.82_0.18_195_/_0.6)]" />

      <section
        id="action-section"
        className="py-16 md:py-24 px-4 bg-background scanlines"
      >
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-12">
            {/* Section label — like a VHS menu */}
            <p className="font-handsc text-xl tracking-widest text-primary neon-text mb-2 uppercase">
              ▶ SELECT AN ACTION
            </p>
            <h2 className="font-handsc text-4xl md:text-5xl text-foreground tracking-wide glitch-title mb-4">
              1 ACTION = 1 IMPACT
            </h2>
            <div className="w-full h-px bg-border" />
          </div>

          <div className="flex flex-col gap-6">
            <ActionCard
              icon={
                <img
                  src="/images/sunrise-logo.png"
                  alt="Sunrise Movement"
                  className="w-12 h-12 rounded-full object-cover"
                  style={{ filter: "drop-shadow(0 0 6px oklch(0.82 0.18 195 / 0.7))" }}
                />
              }
              iconColor="text-primary"
              glowClass="neon-text"
              accentBorderClass="border-l-primary"
              accentGlowStyle={{ boxShadow: "inset 3px 0 0 oklch(0.82 0.18 195 / 0.8), 0 0 20px oklch(0.82 0.18 195 / 0.08)" }}
              title="Donate to Sunrise"
              description="Sunrise is building political power to stop climate change. $5 helps win a Green New Deal."
              buttonText="▶ Donate Now"
              buttonIcon={<ExternalLink className="w-4 h-4" />}
              onClick={handleDonate}
              buttonClass="bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/40 neon-box"
            />

            <ActionCard
              icon={<Megaphone className="w-7 h-7" />}
              iconColor="text-secondary"
              glowClass="neon-text-magenta"
              accentBorderClass="border-l-secondary"
              accentGlowStyle={{ boxShadow: "inset 3px 0 0 oklch(0.75 0.22 45 / 0.8), 0 0 20px oklch(0.75 0.22 45 / 0.08)" }}
              title="Turn Science into Action"
              description="Send a message to your representative in 10 seconds. 1 tap → auto-filled message → send."
              buttonText="▶ Make Your Voice Heard"
              onClick={handleSendMessage}
              buttonClass="bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-secondary/40 shadow-[0_0_12px_oklch(0.75_0.22_45_/_0.4)]"
            />

            <ActionCard
              icon={<Share2 className="w-7 h-7" />}
              iconColor="text-accent"
              glowClass=""
              accentBorderClass="border-l-accent"
              accentGlowStyle={{ boxShadow: "inset 3px 0 0 oklch(0.83 0.22 135 / 0.8), 0 0 20px oklch(0.83 0.22 135 / 0.08)" }}
              title="Spread the Mission"
              description="Post your impact and tag 3 friends to join the mission."
              buttonText="▶ Share Now"
              onClick={handleShare}
              buttonClass="bg-accent text-accent-foreground hover:bg-accent/90 border border-accent/40 shadow-[0_0_12px_oklch(0.83_0.22_135_/_0.4)]"
            />
          </div>
        </div>
      </section>

      {/* Bottom neon rule */}
      <div className="w-full h-px bg-primary/40 shadow-[0_0_8px_oklch(0.82_0.18_195_/_0.6)]" />
    </>
  );
}

function ActionCard({
  icon,
  iconColor,
  glowClass,
  accentBorderClass,
  accentGlowStyle,
  title,
  description,
  buttonText,
  buttonIcon,
  onClick,
  buttonClass,
}: {
  icon: React.ReactNode;
  iconColor: string;
  glowClass: string;
  accentBorderClass: string;
  accentGlowStyle: React.CSSProperties;
  title: string;
  description: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  onClick: () => void;
  buttonClass: string;
}) {
  return (
    <Card
      className={`bg-card border border-border border-l-4 ${accentBorderClass} rounded-sm transition-all duration-200 hover:-translate-y-0.5 group`}
      style={accentGlowStyle}
    >
      <CardHeader className="pb-3">
        <div className={`${iconColor} ${glowClass} mb-2 transition-transform group-hover:scale-110 w-fit`}>
          {icon}
        </div>
        <CardTitle className="font-handsc text-2xl text-foreground tracking-wide">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground font-medium leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onClick}
          size="lg"
          className={`w-full font-handsc text-xl tracking-widest py-6 rounded-sm transition-all duration-200 hover:scale-[1.02] ${buttonClass}`}
        >
          {buttonText}
          {buttonIcon && <span className="ml-2">{buttonIcon}</span>}
        </Button>
      </CardContent>
    </Card>
  );
}
