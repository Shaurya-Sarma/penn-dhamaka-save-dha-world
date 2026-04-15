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
import { TreePine, Megaphone, Share2, ExternalLink } from "lucide-react";
import { EmailRepDialog } from "@/components/email-rep-dialog";

interface ActionSectionProps {
  onAction: (type: "trees" | "messages" | "shares") => void;
}

export function ActionSection({ onAction }: ActionSectionProps) {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const handlePlantTree = () => {
    onAction("trees");
    // Placeholder link - replace with actual donation link
    window.open("https://onetreeplanted.org/", "_blank");
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

    // Try native share first, fallback to Twitter
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
      <section
        id="action-section"
        className="py-16 md:py-24 px-4 bg-linear-to-b from-background to-card/15"
      >
        <div className="max-w-lg mx-auto">
          <h2 className="font-handsc text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            1 ACTION = 1 IMPACT
          </h2>
          <p className="text-muted-foreground/90 font-medium text-center mb-12 text-pretty">
            Every action counts. Choose how you want to make a difference.
          </p>

          <div className="flex flex-col gap-6">
            {/* Plant a Tree Card */}
            <ActionCard
              icon={<TreePine className="w-8 h-8" />}
              iconBg="bg-primary/5"
              iconColor="text-primary"
              title="Plant a Tree"
              description="$5 = 1 tree planted. Support real, verified reforestation projects."
              buttonText="Plant a Tree"
              buttonIcon={<ExternalLink className="w-4 h-4" />}
              onClick={handlePlantTree}
              variant="primary"
            />

            {/* Send Message Card */}
            <ActionCard
              icon={<Megaphone className="w-8 h-8" />}
              iconBg="bg-secondary/5"
              iconColor="text-secondary"
              title="Turn Science into Action"
              description="Send a message to your representative in 10 seconds. 1 tap → auto-filled message → send."
              buttonText="Make Your Voice Heard"
              onClick={handleSendMessage}
              variant="secondary"
            />

            {/* Share Card */}
            <ActionCard
              icon={<Share2 className="w-8 h-8" />}
              iconBg="bg-accent/5"
              iconColor="text-accent"
              title="Spread the Mission"
              description="Post your impact and tag 3 friends to join the mission."
              buttonText="Share Now"
              onClick={handleShare}
              variant="accent"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function ActionCard({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  buttonText,
  buttonIcon,
  onClick,
  variant,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  onClick: () => void;
  variant: "primary" | "secondary" | "accent";
}) {
  const buttonStyles = {
    primary:
      "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20",
    secondary:
      "bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/20",
    accent:
      "bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20",
  };

  const cardHoverStyles = {
    primary: "hover:border-primary/50 hover:shadow-primary/5",
    secondary: "hover:border-secondary/50 hover:shadow-secondary/10",
    accent: "hover:border-accent/50 hover:shadow-accent/10",
  };

  return (
    <Card
      className={`bg-card/80 border-border backdrop-blur-sm transition-all duration-300 hover:shadow-xl group ${cardHoverStyles[variant]}`}
    >
      <CardHeader className="pb-3">
        <div
          className={`w-14 h-14 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mb-3 transition-transform group-hover:scale-110`}
        >
          {icon}
        </div>
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground/90 font-medium leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onClick}
          size="lg"
          className={`w-full text-base py-6 rounded-xl transition-all duration-300 hover:scale-[1.02] ${buttonStyles[variant]}`}
        >
          {buttonText}
          {buttonIcon && <span className="ml-2">{buttonIcon}</span>}
        </Button>
      </CardContent>
    </Card>
  );
}
