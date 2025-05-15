"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { AlertTriangle, ArrowLeft, Building2, FileText, Mail, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { generateUUID } from "@/lib/utils"

// Mock data for organizations and reports
const mockOrganizations = [
  { id: "1", name: "Acme Corp" },
  { id: "2", name: "TechGlobal" },
  { id: "3", name: "DataDefense" },
  { id: "4", name: "SecureNet" },
  { id: "5", name: "CyberShield" },
]

const mockReports = [
  { id: "1", title: "Phishing Campaign Targeting Finance Department" },
  { id: "2", title: "Ransomware Threat Intelligence" },
  { id: "3", title: "Vulnerability Assessment Results" },
  { id: "4", title: "DDoS Attack Analysis" },
  { id: "5", title: "Monthly Security Review" },
]

// Mock notifications data
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
    reports: ["1"],
    organizations: ["1"],
    createdBy: "System",
  },
  {
    id: "2",
    title: "New Shared Report",
    description: "TechGlobal has shared a new threat report with your organization.",
    status: "Read",
    severity: "Info",
    date: "2023-06-12T14:45:00",
    emails: ["security@acmecorp.com"],
    reports: ["2"],
    organizations: ["1", "2"],
    createdBy: "john.smith@techglobal.com",
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
    organizations: ["1"],
    createdBy: "System",
  },
  {
    id: "4",
    title: "Suspicious Login Attempts",
    description: "Multiple failed login attempts detected from unknown IP addresses.",
    status: "Unread",
    severity: "High",
    date: "2023-06-05T16:20:00",
    emails: ["security@acmecorp.com", "admin@acmecorp.com"],
    reports: ["4"],
    organizations: ["1"],
    createdBy: "System",
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
    organizations: ["1", "2", "3"],
    createdBy: "System",
  },
]

export default function EditNotificationPage({ params }) {
  const router = useRouter()
  const { id } = params

  const [notification, setNotification] = useState(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [severity, setSeverity] = useState("")
  const [status, setStatus] = useState("")
  const [selectedOrgs, setSelectedOrgs] = useState([])
  const [selectedReports, setSelectedReports] = useState([])
  const [emails, setEmails] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // In a real app, this would be an API call to fetch the notification
    const fetchNotification = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        const foundNotification = mockNotifications.find((n) => n.id === id)

        if (foundNotification) {
          setNotification(foundNotification)
          setTitle(foundNotification.title)
          setDescription(foundNotification.description)
          setSeverity(foundNotification.severity)
          setStatus(foundNotification.status)
          setSelectedOrgs(foundNotification.organizations)
          setSelectedReports(foundNotification.reports)
          setEmails(foundNotification.emails.map((email) => ({ id: generateUUID(), value: email })))
        } else {
          toast({
            title: "Error",
            description: "Notification not found.",
            variant: "destructive",
          })
          router.push("/dashboard/notifications")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load notification. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotification()
  }, [id, router])

  const handleAddEmail = () => {
    setEmails([...emails, { id: generateUUID(), value: "" }])
  }

  const handleRemoveEmail = (id) => {
    setEmails(emails.filter((email) => email.id !== id))
  }

  const handleEmailChange = (id, value) => {
    setEmails(emails.map((email) => (email.id === id ? { ...email, value } : email)))
  }

  const handleOrgChange = (orgId) => {
    setSelectedOrgs((prev) => {
      if (prev.includes(orgId)) {
        return prev.filter((id) => id !== orgId)
      } else {
        return [...prev, orgId]
      }
    })
  }

  const handleReportChange = (reportId) => {
    setSelectedReports((prev) => {
      if (prev.includes(reportId)) {
        return prev.filter((id) => id !== reportId)
      } else {
        return [...prev, reportId]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title) {
      toast({
        title: "Validation Error",
        description: "Please enter a notification title.",
        variant: "destructive",
      })
      return
    }

    if (!severity) {
      toast({
        title: "Validation Error",
        description: "Please select a severity level.",
        variant: "destructive",
      })
      return
    }

    if (selectedOrgs.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one organization.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to update the notification
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: "Notification Updated",
        description: "Your notification has been updated successfully.",
      })

      router.push("/dashboard/notifications")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading notification...</p>
        </div>
      </div>
    )
  }

  if (!notification) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <p className="text-lg font-medium">Notification not found</p>
          <p className="text-sm text-muted-foreground mt-1">The notification you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/notifications">Back to Notifications</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/notifications">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Notifications
            </Link>
          </Button>
        </div>
        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Notification</CardTitle>
          <CardDescription>Update notification details and recipients</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Notification Title</Label>
                <Input
                  id="title"
                  placeholder="Enter notification title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter notification details"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={severity} onValueChange={setSeverity}>
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Select severity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          Critical
                        </div>
                      </SelectItem>
                      <SelectItem value="High">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          High
                        </div>
                      </SelectItem>
                      <SelectItem value="Medium">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="Low">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-blue-500" />
                          Low
                        </div>
                      </SelectItem>
                      <SelectItem value="Info">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-blue-500" />
                          Info
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Read">Read</SelectItem>
                      <SelectItem value="Unread">Unread</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Select Organizations</h3>
                <div className="space-y-2 border rounded-md p-4">
                  {mockOrganizations.map((org) => (
                    <div key={org.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`org-${org.id}`}
                        checked={selectedOrgs.includes(org.id)}
                        onCheckedChange={() => handleOrgChange(org.id)}
                      />
                      <Label htmlFor={`org-${org.id}`} className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {org.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Related Reports (Optional)</h3>
                <div className="space-y-2 border rounded-md p-4">
                  {mockReports.map((report) => (
                    <div key={report.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`report-${report.id}`}
                        checked={selectedReports.includes(report.id)}
                        onCheckedChange={() => handleReportChange(report.id)}
                      />
                      <Label htmlFor={`report-${report.id}`} className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {report.title}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Email Recipients</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddEmail}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Email
                  </Button>
                </div>
                <div className="space-y-2">
                  {emails.map((email) => (
                    <div key={email.id} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter email address"
                          className="pl-8"
                          value={email.value}
                          onChange={(e) => handleEmailChange(email.id, e.target.value)}
                        />
                      </div>
                      {emails.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveEmail(email.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  Created by {notification.createdBy} on {new Date(notification.date).toLocaleString()}
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
