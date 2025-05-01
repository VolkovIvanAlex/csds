"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Download, Edit, FileText, Share2, Shield, Trash2, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShareReportDialog } from "@/components/share-report-dialog"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "@/lib/utils"

// Sample report data - in a real app, this would be fetched from an API based on the ID
const reports = {
  "REP-001": {
    id: "REP-001",
    title: "Phishing Campaign Targeting Finance Department",
    type: "Phishing",
    status: "Validated",
    severity: "High",
    date: "2023-06-15T10:30:00",
    description:
      "A sophisticated phishing campaign targeted the finance department with emails appearing to come from the CFO. The emails contained malicious attachments designed to steal credentials and financial information. Several employees received these emails, and two clicked on the attachments before the security team was alerted.",
    affectedSystems: "Email system, Finance department workstations",
    indicators:
      "From: cfo-name@company-spoofed.com\nSubject: Urgent: Financial Review Required\nAttachment: Q2_Financial_Review.xlsx (SHA256: a1b2c3d4e5f6...)\nC2 Server: 192.168.1.100",
    mitigationSteps:
      "1. Blocked sender domain at email gateway\n2. Isolated affected workstations\n3. Reset credentials for potentially compromised accounts\n4. Conducted additional phishing awareness training\n5. Implemented additional email filtering rules",
    reporter: "John Doe",
    reporterEmail: "john.doe@example.com",
    hash: "8f7d56a1c3b2e9d4",
    stixData: {
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
    },
  },
  "REP-002": {
    id: "REP-002",
    title: "Suspicious Login Attempts from Unknown IP",
    type: "Unauthorized Access",
    status: "Pending",
    severity: "Medium",
    date: "2023-06-14T14:45:00",
    description:
      "Multiple failed login attempts were detected from an unknown IP address targeting several user accounts. The attempts appeared to be using a brute force technique with common password combinations.",
    affectedSystems: "Authentication system, User accounts",
    indicators:
      "Source IP: 203.0.113.42\nTimestamp: 2023-06-14 14:30-14:45 UTC\nTarget accounts: 15 different user accounts",
    mitigationSteps:
      "1. Blocked the source IP address\n2. Enabled account lockout after 5 failed attempts\n3. Notified affected users to change passwords\n4. Implemented additional login monitoring",
    reporter: "Jane Smith",
    reporterEmail: "jane.smith@example.com",
    hash: "2e9d4c6b8a3f1e7",
    stixData: {
      type: "indicator",
      spec_version: "2.1",
      id: "indicator--9f2e3d2b-18d4-5cbf-938f-98ee46b3cd4g",
      created: "2023-06-14T14:45:00.000Z",
      modified: "2023-06-14T14:45:00.000Z",
      name: "Brute Force Indicator",
      description: "Multiple failed login attempts from single IP",
      indicator_types: ["malicious-activity"],
      pattern: "[ipv4-addr:value = '203.0.113.42']",
      pattern_type: "stix",
      valid_from: "2023-06-14T00:00:00Z",
    },
  },
}

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Get the report based on the ID parameter
  const report = reports[params.id] || null

  // If report not found, show error
  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h1 className="text-2xl font-bold">Report Not Found</h1>
        <p className="text-muted-foreground">The report you're looking for doesn't exist or has been deleted.</p>
        <Button asChild>
          <Link href="/dashboard/reports">Back to Reports</Link>
        </Button>
      </div>
    )
  }

  const handleDelete = () => {
    setIsDeleting(true)

    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false)
      toast({
        title: "Report deleted",
        description: "The incident report has been deleted successfully.",
      })
      router.push("/dashboard/reports")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/reports">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{report.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Report {report.id}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(report.date))}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShareDialogOpen(true)}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/reports/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <CardDescription>Comprehensive information about this security incident</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="indicators">Indicators</TabsTrigger>
                  <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
                  <TabsTrigger value="stix">STIX Data</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Description</h3>
                    <p className="mt-2 whitespace-pre-line">{report.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Affected Systems</h3>
                    <p className="mt-2">{report.affectedSystems}</p>
                  </div>
                </TabsContent>

                <TabsContent value="indicators" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Indicators of Compromise</h3>
                    <pre className="mt-2 whitespace-pre-line rounded-md bg-muted p-4 text-sm font-mono">
                      {report.indicators}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="mitigation" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Mitigation Steps</h3>
                    <pre className="mt-2 whitespace-pre-line rounded-md bg-muted p-4">{report.mitigationSteps}</pre>
                  </div>
                </TabsContent>

                <TabsContent value="stix" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">STIX 2.1 Data</h3>
                    <div className="flex justify-end mb-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download STIX
                      </Button>
                    </div>
                    <pre className="mt-2 overflow-auto rounded-md bg-muted p-4 text-sm font-mono">
                      {JSON.stringify(report.stixData, null, 2)}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blockchain Verification</CardTitle>
              <CardDescription>Immutable record of this incident report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-medium">Report Hash</div>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-sm">{report.hash}</code>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-medium">Timestamp</div>
                  <div>{new Date(report.date).toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-medium">Blockchain Status</div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                    >
                      Verified
                    </Badge>
                    <span className="text-sm text-muted-foreground">Recorded on Solana blockchain</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Type</p>
                  <p className="text-sm text-muted-foreground">{report.type}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-4">
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
                  className="h-5 w-5 rounded-full p-0"
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Severity</p>
                  <p className="text-sm text-muted-foreground">{report.severity}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-4">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Status</p>
                  <p className="text-sm text-muted-foreground">{report.status}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Reported</p>
                  <p className="text-sm text-muted-foreground">{new Date(report.date).toLocaleDateString()}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Reporter</p>
                  <p className="text-sm text-muted-foreground">{report.reporter}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="absolute left-4 top-8 bottom-0 w-px bg-muted" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Report created</p>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(report.date))}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div className="absolute left-4 top-8 bottom-0 w-px bg-muted" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Status updated to {report.status}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(new Date(report.date).getTime() + 3600000))}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Share2 className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Shared with Jane Smith</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(new Date(report.date).getTime() + 7200000))}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ShareReportDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} report={report} />
    </div>
  )
}
