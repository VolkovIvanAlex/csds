"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  MoreHorizontal,
  FileText,
  Building2,
  Share2,
  Download,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  Code,
} from "lucide-react"
import Link from "next/link"

// Mock data for reports
const mockReports = [
  {
    id: "1",
    title: "Phishing Campaign Targeting Finance Department",
    description:
      "A sophisticated phishing campaign targeted the finance department with emails appearing to come from the CFO.",
    typeOfThreat: "Phishing",
    severity: "High",
    status: "Active",
    submittedAt: "2023-06-15T10:30:00",
    riskScore: 78.5,
    author: {
      id: "1",
      name: "Alex Johnson",
      photo: "/abstract-geometric-shapes.png",
    },
    organization: {
      id: "1",
      name: "Acme Corp",
    },
    attachments: ["phishing-email.png", "analysis.pdf"],
  },
  {
    id: "2",
    title: "Ransomware Threat Intelligence",
    description: "Analysis of recent ransomware attacks targeting the healthcare sector.",
    typeOfThreat: "Ransomware",
    severity: "Critical",
    status: "Active",
    submittedAt: "2023-06-10T14:45:00",
    riskScore: 92.3,
    author: {
      id: "2",
      name: "Sarah Miller",
      photo: "/number-two-graphic.png",
    },
    organization: {
      id: "2",
      name: "TechGlobal",
    },
    attachments: ["ransomware-analysis.pdf", "ioc-list.txt"],
  },
  {
    id: "3",
    title: "Network Vulnerability Assessment",
    description: "Comprehensive assessment of network vulnerabilities and potential security gaps.",
    typeOfThreat: "Vulnerability",
    severity: "Medium",
    status: "Resolved",
    submittedAt: "2023-06-05T09:15:00",
    riskScore: 65.8,
    author: {
      id: "3",
      name: "James Wilson",
      photo: "/abstract-geometric-shapes.png",
    },
    organization: {
      id: "3",
      name: "DataDefense",
    },
    attachments: ["vulnerability-scan.pdf", "remediation-plan.docx"],
  },
  {
    id: "4",
    title: "DDoS Attack Analysis",
    description: "Analysis of recent distributed denial of service attack targeting our web infrastructure.",
    typeOfThreat: "DDoS",
    severity: "High",
    status: "Investigating",
    submittedAt: "2023-06-01T16:20:00",
    riskScore: 82.1,
    author: {
      id: "4",
      name: "Emily Davis",
      photo: "/abstract-geometric-shapes.png",
    },
    organization: {
      id: "1",
      name: "Acme Corp",
    },
    attachments: ["traffic-analysis.png", "mitigation-strategy.pdf"],
  },
  {
    id: "5",
    title: "Insider Threat Detection",
    description: "Investigation into potential data exfiltration by an employee.",
    typeOfThreat: "Insider",
    severity: "Medium",
    status: "Active",
    submittedAt: "2023-05-28T11:05:00",
    riskScore: 71.4,
    author: {
      id: "5",
      name: "Michael Brown",
      photo: "/abstract-geometric-composition-5.png",
    },
    organization: {
      id: "2",
      name: "TechGlobal",
    },
    attachments: ["activity-logs.xlsx", "timeline.pdf"],
  },
]

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isStixDialogOpen, setIsStixDialogOpen] = useState(false)

  // Filter reports based on search query and filters
  const filteredReports = mockReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.typeOfThreat.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || report.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesSeverity = severityFilter === "all" || report.severity.toLowerCase() === severityFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesSeverity
  })

  const openReportDetails = (report) => {
    setSelectedReport(report)
    setIsDialogOpen(true)
  }

  const openStixDialog = (report) => {
    setSelectedReport(report)
    setIsStixDialogOpen(true)
  }

  // Mock STIX data
  const mockStixData = {
    type: "indicator",
    spec_version: "2.1",
    id: "indicator--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f",
    created: "2023-06-15T10:30:00.000Z",
    modified: "2023-06-15T10:30:00.000Z",
    name: "Phishing Campaign Indicator",
    description: "Email from spoofed domain with malicious attachment",
    indicator_types: ["malicious-activity"],
    pattern:
      "[email-message:sender_ref.value = 'cfo-name@company-spoofed.com' AND email-message:subject = 'Urgent: Financial Review Required']",
    pattern_type: "stix",
    valid_from: "2023-06-15T00:00:00Z",
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Threat Reports</h1>
          <p className="text-muted-foreground">View and manage all threat reports</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/reports/new">
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Reports</CardTitle>
          <CardDescription>Browse and filter all submitted threat reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3 flex h-24 items-center justify-center rounded-md border border-dashed">
                <p className="text-muted-foreground">No reports found.</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <Card key={report.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start">
                      <Badge
                        variant={
                          report.severity === "Critical"
                            ? "destructive"
                            : report.severity === "High"
                              ? "default"
                              : report.severity === "Medium"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {report.severity}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openReportDetails(report)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/reports/${report.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Report
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openStixDialog(report)}>
                            <Code className="mr-2 h-4 w-4" />
                            View STIX Data
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share Report
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-lg mt-2 line-clamp-2">{report.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Badge variant="outline">{report.typeOfThreat}</Badge>
                      <span>•</span>
                      <Badge
                        variant={
                          report.status === "Active"
                            ? "default"
                            : report.status === "Investigating"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {report.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{report.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={report.author.photo || "/placeholder.svg"} alt={report.author.name} />
                          <AvatarFallback>{report.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{report.author.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(report.submittedAt)}</span>
                    </div>
                  </CardContent>
                  <div className="border-t p-3 bg-muted/50 flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{report.organization.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">Risk: {report.riskScore.toFixed(1)}</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Details Dialog */}
      {selectedReport && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>{selectedReport.title}</DialogTitle>
                <Badge
                  variant={
                    selectedReport.severity === "Critical"
                      ? "destructive"
                      : selectedReport.severity === "High"
                        ? "default"
                        : selectedReport.severity === "Medium"
                          ? "secondary"
                          : "outline"
                  }
                >
                  {selectedReport.severity}
                </Badge>
              </div>
              <DialogDescription>
                Submitted by {selectedReport.author.name} on {formatDate(selectedReport.submittedAt)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="mt-1 text-sm">{selectedReport.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Threat Type</h3>
                  <p className="mt-1 text-sm">{selectedReport.typeOfThreat}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <p className="mt-1 text-sm">{selectedReport.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Risk Score</h3>
                  <p className="mt-1 text-sm">{selectedReport.riskScore.toFixed(1)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Organization</h3>
                  <p className="mt-1 text-sm">{selectedReport.organization.name}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Attachments</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedReport.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-1 rounded-md border px-2 py-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => openStixDialog(selectedReport)}>
                <Code className="mr-2 h-4 w-4" />
                View STIX Data
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/reports/edit/${selectedReport.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* STIX Data Dialog */}
      {selectedReport && (
        <Dialog open={isStixDialogOpen} onOpenChange={setIsStixDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>STIX Data</DialogTitle>
              <DialogDescription>
                Structured Threat Information Expression (STIX) data for {selectedReport.title}
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-md bg-muted p-4 overflow-auto max-h-[400px]">
              <pre className="text-xs font-mono whitespace-pre-wrap">{JSON.stringify(mockStixData, null, 2)}</pre>
            </div>

            <div className="flex justify-between">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download STIX
              </Button>
              <Button onClick={() => setIsStixDialogOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
