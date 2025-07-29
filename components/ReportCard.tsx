"use client"

import Link from "next/link"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Code,
  Share2,
  Trash2,
  Building2,
  AlertTriangle,
} from "lucide-react"
import { Report } from "@/lib/jotai/atoms/report"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// A simple utility to format dates
const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return "Not submitted"
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

// Define the props the component will accept
interface ReportCardProps {
  report: Report
  onOpenDialog: (report: Report, dialog: "details" | "stix" | "share") => void
  onDelete: (reportId: string) => void
  canModify: boolean
}

export const ReportCard = ({ report, onOpenDialog, onDelete, canModify }: ReportCardProps) => {
  return (
    <Card key={report.id} className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge
            variant={
              report.severity === "Critical"
                ? "destructive"
                : report.severity === "High"
                ? "default"
                : "secondary"
            }
          >
            {report.severity}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOpenDialog(report, "details")}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpenDialog(report, "stix")}>
                <Code className="mr-2 h-4 w-4" />
                View STIX Data
              </DropdownMenuItem>
              
              {canModify && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/reports/${report.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Report
                    </Link>
                  </DropdownMenuItem>

                  {report.submitted && (
                    <DropdownMenuItem onClick={() => onOpenDialog(report, "share")}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Report
                    </DropdownMenuItem>
                  )}
                  
                  {!report.submitted && (
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(report.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Report
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-lg mt-2 line-clamp-2">{report.title}</CardTitle>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <Badge variant="outline">{report.typeOfThreat}</Badge>
          <span>•</span>
          <Badge variant={report.submitted ? "default" : "secondary"}>
            {report.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{report.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={report.author.photo || undefined} alt={report.author.name} />
              <AvatarFallback>{report.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{report.author.name}</span>
          </div>
          <span className="text-xs text-muted-foreground">{formatDate(report.submittedAt)}</span>
        </div>
      </CardContent>

      <div className="border-t p-3 bg-muted/50 flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span>{report.organization.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          <span>Risk: {report.riskScore?.toFixed(1) ?? "N/A"}</span>
        </div>
      </div>
    </Card>
  )
}