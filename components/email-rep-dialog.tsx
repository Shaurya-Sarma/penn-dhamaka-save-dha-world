"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Copy,
  Phone,
  Users,
  ExternalLink,
} from "lucide-react";

interface Representative {
  name: string;
  office: string;
  party?: string;
  website?: string;
  phone?: string;
  officeAddress?: string;
}

interface EmailRepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmailSent: () => void;
}

const EMAIL_SUBJECT = "Support science-based climate action";

const getEmailBody = (repName: string) => `Dear ${repName},

I'm writing as a constituent to urge your support for practical, science-based solutions to address climate change.

We are already seeing the effects of a changing climate through extreme weather, rising costs, and impacts on our communities. Addressing this issue is not just about the environment—it's about economic stability, public health, and long-term national resilience.

I encourage you to support policies that invest in clean energy, strengthen climate resilience, and promote innovation in sustainable technologies. These solutions can create jobs, reduce long-term costs, and position the United States as a global leader.

This issue matters to me and many others in our community, and I hope it will remain a priority in your work.

Thank you for your time and service.

Sincerely,
[Your Name]
[Zip Code]`;

export function EmailRepDialog({
  open,
  onOpenChange,
  onEmailSent,
}: EmailRepDialogProps) {
  const [step, setStep] = useState<"zip" | "select" | "preview">("zip");
  const [zipCode, setZipCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [selectedRep, setSelectedRep] = useState<Representative | null>(null);
  const [userName, setUserName] = useState("");
  const [copied, setCopied] = useState(false);

  const resetDialog = () => {
    setStep("zip");
    setZipCode("");
    setLoading(false);
    setError("");
    setRepresentatives([]);
    setSelectedRep(null);
    setUserName("");
    setCopied(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetDialog();
    }
    onOpenChange(newOpen);
  };

  const lookupRepresentatives = async () => {
    if (!/^\d{5}$/.test(zipCode)) {
      setError("Please enter a valid 5-digit zip code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/representatives?zipCode=${zipCode}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setRepresentatives(data.representatives || []);
      setStep("select");
    } catch {
      setError("Failed to look up representatives. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectRepresentative = (rep: Representative) => {
    setSelectedRep(rep);
    setStep("preview");
  };

  const getPersonalizedEmail = () => {
    if (!selectedRep) return { subject: "", body: "" };

    const emailBody = getEmailBody(selectedRep.name);
    const personalizedBody = emailBody
      .replace("[Your Name]", userName || "[Your Name]")
      .replace("[Zip Code]", zipCode);

    return {
      subject: EMAIL_SUBJECT,
      body: personalizedBody,
    };
  };

  const openContactForm = () => {
    if (!selectedRep) return;
    // Search for the representative's official contact form
    const searchQuery = `${selectedRep.name} ${selectedRep.office} official contact form`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(searchUrl, "_blank");
  };

  const copyEmailContent = async () => {
    const { subject, body } = getPersonalizedEmail();
    const fullContent = `Subject: ${subject}\n\n${body}`;

    try {
      await navigator.clipboard.writeText(fullContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = fullContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-[425px] sm:max-w-[525px] md:max-w-[650px] max-h-[90vh] overflow-y-auto">
        {step === "zip" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" />
                Find Your Representative
              </DialogTitle>
              <DialogDescription>
                Enter your zip code to find your local representatives and send
                them a pre-written message about climate action.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter 5-digit zip code"
                  value={zipCode}
                  onChange={(e) => {
                    setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5));
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      lookupRepresentatives();
                    }
                  }}
                  maxLength={5}
                  className="flex-1"
                />
                <Button
                  onClick={lookupRepresentatives}
                  disabled={loading || zipCode.length !== 5}
                  className="bg-secondary text-white hover:bg-secondary/90"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Find"
                  )}
                </Button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>
          </>
        )}

        {step === "select" && (
          <>
            <DialogHeader>
              <DialogTitle>Select a Representative</DialogTitle>
              <DialogDescription>
                Choose who you&apos;d like to contact about climate action.
              </DialogDescription>
            </DialogHeader>

            {representatives.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="rounded-full bg-muted p-3">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">
                    No representatives found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We couldn&apos;t find representatives for zip code {zipCode}
                    . Please try a different zip code.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 py-4 max-h-[280px] sm:max-h-[320px] md:max-h-[400px] overflow-y-auto pr-1">
                {representatives.map((rep, index) => (
                  <button
                    key={index}
                    onClick={() => selectRepresentative(rep)}
                    className="flex flex-col items-start gap-1.5 p-4 rounded-lg border border-border bg-card hover:bg-accent/10 hover:border-secondary/50 transition-colors text-left w-full"
                  >
                    <span className="font-semibold text-foreground">
                      {rep.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {rep.office}
                    </span>
                    {rep.phone && (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3 shrink-0" />
                        {rep.phone}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                variant="ghost"
                onClick={() => setStep("zip")}
                className="w-full"
              >
                Back
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "preview" && selectedRep && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Ready to Send
              </DialogTitle>
              <DialogDescription>
                Contact {selectedRep.name} via their official website or use the
                pre-written message below.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 py-4 overflow-y-auto">
              {/* Contact Info */}
              <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4">
                <p className="font-semibold text-foreground mb-1">
                  {selectedRep.name}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedRep.office}
                </p>
                {selectedRep.phone && (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    {selectedRep.phone}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="userName"
                  className="text-sm font-medium text-foreground"
                >
                  Your Name (optional)
                </label>
                <Input
                  id="userName"
                  placeholder="Enter your name to personalize"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-3 max-h-[120px] overflow-y-auto flex-shrink-0">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Message Preview:
                </p>
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                  {getEmailBody(selectedRep.name)
                    .replace("[Your Name]", userName || "[Your Name]")
                    .replace("[Zip Code]", zipCode)}
                </p>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Congress members don&apos;t have public emails. Copy the
                message, then find their official contact form to submit it.
              </p>
            </div>

            <DialogFooter className="!flex-col gap-2 pt-4">
              <Button
                onClick={copyEmailContent}
                className="w-full bg-secondary text-white hover:bg-secondary/90"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Message
                  </>
                )}
              </Button>
              <Button
                onClick={openContactForm}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Find Contact Form
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStep("select")}
                className="w-full"
              >
                Back to Representatives
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
