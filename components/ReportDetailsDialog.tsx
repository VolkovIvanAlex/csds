"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code, Edit, Share2, Send } from "lucide-react"
import { Report } from "@/lib/jotai/atoms/report"
import Link from "next/link"

interface ReportDetailsDialogProps {
  report: Report
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onBroadcast: (reportId: string) => void
  canModify: boolean
  userRole?: string
}

export const ReportDetailsDialog = ({
  report,
  isOpen,
  onOpenChange,
  onBroadcast,
  canModify,
  userRole,
}: ReportDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{report.title}</DialogTitle>
          <DialogDescription>
            Details for report submitted by {report.author.name}.
          </DialogDescription>
        </DialogHeader>
        
        {/* ... Dialog content for description, details, etc. ... */}

        <div className="flex justify-end gap-2 mt-4">
          {canModify && (
            <Button variant="outline" asChild>
              <Link href={`/dashboard/reports/${report.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          )}

          {/* ADDED: Broadcast to Network Button */}
          {userRole === "GovBody" && report.submitted && (
            <Button onClick={() => onBroadcast(report.id)}>
              <Send className="mr-2 h-4 w-4" />
              Broadcast to Network
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}