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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  Search,
  Plus,
  MoreHorizontal,
  FileText,
  Building2,
  Filter,
  AlertTriangle,
  Info,
  CheckCircle2,
  Eye,
  Edit,
  Trash2,
  Mail,
  Clock,
  User,
  BellOff,
  Share2,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "@/lib/utils"

// Mock data for notifications
const mockNotifications = [
  {
    id: "1",
    title: "Critical Security Alert",
    description:
      "A critical vulnerability has been detected in your network infrastructure. Immediate action required.",
    status: "Unread",
    severity: "Critical",
    date: "2023-06-15T10:30:00",
    emails: ["security@acmecorp.com", "admin@acmecorp.com"],
    reports: [{ id: "1", title: "Phishing Campaign Targeting Finance Department" }],
    organizations: [{ id: "1", name: "Acme Corp" }],
    createdBy: "System",
    actions: [
      { type: "Email Sent", date: "2023-06-15T10:31:00", details: "Notification sent to security team" },
      { type: "SMS Alert", date: "2023-06-15T10:32:00", details: "SMS alert sent to on-call personnel" },
    ],
  },
  {
    id: "2",
    title: "New Shared Report",
    description: "TechGlobal has shared a new threat report with your organization.",
    status: "Read",
    severity: "Info",
    date: "2023-06-12T14:45:00",
    emails: ["security@acmecorp.com"],
    reports: [{ id: "2", title: "Ransomware Threat Intelligence" }],
    organizations: [
      { id: "1", name: "Acme Corp" },
      { id: "2", name: "TechGlobal" },
    ],
    createdBy: "john.smith@techglobal.com",
    actions: [
      { type: "Report Shared", date: "2023-06-12T14:45:00", details: "Report shared by TechGlobal" },
      { type: "Email Sent", date: "2023-06-12T14:46:00", details: "Notification sent to security team" },
    ],
  },
  {
    id: "3",
    title: "System Update Complete",
    description: "Security patches have been successfully applied to all systems.",
    status: "Read",
    severity: "Low",
    date: "2023-06-08T09:15:00",
    emails: ["admin@acmecorp.com", "it@acmecorp.com"],
    reports: [],
    organizations: [{ id: "1", name: "Acme Corp" }],
    createdBy: "System",
    actions: [
      { type: "System Update", date: "2023-06-08T09:00:00", details: "Security patches applied" },
      { type: "Email Sent", date: "2023-06-08T09:15:00", details: "Notification sent to IT team" },
    ],
  },
  {
    id: "4",
    title: "Suspicious Login Attempts",
    description: "Multiple failed login attempts detected from unknown IP addresses.",
    status: "Unread",
    severity: "High",
    date: "2023-06-05T16:20:00",
    emails: ["security@acmecorp.com", "admin@acmecorp.com"],
    reports: [{ id: "4", title: "DDoS Attack Analysis" }],
    organizations: [{ id: "1", name: "Acme Corp" }],
    createdBy: "System",
    actions: [
      { type: "Alert Triggered", date: "2023-06-05T16:20:00", details: "Login anomaly detected" },
      { type: "Email Sent", date: "2023-06-05T16:21:00", details: "Notification sent to security team" },
      { type: "IP Blocked", date: "2023-06-05T16:25:00", details: "Suspicious IP addresses blocked" },
    ],
  },
  {
    id: "5",
    title: "Weekly Security Summary",
    description: "Summary of security events and incidents from the past week.",
    status: "Read",
    severity: "Info",
    date: "2023-06-01T11:05:00",
    emails: ["security@acmecorp.com", "admin@acmecorp.com", "management@acmecorp.com"],
    reports: [],
    organizations: [
      { id: "1", name: "Acme Corp" },
      { id: "2", name: "TechGlobal" },
      { id: "3", name: "DataDefense" },
    ],
    createdBy: "System",
    actions: [
      { type: "Report Generated", date: "2023-06-01T11:00:00", details: "Weekly summary generated" },
      { type: "Email Sent", date: "2023-06-01T11:05:00", details: "Summary sent to all stakeholders" },
    ],
  },
]

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [notificationToDelete, setNotificationToDelete] = useState(null)

  // Filter notifications based on search query and filters
  const filteredNotifications = mockNotifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || notification.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesSeverity =
      severityFilter === "all" || notification.severity.toLowerCase() === severityFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesSeverity
  })

  const openNotificationDetails = (notification) => {
    setSelectedNotification(notification)
    setIsDialogOpen(true)
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

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "Critical":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "High":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "Medium":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "Low":
        return <Info className="h-5 w-5 text-blue-500" />
      case "Info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "destructive"
      case "High":
        return "orange"
      case "Medium":
        return "amber"
      case "Low":
        return "blue"
      case "Info":
        return "blue"
      default:
        return "secondary"
    }
  }

  const handleMarkAsReadUnread = (notification) => {
    // In a real app, this would call an API to update the notification status
    toast({
      title: `Notification marked as ${notification.status === "Read" ? "unread" : "read"}`,
      description: `"${notification.title}" has been updated.`,
    })
  }

  const confirmDeleteNotification = (notification) => {
    setNotificationToDelete(notification)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteNotification = () => {
    // In a real app, this would call an API to delete the notification
    toast({
      title: "Notification deleted",
      description: `"${notificationToDelete.title}" has been deleted.`,
    })
    setIsDeleteDialogOpen(false)
    setNotificationToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Manage system notifications and alerts</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/notifications/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Notification
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>View and manage system notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notifications..."
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
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
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
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                <p className="text-muted-foreground">No notifications found.</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 rounded-lg border p-4 ${
                    notification.status === "Unread" ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="mt-0.5">{getSeverityIcon(notification.severity)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <Badge variant={notification.status === "Unread" ? "default" : "outline"}>
                        {notification.status}
                      </Badge>
                    </div>
                    <p className="text-sm">{notification.description}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span>{formatDate(notification.date)}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span>
                          {notification.organizations.length} organization
                          {notification.organizations.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {notification.reports.length > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>
                              {notification.reports.length} report{notification.reports.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openNotificationDetails(notification)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openNotificationDetails(notification)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/notifications/${notification.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Notification
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMarkAsReadUnread(notification)}>
                          {notification.status === "Read" ? (
                            <>
                              <BellOff className="mr-2 h-4 w-4" />
                              Mark as Unread
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Mark as Read
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => confirmDeleteNotification(notification)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Notification
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Details Dialog */}
      {selectedNotification && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>{selectedNotification.title}</DialogTitle>
                <Badge variant={selectedNotification.status === "Unread" ? "default" : "outline"}>
                  {selectedNotification.status}
                </Badge>
              </div>
            </DialogHeader>

            <Tabs defaultValue="details" className="mt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="recipients">Recipients</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(selectedNotification.severity)}
                    <Badge variant={getSeverityColor(selectedNotification.severity)}>
                      {selectedNotification.severity} Severity
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4" />
                      <span>Created {formatDate(selectedNotification.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Created by {selectedNotification.createdBy}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm">{selectedNotification.description}</p>
                </div>

                {selectedNotification.reports.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Related Reports</h4>
                    <div className="space-y-2">
                      {selectedNotification.reports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between rounded-md border p-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{report.title}</span>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/reports/${report.id}`}>
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View Report</span>
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Organizations</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNotification.organizations.map((org) => (
                      <Badge key={org.id} variant="outline">
                        <Building2 className="mr-1 h-3 w-3" />
                        {org.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recipients" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Email Recipients</h4>
                  <div className="space-y-2">
                    {selectedNotification.emails.map((email, index) => (
                      <div key={index} className="flex items-center gap-2 rounded-md border p-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{email}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Send to Additional Recipients</h4>
                  <div className="flex gap-2">
                    <Input placeholder="Enter email address" />
                    <Button>Send</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Activity Timeline</h4>
                  <div className="space-y-4">
                    {selectedNotification.actions.map((action, index) => (
                      <div key={index} className="relative pl-6 pb-4 border-l border-muted">
                        <div className="absolute left-[-4px] top-0 h-2 w-2 rounded-full bg-primary"></div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{action.type}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(action.date))}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{action.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleMarkAsReadUnread(selectedNotification)}>
                  {selectedNotification.status === "Read" ? (
                    <>
                      <BellOff className="mr-2 h-4 w-4" />
                      Mark as Unread
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark as Read
                    </>
                  )}
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/notifications/${selectedNotification.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsDialogOpen(false)
                    confirmDeleteNotification(selectedNotification)
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Notification</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this notification? This action cannot be undone.</p>
            {notificationToDelete && (
              <div className="mt-2 p-3 rounded-md bg-muted">
                <p className="font-medium">{notificationToDelete.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{notificationToDelete.description}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteNotification}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
