import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "@/lib/utils"

const reports = [
  {
    id: "REP-001",
    title: "Phishing Campaign Targeting Finance Department",
    status: "Validated",
    date: "2023-06-15T10:30:00",
    user: {
      name: "John Doe",
      avatar: "/vibrant-city-market.png",
      initials: "JD",
    },
  },
  {
    id: "REP-002",
    title: "Suspicious Login Attempts from Unknown IP",
    status: "Pending",
    date: "2023-06-14T14:45:00",
    user: {
      name: "Jane Smith",
      avatar: "/diverse-group-brainstorming.png",
      initials: "JS",
    },
  },
  {
    id: "REP-003",
    title: "Malware Detected on Marketing Workstation",
    status: "Validated",
    date: "2023-06-12T09:15:00",
    user: {
      name: "Robert Johnson",
      avatar: "/diverse-group-brainstorming.png",
      initials: "RJ",
    },
  },
  {
    id: "REP-004",
    title: "Data Exfiltration Attempt Blocked",
    status: "Investigating",
    date: "2023-06-10T16:20:00",
    user: {
      name: "Sarah Williams",
      avatar: "/diverse-group-celebrating.png",
      initials: "SW",
    },
  },
]

export function RecentReports() {
  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-start gap-4 p-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={report.user.avatar || "/placeholder.svg"} alt={report.user.name} />
                <AvatarFallback>{report.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{report.title}</h4>
                  <Badge
                    variant={
                      report.status === "Validated" ? "default" : report.status === "Pending" ? "outline" : "secondary"
                    }
                    className="ml-auto"
                  >
                    {report.status}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Report {report.id}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDistanceToNow(new Date(report.date))}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t bg-muted/50 p-2">
              <Button variant="ghost" size="sm" asChild>
                <a href={`/dashboard/reports/${report.id}`}>View</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={`/dashboard/reports/${report.id}/edit`}>Edit</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
