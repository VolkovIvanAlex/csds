"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, Eye, Share2 } from "lucide-react"

// Sample shared reports data
const sharedReports = [
  {
    id: "SHARE-001",
    title: "Phishing Campaign Analysis",
    sharedBy: "Jane Smith",
    sharedByEmail: "jane.smith@example.com",
    sharedOn: "2023-11-15T10:30:00",
    status: "Active",
    permission: "Read",
  },
  {
    id: "SHARE-002",
    title: "Ransomware Incident Report",
    sharedBy: "Robert Johnson",
    sharedByEmail: "robert.johnson@example.com",
    sharedOn: "2023-11-10T14:45:00",
    status: "Active",
    permission: "Edit",
  },
  {
    id: "SHARE-003",
    title: "Monthly Security Assessment",
    sharedBy: "Sarah Williams",
    sharedByEmail: "sarah.williams@example.com",
    sharedOn: "2023-11-05T09:15:00",
    status: "Expired",
    permission: "Read",
  },
  {
    id: "SHARE-004",
    title: "Network Vulnerability Scan Results",
    sharedBy: "Michael Brown",
    sharedByEmail: "michael.brown@example.com",
    sharedOn: "2023-10-28T16:20:00",
    status: "Active",
    permission: "Read",
  },
  {
    id: "SHARE-005",
    title: "Security Incident Response Plan",
    sharedBy: "Emily Davis",
    sharedByEmail: "emily.davis@example.com",
    sharedOn: "2023-10-20T11:05:00",
    status: "Active",
    permission: "Edit",
  },
]

export default function SharedReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredReports = sharedReports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.sharedBy.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shared Reports</h1>
          <p className="text-muted-foreground">View reports shared with you by other users</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Shared With You</CardTitle>
          <CardDescription>Reports and documents shared with you by other users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search shared reports..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Shared By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Permission</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No shared reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.title}</TableCell>
                      <TableCell>{report.sharedBy}</TableCell>
                      <TableCell>{formatDate(report.sharedOn)}</TableCell>
                      <TableCell>
                        <Badge variant={report.status === "Active" ? "default" : "secondary"}>{report.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={report.permission === "Edit" ? "outline" : "secondary"}>
                          {report.permission}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">Share</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
