"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EmailGateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  routeId: string
  routeTitle: string
  onSuccess: () => void
}

export function EmailGateModal({
  open,
  onOpenChange,
  routeId,
  routeTitle,
  onSuccess,
}: EmailGateModalProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/email/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, routeId }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        onSuccess()
        onOpenChange(false)
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Get {routeTitle} for Free</DialogTitle>
          <DialogDescription>
            Enter your email address to receive the download link
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <p className="text-xs text-muted-foreground">
            We'll send you the download link and occasionally share new routes.
            Unsubscribe anytime.
          </p>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Get Download Link"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
