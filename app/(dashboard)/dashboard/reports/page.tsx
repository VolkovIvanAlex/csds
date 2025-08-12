"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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
  Send,
  AlertCircle,
  Calendar as CalendarIcon, X
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar" // Use the styled Calendar component
import Link from "next/link"
import { useReport } from "@/hooks/report.hooks"
import { useAuth } from "@/hooks/auth.hooks"
import { useAtom } from "jotai"
import { selectedReportAtom, reportsLoadingAtom, reportsErrorAtom } from "@/lib/jotai/report-actions"
import { useToast } from "@/components/ui/use-toast"
import { AuthGuard } from "@/components/auth-guard"
import { useOrganization } from "@/hooks/organization.hooks"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isStixDialogOpen, setIsStixDialogOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false)

  const { authState } = useAuth()
  const {allOrganizations, fetchAllOrganizations} = useOrganization()

  const {userOrganizationReports, fetchUserOrganizationReports, setSelectedReport, 
    removeReport, submitReport, shareReport, revokeReport, broadcastReport, removeFromNetwork, 
    proposeResponseAction, getResponseActions} = useReport()
  const [selectedReport] = useAtom(selectedReportAtom)
  const [reportsLoading] = useAtom(reportsLoadingAtom)
  const [reportsError] = useAtom(reportsErrorAtom)

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [reportOrgId, setReportOrgId] = useState<string | null>(null);

  // Add state for the new dialog and its textarea
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseActionText, setResponseActionText] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Add state for the new "View Actions" dialog
  const [isViewActionsDialogOpen, setIsViewActionsDialogOpen] = useState(false);
  const [responseActions, setResponseActions] = useState([]);
  const [isLoadingActions, setIsLoadingActions] = useState(false);
  const [formError, setFormError] = useState<string | null>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  const availableOrganizations = allOrganizations.filter(
    (org) =>
      org.id !== reportOrgId &&
      !selectedReport?.sharedWith
        .map((share) => share.targetOrgId)
        .includes(org.id)
  )

  const sharedOrganizations = allOrganizations.filter(
    (org) =>
      org.id !== reportOrgId &&
      selectedReport?.sharedWith
        .map((share) => share.targetOrgId)
        .includes(org.id)
  )
  
  const { toast } = useToast()

  // Data Fetching
  useEffect(() => {
    if (authState.user?.id) {
      fetchUserOrganizationReports()
      fetchAllOrganizations()
    }
  }, [authState.user?.id, fetchUserOrganizationReports, fetchAllOrganizations])

  const hasSubmittedReports = useMemo(() => {
    return userOrganizationReports.some(report => report.submitted);
  }, [userOrganizationReports]);

  // Filter reports based on search query and filters
  const filteredReports = useMemo(() => {
    return userOrganizationReports.filter((report) => {
      const reportDate = report.submittedAt ? new Date(report.submittedAt) : null

      const matchesSearch =
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.typeOfThreat.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || report.status.toLowerCase() === statusFilter.toLowerCase()
      const matchesSeverity = severityFilter === "all" || report.severity.toLowerCase() === severityFilter.toLowerCase()
      
      const matchesDate = !dateRange || !reportDate || (
        (!dateRange.from || reportDate >= dateRange.from) &&
        (!dateRange.to || reportDate <= new Date(dateRange.to.setHours(23, 59, 59, 999)))
      )

      return matchesSearch && matchesStatus && matchesSeverity && matchesDate
    })
  }, [userOrganizationReports, searchQuery, statusFilter, severityFilter, dateRange])

  // Group reports by organization
  const reportsByOrganization = filteredReports.reduce((acc, report) => {
    const orgId = report.organization.id
    if (!acc[orgId]) {
      acc[orgId] = {
        name: report.organization.name,
        reports: [],
      }
    }
    acc[orgId].reports.push(report)
    return acc
  }, {})

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSeverityFilter("all");
    setDateRange(undefined);
  };

  const openReportDetails = (report) => {
    console.log(report);
    setSelectedReport(report)
    setIsDialogOpen(true)
  }

  const openStixDialog = (report) => {
    setSelectedReport(report)
    setIsStixDialogOpen(true)
  }

  const openResponseActionDialog = (report: Report) => {
    setSelectedReport(report);
    setResponseActionText(""); // Clear previous text
    setIsResponseDialogOpen(true);
  };

  const handleViewActionsClick = async (report: Report) => {
    setSelectedReport(report);
    setIsLoadingActions(true);
    setIsViewActionsDialogOpen(true);

    await getResponseActions({
      reportId: report.id,
      options: {
        onSuccess: (data) => {
          setResponseActions(data);
          setIsLoadingActions(false);
        },
        onError: (error) => {
          toast({ title: "Error", description: error, variant: "destructive" });
          setIsLoadingActions(false);
          setIsViewActionsDialogOpen(false);
        },
      },
    });
  };

  const handleProposeActionSubmit = () => {
    setFormError(null);
    if (!selectedReport || responseActionText.trim().length < 10) {
      setFormError("Response action must be at least 10 characters.");
      toast({
        title: "Validation Error",
        description: "Response action must be at least 10 characters.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmittingAction(true);
    proposeResponseAction({
      reportId: selectedReport.id,
      description: responseActionText,
      options: {
        onSuccess: () => {
          toast({ title: "Success", description: "Your response action has been submitted." });
          setIsResponseDialogOpen(false);
          setIsSubmittingAction(false);
          setFormError(null);
        },
        onError: (error) => {
          toast({ title: "Error", description: error, variant: "destructive" });
          setFormError(error)
          setIsSubmittingAction(false);
        },
      },
    });
  };

  const handleSubmitReport = (reportId: string) => {
    submitReport({
      reportId,
      options: {
        onSuccess: async (updatedReport) => {
        },
        onError: async (error) => {
          toast({
            title: 'Error',
            description: error,
          });
        },
      },
    });
  };

  const handleShareClick = async (report: Report) => {
    setSelectedReport(report);
    setSelectedReportId(report.id);
    setReportOrgId(report.organization.id);
    if (allOrganizations.length === 0) {
      await fetchAllOrganizations();
    }
    setIsShareModalOpen(true);
  };

  const handleShareConfirm = async (reportId: string, sourceOrgId: string, targetOrgId: string) => {
    setShareLoading(true)
    shareReport({
      reportId: reportId,
      sourceOrgId: sourceOrgId,
      targetOrgId: targetOrgId,
      options: {
        onSuccess: async () => {
          setIsDialogOpen(false)
          toast({
            title: "Success",
            description: "Report shared successfully",
          })
          await fetchUserOrganizationReports()           
          setIsShareModalOpen(false)
          setSelectedOrgId(null)
          setSelectedReportId(null)
          setReportOrgId(null)
          setShareLoading(false)
        },
        onError: (error) => {
          console.error("Error sharing Report:", error)
          toast({
            title: "Error",
            description: error,
          })
          setShareLoading(false)
        }
      }
    })
  };

  const handleRevokeShare = async (reportId: string, sourceOrgId: string, targetOrgId: string) => {
    setShareLoading(true)
    await revokeReport({
      reportId,
      sourceOrgId,
      targetOrgId,
      options: {
        onSuccess: async () => {
          setIsDialogOpen(false)
          toast({
            title: "Success",
            description: "Report shared successfully",
          })
          await fetchUserOrganizationReports()           
          setIsShareModalOpen(false)
          setSelectedOrgId(null)
          setSelectedReportId(null)
          setReportOrgId(null)
          setShareLoading(false)
        },
        onError: (error: string) => {
          console.error("Error revoking share:", error)
          toast({
            title: "Error",
            description: error,
          })
          setShareLoading(false)
        },
      },
    })
  }

  const handleBroadcast = (reportId: string) => {
    broadcastReport({
      reportId,
      options: {
        onSuccess: (data) => {
          toast({ title: "Broadcast successful", description: data.message });
          fetchUserOrganizationReports(); // Re-fetch reports to update UI state
          setIsDialogOpen(false);
        },
        onError: (error) => toast({ title: "Broadcast Failed", description: error, variant: "destructive" }),
      },
    });
  };

  const handleRemoveFromNetwork = (reportId: string) => {
    removeFromNetwork({
      reportId,
      options: {
        onSuccess: (data) => {
          toast({ title: "Remove from network successful", description: data.message });
          fetchUserOrganizationReports(); // Re-fetch reports to update UI state
          setIsDialogOpen(false); // Close the dialog
        },
        onError: (error) => toast({ title: "Remove from network Failed", description: error, variant: "destructive" }),
      },
    });
  };

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

  const handleEditReport = (rep) => {
    setSelectedReport(rep) // Store the report in the atom
  }

  const handleDeleteReport = (repId, orgId) => {
    removeReport({
      organizationId: orgId,
      reportId: repId,
      options: {
        onSuccess: () => {
          console.log(`Report ${repId} deleted successfully`)
          setIsDialogOpen(false)
          setSelectedReport(null)
          toast({
            title: "Success",
            description: "Report deleted successfully",
          })
        },
        onError: (error) => {
          console.error("Error deleting Report:", error)
          toast({
            title: "Error",
            description: error,
          })
        }
      }
    })
  }

  // Check if user can modify the report (belongs to report's organization)
  const canModifyReport = (report: Report) => {
    const userOrgIds = authState.user?.organizations?.map(org => org.id) || []
    return userOrgIds.includes(report.organization.id)
  }

  console.log(reportsByOrganization);

  return (
    <AuthGuard>
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

                {hasSubmittedReports && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full sm:w-[250px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Filter by date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                )}

                {(searchQuery || statusFilter !== 'all' || severityFilter !== 'all' || dateRange) && (
                  <Button variant="ghost" size="icon" onClick={handleResetFilters}>
                    <X className="h-4 w-4" />
                  </Button>
                )}

                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            
              {Object.keys(reportsByOrganization).length === 0 ? (
                <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                  <p className="text-muted-foreground">No reports found.</p>
                </div>
              ) : (
                Object.entries(reportsByOrganization).map(([orgId, { name, reports }]) => (
                <div key={orgId} className="mb-6">
                  <CardHeader>
                    <CardTitle>{name}</CardTitle>
                  </CardHeader>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report) => (
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
                                {canModifyReport(report) && (
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/reports/${report.id}/edit`} onClick={() => handleEditReport(report)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Report
                                  </Link>
                                </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => openStixDialog(report)}>
                                  <Code className="mr-2 h-4 w-4" />
                                  View STIX Data
                                </DropdownMenuItem>
                                {canModifyReport(report) && report.submitted && (
                                <DropdownMenuItem onClick={() => handleShareClick(report)}>
                                  <Share2 className="mr-2 h-4 w-4" />
                                  Share Report
                                </DropdownMenuItem>
                                )}
                                {canModifyReport(report) && <DropdownMenuSeparator />}
                                {canModifyReport(report) && !report.submitted && (
                                <DropdownMenuItem className="text-destructive" 
                                onClick={() => {
                                  handleDeleteReport(report.id, report.organization.id)
                                }}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Report
                                </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <CardTitle className="text-lg mt-2 line-clamp-2">{report.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Badge variant="outline">{report.typeOfThreat}</Badge>
                            <span>•</span>
                            <Badge
                              variant={
                                report.status === "Draft"
                                  ? "secondary"
                                  : report.status === "Under Investigation"
                                    ? "default"
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
                    ))}
                  </div>
                </div>
              ))
              )}
            
          </CardContent>
        </Card>

        {/* Report Details Dialog */}
        {selectedReport && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[700px]">
            {reportsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Spinner className="h-8 w-8" />
                  <span className="ml-2 text-sm text-muted-foreground">Submitting report...</span>
                </div>
              ) : (
                <>
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
                    {selectedReport.blockchainHash && (
                      <Link
                        href={`https://solscan.io/token/${selectedReport.blockchainHash}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View in Solscan
                      </Link>
                    )}
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

                    {!canModifyReport(selectedReport) && selectedReport.submitted && (
                      <Button variant="secondary" onClick={() => openResponseActionDialog(selectedReport)}>
                        Suggest Response Actions
                      </Button>
                    )}

                    {authState.user?.role === "GovBody" && selectedReport.submitted && (
                      <>
                        {selectedReport.broadcasted ? (
                          <Button variant="destructive" onClick={() => handleRemoveFromNetwork(selectedReport.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove from Network
                          </Button>
                        ) : (
                          <Button onClick={() => handleBroadcast(selectedReport.id)}>
                            <Send className="mr-2 h-4 w-4" />
                            Broadcast to Network
                          </Button>
                        )}
                      </>
                    )}

                    <div className="flex gap-2">
                      {canModifyReport(selectedReport) && (
                        <>
                          {selectedReport.submitted && (
                            <Button variant="secondary" onClick={() => handleViewActionsClick(selectedReport)}>
                              View Response Actions
                            </Button>
                          )}
                          <Button variant="outline" asChild>
                            <Link href={`/dashboard/reports/${selectedReport.id}/edit`} onClick={() => handleEditReport(selectedReport)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </Button>
                          {selectedReport.submitted && (
                          <Button variant="outline" onClick={() => handleShareClick(selectedReport)}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </Button>
                          )}
                          {!selectedReport.submitted && ( // Only show if not already submitted
                            <Button disabled={reportsLoading} onClick={() => handleSubmitReport(selectedReport.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              {reportsLoading ? 'Submitting...' : 'Submit'}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
              </>
              )}
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
                <pre className="text-xs font-mono whitespace-pre-wrap">{JSON.stringify(selectedReport.stix, null, 2)}</pre>
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

         {/* Response Action Dialog */}
        {selectedReport && (
          <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Suggest Response Actions for "{selectedReport.title}"</DialogTitle>
                <DialogDescription>
                  As a Data Consumer, you can propose actions to help mitigate this threat. Your suggestion will be recorded.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <Label htmlFor="response-action" className="sr-only">Response Action</Label>
                <Textarea
                  id="response-action"
                  placeholder="e.g., 'Recommend isolating the affected subnet and blocking the identified malicious IP addresses...'"
                  className="min-h-48 resize-y"
                  value={responseActionText}
                  onChange={(e) => {
                    setResponseActionText(e.target.value)
                    setFormError(null)
                  }}
                />
              </div>

              <div ref={errorRef}>
                {formError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Submission Failed</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)} disabled={isSubmittingAction}>
                    Cancel
                  </Button>
                  <Button onClick={handleProposeActionSubmit} disabled={isSubmittingAction}>
                    {isSubmittingAction ? "Submitting..." : "Submit Action"}
                  </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* View Response Actions Dialog */}
        {selectedReport && (
          <Dialog open={isViewActionsDialogOpen} onOpenChange={setIsViewActionsDialogOpen}>
            <DialogContent className="sm:max-w-[900px]">
              <DialogHeader>
                <DialogTitle>Proposed Response Actions for "{selectedReport.title}"</DialogTitle>
                <DialogDescription>
                  Actions suggested by Data Consumers to mitigate this threat.
                </DialogDescription>
              </DialogHeader>

              <div className="max-h-[50vh] overflow-y-auto pr-4 space-y-4 py-4">
                {isLoadingActions ? (
                  <div className="flex items-center justify-center h-24">
                    <Spinner />
                  </div>
                ) : responseActions?.length > 0 ? (
                  responseActions.slice(0, 3).map((action) => (
                    <div key={action.id} className="p-4 border rounded-lg bg-muted/50">
                      <p className="text-sm">{action.description}</p>
                      <p className="text-xs text-muted-foreground mt-2 text-right">
                        — Suggested by {action.proposedBy.name} on {formatDate(action.createdAt)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                    No response actions have been proposed yet.
                  </div>
                )}
              </div>

              
              <div className="flex justify-center pt-2 border-t">
                <Button variant="link" asChild>
                  <Link href={`/dashboard/reports/${selectedReport.id}/actions`}>
                    See all {responseActions.length} response actions
                  </Link>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
          <DialogContent>
          {shareLoading ? (
              <div className="flex items-center justify-center h-64">
                <Spinner className="h-8 w-8" />
                <span className="ml-2 text-sm text-muted-foreground">Processing share...</span>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Share Report</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <Label htmlFor="org">Select Organization</Label>
                  <Select onValueChange={setSelectedOrgId}>
                    <SelectTrigger id="org">
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableOrganizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {sharedOrganizations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Not shared with any organizations.</p>
                  ) : (
                    <div className="space-y-2">
                      {sharedOrganizations.map((org) => {
                        const share = selectedReport?.sharedWith?.find(
                          (share) => share.targetOrgId === org.id
                        )
                        return (
                          <div key={org.id} className="flex justify-between items-center">
                            <span className="text-sm">{org.name}</span>
                            {share?.blockchainHash && (
                              <Link
                                href={`https://solscan.io/token/${share.blockchainHash}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                View share in Solscan
                              </Link>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleRevokeShare(
                                  selectedReportId!,
                                  reportOrgId!,
                                  org.id
                                )
                              }
                            >
                              Revoke
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <Button
                    disabled={!selectedOrgId || shareLoading}
                    onClick={() => handleShareConfirm(selectedReportId!, reportOrgId!, selectedOrgId!)}
                  >
                    Share
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  )
}
