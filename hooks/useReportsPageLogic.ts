"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useReport } from "@/hooks/report.hooks"
import { useOrganization } from "@/hooks/organization.hooks"
import { useAuth } from "@/hooks/auth.hooks"
import { Report } from "@/lib/jotai/atoms/report"

export const useReportsPageLogic = () => {
  // State Management
  const [filters, setFilters] = useState({ searchQuery: "", status: "all", severity: "all" })
  const [dialogs, setDialogs] = useState({ details: false, stix: false, share: false })
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [shareLoading, setShareLoading] = useState(false)

  // Hooks
  const { toast } = useToast()
  const { authState } = useAuth()
  const { allOrganizations, fetchAllOrganizations } = useOrganization()
  const {
    userOrganizationReports,
    fetchUserOrganizationReports,
    removeReport,
    submitReport,
    shareReport,
    revokeReport,
    broadcastReport, // Assume you add this to your hook
    reportsLoading,
  } = useReport()

  // Data Fetching Effects
  useEffect(() => {
    if (authState.user?.id) {
      fetchUserOrganizationReports()
      fetchAllOrganizations()
    }
  }, [authState.user?.id, fetchUserOrganizationReports, fetchAllOrganizations])

  // Memoized Filtering and Grouping for Performance
  const reportsByOrganization = useMemo(() => {
    const filtered = userOrganizationReports.filter((report) => {
      const F = filters
      return (
        (report.title.toLowerCase().includes(F.searchQuery.toLowerCase()) ||
          report.description.toLowerCase().includes(F.searchQuery.toLowerCase())) &&
        (F.status === "all" || report.status.toLowerCase() === F.status.toLowerCase()) &&
        (F.severity === "all" || report.severity.toLowerCase() === F.severity.toLowerCase())
      )
    })

    return filtered.reduce((acc, report) => {
      const orgId = report.organization.id
      if (!acc[orgId]) acc[orgId] = { name: report.organization.name, reports: [] }
      acc[orgId].reports.push(report)
      return acc
    }, {} as Record<string, { name: string; reports: Report[] }>)
  }, [userOrganizationReports, filters])

  // Permission Check
  const canModifyReport = useCallback(
    (report: Report) => {
      // Assuming user orgs are attached to the authState.user object
      const userOrgIds = authState.user?.organizations?.map((org) => org.id) || []
      return userOrgIds.includes(report.organization.id)
    },
    [authState.user]
  )
  
  // Event Handlers
  const handleOpenDialog = (report: Report, dialog: "details" | "stix" | "share") => {
    setSelectedReport(report)
    setDialogs((prev) => ({ ...prev, [dialog]: true }))
  }

  const handleDeleteReport = (reportId: string, organizationId: string) => {
    removeReport({
      organizationId,
      reportId,
      options: {
        onSuccess: () => toast({ title: "Success", description: "Report deleted successfully." }),
        onError: (error) => toast({ title: "Error", description: error, variant: "destructive" }),
      },
    })
  }
  
  const handleBroadcast = (reportId: string) => {
    broadcastReport({ // Call the new function from your useReport hook
      reportId,
      options: {
        onSuccess: (data) => {
          toast({ title: "Broadcast successful", description: data.message });
          setDialogs(prev => ({ ...prev, details: false }));
        },
        onError: (error) => toast({ title: "Broadcast Failed", description: error, variant: "destructive" }),
      },
    });
  };

  return {
    // State
    authState,
    filters,
    setFilters,
    dialogs,
    setDialogs,
    selectedReport,
    reportsLoading,
    reportsByOrganization,
    allOrganizations,
    shareLoading,
    // Methods
    handleOpenDialog,
    handleDeleteReport,
    handleBroadcast,
    canModifyReport,
    // You would create handlers for share/revoke etc. in a similar fashion
  }
}