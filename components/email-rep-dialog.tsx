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
import { Loader2, Mail, MapPin, AlertCircle, CheckCircle2 } from "lucide-react"

interface Representative {
  name: string
  office: string
  party?: string
  emails?: string[]
  phones?: string[]
}

interface EmailRepDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEmailSent: () => void
}

const EMAIL_SUBJECT = "Support science-based climate action"

const EMAIL_BODY = `Dear Representative,

I'm writing as a constituent to urge your support for practical, science-based solutions to address climate change.

We are already seeing the effects of a changing climate through extreme weather, rising costs, and impacts on our communities. Addressing this issue is not just about the environment—it's about economic stability, public health, and long-term resilience.

I encourage you to support policies that invest in clean energy, strengthen climate resilience, and promote innovation in sustainable technologies.

Thank you for your time and service.

Sincerely,
[Your Name]`

export function EmailRepDialog({ open, onOpenChange, onEmailSent }: EmailRepDialogProps) {
  const [step, setStep] = useState<"zip" | "select" | "preview">("zip")
  const [zipCode, setZipCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [representatives, setRepresentatives] = useState<Representative[]>([])
  const [selectedRep, setSelectedRep] = useState<Representative | null>(null)
  const [userName, setUserName] = useState("")

  const resetDialog = () => {
    setStep("zip")
    setZipCode("")
    setLoading(false)
    setError("")
    setRepresentatives([])
    setSelectedRep(null)
    setUserName("")
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

  const sendEmail = () => {
    if (!selectedRep) return

    const recipientEmail = selectedRep.emails?.[0] || ""
    const personalizedBody = EMAIL_BODY.replace("[Your Name]", userName || "[Your Name]")
    
    const subject = encodeURIComponent(EMAIL_SUBJECT)
    const body = encodeURIComponent(personalizedBody + `\n[Zip Code: ${zipCode}]`)
    
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`
    
    onEmailSent()
    handleOpenChange(false)
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
                  {rep.emails && rep.emails.length > 0 && (
                    <span className="flex items-center gap-1 text-xs text-secondary">
                      <Mail className="w-3 h-3" />
                      {rep.emails[0]}
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
                Review your message to {selectedRep.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col gap-4 py-4">
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
              
              <div className="rounded-lg border border-border bg-muted/30 p-3 max-h-48 overflow-y-auto">
                <p className="text-xs font-medium text-muted-foreground mb-2">Message Preview:</p>
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                  {EMAIL_BODY.replace("[Your Name]", userName || "[Your Name]")}
                </p>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setStep("select")}>
                Back
              </Button>
              <Button 
                onClick={sendEmail}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Mail className="w-4 h-4 mr-2" />
                Open Email
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
