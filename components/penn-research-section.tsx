"use client";

import { ExternalLink, FlaskConical, Newspaper, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
  {
    icon: <FlaskConical className="w-6 h-6" />,
    channel: "CH 01",
    title: "Climate @ SAS",
    description:
      "Penn biologists, physicists, and social scientists on the front lines of climate research — from plant resilience and extreme weather to coral reefs and the Doomsday Clock.",
    url: "https://climate.sas.upenn.edu/news/",
    color: "text-primary",
    glowClass: "neon-text",
    borderClass: "border-l-primary",
    buttonClass:
      "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/40 neon-box",
    accentStyle: {
      boxShadow:
        "inset 3px 0 0 oklch(0.82 0.18 195 / 0.8), 0 0 20px oklch(0.82 0.18 195 / 0.08)",
    },
  },
  {
    icon: <Newspaper className="w-6 h-6" />,
    channel: "CH 02",
    title: "Penn Today",
    description:
      "500+ stories on climate change from every corner of Penn. Read through student innovations, and breakthroughs making headlines worldwide.",
    url: "https://penntoday.upenn.edu/subtopic/climate-change",
    color: "text-secondary",
    glowClass: "neon-text-magenta",
    borderClass: "border-l-secondary",
    buttonClass:
      "bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-secondary/40 shadow-[0_0_12px_oklch(0.75_0.22_45_/_0.4)]",
    accentStyle: {
      boxShadow:
        "inset 3px 0 0 oklch(0.75 0.22 45 / 0.8), 0 0 20px oklch(0.75 0.22 45 / 0.08)",
    },
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    channel: "CH 03",
    title: "Penn Sustainability",
    description:
      "Penn has cut campus greenhouse gas emissions by 47% and is targeting full carbon neutrality by 2042 through solar power, Green Labs, and the $200M Century Bond Program.",
    url: "https://www.sustainability.upenn.edu/campus-initiatives/climate-energy",
    color: "text-accent",
    glowClass: "",
    borderClass: "border-l-accent",
    buttonClass:
      "bg-accent text-accent-foreground hover:bg-accent/90 border border-accent/40 shadow-[0_0_12px_oklch(0.83_0.22_135_/_0.4)]",
    accentStyle: {
      boxShadow:
        "inset 3px 0 0 oklch(0.83 0.22 135 / 0.8), 0 0 20px oklch(0.83 0.22 135 / 0.08)",
    },
  },
];

export function PennResearchSection() {
  return (
    <>
      <div className="w-full h-px bg-primary/40 shadow-[0_0_8px_oklch(0.82_0.18_195_/_0.6)]" />

      <section className="py-16 md:py-24 px-4 bg-background scanlines">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-12">
            <p className="font-handsc text-xl tracking-widest text-primary neon-text mb-2 uppercase">
              ▶ TUNE IN
            </p>
            <h2 className="font-handsc text-4xl md:text-5xl text-foreground tracking-wide glitch-title mb-4">
              PENN SCIENCE IN ACTION
            </h2>
            <div className="w-full h-px bg-border mb-4" />
            <p className="text-muted-foreground font-medium text-pretty">
              The same mission lives in Penn&apos;s labs, classrooms, and
              campus right now.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {resources.map((resource) => (
              <div
                key={resource.title}
                className={`bg-card border border-border border-l-4 ${resource.borderClass} rounded-sm transition-all duration-200 hover:-translate-y-0.5 group`}
                style={resource.accentStyle}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`${resource.color} ${resource.glowClass} transition-transform group-hover:scale-110`}
                    >
                      {resource.icon}
                    </div>
                    <span className="font-handsc text-lg text-muted-foreground tracking-widest">
                      {resource.channel}
                    </span>
                  </div>
                  <h3
                    className={`font-handsc text-2xl tracking-wide mb-2 ${resource.color} ${resource.glowClass}`}
                  >
                    {resource.title}
                  </h3>
                  <p className="text-muted-foreground font-medium leading-relaxed text-sm mb-4">
                    {resource.description}
                  </p>
                  <Button
                    onClick={() => window.open(resource.url, "_blank")}
                    size="lg"
                    className={`w-full font-handsc text-lg tracking-widest py-5 rounded-sm transition-all duration-200 hover:scale-[1.02] ${resource.buttonClass}`}
                  >
                    ▶ Learn More
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-primary/40 shadow-[0_0_8px_oklch(0.82_0.18_195_/_0.6)]" />
    </>
  );
}
