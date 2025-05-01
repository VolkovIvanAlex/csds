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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import Link from "next/link"

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
  },
]

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Filter notifications based on search query and filters
  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         notification.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || notification.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesSeverity = severityFilter === "all" || notification.severity.toLowerCase() === severityFilter.toLowerCase()
    
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
      minute: "numeric"
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
                  <div className="mt-0.5">
                    {getSeverityIcon(notification.severity)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <Badge variant={
                        notification.status === "Unread" ? "default" : "outline"
                      }>
                        {notification.status}
                      </Badge>
                    </div>
                    <p className="text-sm">{notification.description}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span>{formatDate(notification.date)}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span>{notification.organizations.length} organization{notification.organizations.length !== 1 ? 's' : ''}</span>
                      </div>
                      {notification.reports.length > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>{notification.reports.length} report{notification.reports.length !== 1 ? 's' : ''}</span>
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
                        <DropdownMenuItem>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark as {notification.status === "Read" ? "Unread" : "Read"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
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
                <Badge
                  variant={
