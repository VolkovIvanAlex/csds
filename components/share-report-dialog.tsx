"use client"

import { useState } from "react"
import { Check, Copy, Share2 } from "lucide-react"

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
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ShareReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  report: {
    id: string
    title: string
  }
}

export function ShareReportDialog({ open, onOpenChange, report }: ShareReportDialogProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")
  const [sharedWith, setSharedWith] = useState([
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "/diverse-group-brainstorming.png",
      initials: "JS",
    },
  ])

  const shareLink = `https://cybershield.example.com/shared/${report.id}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (!email) return

    // In a real app, this would call an API to share the report
    setSharedWith([
      ...sharedWith,
      {
        name: email.split("@")[0],
        email,
        avatar: "/vibrant-street-market.png",
        initials: email.substring(0, 2).toUpperCase(),
      },
    ])

    setEmail("")

    toast({
      title: "Report shared",
      description: `Report has been shared with ${email}`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Report</DialogTitle>
          <DialogDescription>Share this incident report with team members or external partners</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="link">Report Link</Label>
            <div className="flex items-center space-x-2">
              <Input id="link" value={shareLink} readOnly className="flex-1" />
              <Button size="sm" variant="outline" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Share with</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="email"
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {sharedWith.length > 0 && (
            <div className="space-y-2">
              <Label>Shared with</Label>
              <div className="space-y-2">
                {sharedWith.map((user) => (
                  <div key={user.email} className="flex items-center justify-between rounded-md border p-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
