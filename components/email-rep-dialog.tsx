"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2, Mail, MapPin, AlertCircle, CheckCircle2, Copy, ExternalLink, Phone } from "lucide-react"

interface Representative {
  name: string
  office: string
  party?: string
  website?: string
  phone?: string
  officeAddress?: string
}

interface EmailRepDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEmailSent: () => void
}

const EMAIL_SUBJECT = "Support science-based climate action"

const getEmailBody = (repName: string) => `Dear ${repName},

I'm writing as a constituent to urge your support for practical, science-based solutions to address climate change.

We are already seeing the effects of a changing climate through extreme weather, rising costs, and impacts on our communities. Addressing this issue is not just about the environment—it's about economic stability, public health, and long-term national resilience.

I encourage you to support policies that invest in clean energy, strengthen climate resilience, and promote innovation in sustainable technologies. These solutions can create jobs, reduce long-term costs, and position the United States as a global leader.

This issue matters to me and many others in our community, and I hope it will remain a priority in your work.

Thank you for your time and service.

Sincerely,
[Your Name]
[Zip Code]`

export function EmailRepDialog({ open, onOpenChange, onEmailSent }: EmailRepDialogProps) {
  const [step, setStep] = useState<"zip" | "select" | "preview">("zip")
  const [zipCode, setZipCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [representatives, setRepresentatives] = useState<Representative[]>([])
  const [selectedRep, setSelectedRep] = useState<Representative | null>(null)
  const [userName, setUserName] = useState("")
  const [copied, setCopied] = useState(false)

  const resetDialog = () => {
    setStep("zip")
    setZipCode("")
    setLoading(false)
    setError("")
    setRepresentatives([])
    setSelectedRep(null)
    setUserName("")
    setCopied(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetDialog()
    }
    onOpenChange(newOpen)
  }

  const lookupRepresentatives = async () => {
    if (!/^\d{5}$/.test(zipCode)) {
      setError("Please enter a valid 5-digit zip code")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/representatives?zipCode=${zipCode}`)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return
      }

      setRepresentatives(data.representatives || [])
      setStep("select")
    } catch {
      setError("Failed to look up representatives. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const selectRepresentative = (rep: Representative) => {
    setSelectedRep(rep)
    setStep("preview")
  }

  const getPersonalizedEmail = () => {
    if (!selectedRep) return { subject: "", body: "" }
    
    const emailBody = getEmailBody(selectedRep.name)
    const personalizedBody = emailBody
      .replace("[Your Name]", userName || "[Your Name]")
      .replace("[Zip Code]", zipCode)
    
    return {
      subject: EMAIL_SUBJECT,
      body: personalizedBody
    }
  }

  const openRepWebsite = () => {
    if (selectedRep?.website) {
      window.open(selectedRep.website, "_blank")
    }
  }

  const openGmail = () => {
    const { subject, body } = getPersonalizedEmail()
    // Gmail compose URL without "to" - user will need to get email from rep's website
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(gmailUrl, "_blank")
    onEmailSent()
    handleOpenChange(false)
  }

  const copyEmailContent = async () => {
    const { subject, body } = getPersonalizedEmail()
    const fullContent = `Subject: ${subject}\n\n${body}`
    
    try {
      await navigator.clipboard.writeText(fullContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = fullContent
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "zip" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" />
                Find Your Representative
              </DialogTitle>
              <DialogDescription>
                Enter your zip code to find your local representatives and send them a pre-written message about climate action.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col gap-4 py-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter 5-digit zip code"
                  value={zipCode}
                  onChange={(e) => {
                    setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))
                    setError("")
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      lookupRepresentatives()
                    }
                  }}
                  maxLength={5}
                  className="flex-1"
                />
                <Button 
                  onClick={lookupRepresentatives} 
                  disabled={loading || zipCode.length !== 5}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Find"}
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
            
            <div className="flex flex-col gap-2 py-4 max-h-64 overflow-y-auto">
              {representatives.map((rep, index) => (
                <button
                  key={index}
                  onClick={() => selectRepresentative(rep)}
                  className="flex flex-col items-start gap-1 p-3 rounded-lg border border-border bg-card hover:bg-accent/10 hover:border-secondary/50 transition-colors text-left"
                >
                  <span className="font-medium text-foreground">{rep.name}</span>
                  <span className="text-sm text-muted-foreground">{rep.office}</span>
                  {rep.phone && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {rep.phone}
                    </span>
                  )}
                  {rep.website && (
                    <span className="flex items-center gap-1 text-xs text-secondary">
                      <ExternalLink className="w-3 h-3" />
                      Official Website
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("zip")}>
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
                Contact {selectedRep.name} via their official website or use the pre-written message below.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col gap-4 py-4">
              {/* Contact Info */}
              <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-3">
                <p className="text-sm font-medium text-foreground mb-2">{selectedRep.name}</p>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <span>{selectedRep.office}</span>
                  {selectedRep.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedRep.phone}
                    </span>
                  )}
                </div>
                {selectedRep.website && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={openRepWebsite}
                    className="mt-2 w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Official Website
                  </Button>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="userName" className="text-sm font-medium text-foreground">
                  Your Name (optional)
                </label>
                <Input
                  id="userName"
                  placeholder="Enter your name to personalize"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              
              <div className="rounded-lg border border-border bg-muted/30 p-3 max-h-40 overflow-y-auto">
                <p className="text-xs font-medium text-muted-foreground mb-2">Message Preview:</p>
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                  {getEmailBody(selectedRep.name)
                    .replace("[Your Name]", userName || "[Your Name]")
                    .replace("[Zip Code]", zipCode)}
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                Copy the message and paste it into the contact form on your representative&apos;s website, or open it in Gmail.
              </p>
            </div>
            
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <div className="flex gap-2 w-full">
                <Button 
                  onClick={copyEmailContent}
                  className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
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
                  onClick={openGmail}
                  variant="outline"
                  className="flex-1"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Open Gmail
                </Button>
              </div>
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
  )
}
