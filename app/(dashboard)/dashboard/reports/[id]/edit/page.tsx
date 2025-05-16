"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useAtom } from "jotai"
import { selectedReportAtom } from "@/lib/jotai/report-actions"

// Sample report data - in a real app, this would be fetched from an API based on the ID
const reports = {
  "1": {
    id: "1",
    title: "Phishing Campaign Targeting Finance Department",
    type: "Phishing",
    status: "Active",
    severity: "High",
    date: "2023-06-15T10:30:00",
    description:
      "A sophisticated phishing campaign targeted the finance department with emails appearing to come from the CFO. The emails contained malicious attachments designed to steal credentials and financial information. Several employees received these emails, and two clicked on the attachments before the security team was alerted.",
    affectedSystems: "Email system, Finance department workstations",
    indicators:
      "From: cfo-name@company-spoofed.com\nSubject: Urgent: Financial Review Required\nAttachment: Q2_Financial_Review.xlsx (SHA256: a1b2c3d4e5f6...)\nC2 Server: 192.168.1.100",
    mitigationSteps:
      "1. Blocked sender domain at email gateway\n2. Isolated affected workstations\n3. Reset credentials for potentially compromised accounts\n4. Conducted additional phishing awareness training\n5. Implemented additional email filtering rules",
  },
  "2": {
    id: "2",
    title: "Ransomware Threat Intelligence",
    type: "Ransomware",
    status: "Active",
    severity: "Critical",
    date: "2023-06-10T14:45:00",
    description: "Analysis of recent ransomware attacks targeting the healthcare sector.",
    affectedSystems: "Healthcare systems, Patient records databases",
    indicators: "IOCs for ransomware strain targeting healthcare sector",
    mitigationSteps: "Recommended security measures for healthcare organizations",
  },
  "3": {
    id: "3",
    title: "Network Vulnerability Assessment",
    type: "Vulnerability",
    status: "Resolved",
    severity: "Medium",
    date: "2023-06-05T09:15:00",
    description: "Comprehensive assessment of network vulnerabilities and potential security gaps.",
    affectedSystems: "Network infrastructure, Firewall configurations",
    indicators: "Identified vulnerabilities and potential exploit vectors",
    mitigationSteps: "Recommended patches and configuration changes",
  },
  "4": {
    id: "4",
    title: "DDoS Attack Analysis",
    type: "DDoS",
    status: "Investigating",
    severity: "High",
    date: "2023-06-01T16:20:00",
    description: "Analysis of recent distributed denial of service attack targeting our web infrastructure.",
    affectedSystems: "Web servers, Load balancers, CDN",
    indicators: "Traffic patterns, Source IPs, Attack signatures",
    mitigationSteps: "Traffic filtering rules, Rate limiting configurations",
  },
  "5": {
    id: "5",
    title: "Insider Threat Detection",
    type: "Insider",
    status: "Active",
    severity: "Medium",
    date: "2023-05-28T11:05:00",
    description: "Investigation into potential data exfiltration by an employee.",
    affectedSystems: "Internal databases, File servers",
    indicators: "Unusual access patterns, Large data transfers",
    mitigationSteps: "Enhanced monitoring, Access restrictions",
  },
}

// Remove the organization selection field from the form schema
const reportFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  type: z.string({
    required_error: "Please select an incident type.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  severity: z.string({
    required_error: "Please select a severity level.",
  }),
  affectedSystems: z.string().min(2, {
    message: "Please specify affected systems.",
  }),
  indicators: z.string().optional(),
  mitigationSteps: z.string().optional(),
})

type ReportFormValues = z.infer<typeof reportFormSchema>

export default function EditReportPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [report] = useAtom(selectedReportAtom)

  const defaultValues: ReportFormValues = report
    ? {
        title: report.title,
        description: report.description,
        type: report.type,
        status: report.status,
        severity: report.severity,
        affectedSystems: report.affectedSystems,
        indicators: report.indicators || "",
        mitigationSteps: report.mitigationSteps || "",
      }
    : {
        title: "",
        description: "",
        type: "",
        status: "",
        severity: "",
        affectedSystems: "",
        indicators: "",
        mitigationSteps: "",
      }

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  })

  // Update the onSubmit function to use the user's organization
  function onSubmit(data: ReportFormValues) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Report updated",
        description: "Your incident report has been updated successfully.",
      })
      router.push(`/dashboard/reports`)
    }, 1500)
  }

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

  return (
    <div className="container mx-auto max-w-4xl w-full space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/reports">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Report</h1>
          <p className="text-muted-foreground">Update incident report {report.id}</p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
          <CardDescription>Update the information about this security incident</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select incident type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Phishing">Phishing</SelectItem>
                          <SelectItem value="Malware">Malware</SelectItem>
                          <SelectItem value="Ransomware">Ransomware</SelectItem>
                          <SelectItem value="Data Breach">Data Breach</SelectItem>
                          <SelectItem value="DDoS">DDoS</SelectItem>
                          <SelectItem value="Unauthorized Access">Unauthorized Access</SelectItem>
                          <SelectItem value="Insider Threat">Insider Threat</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Investigating">Investigating</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Description</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-32 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="affectedSystems"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affected Systems</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="indicators"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indicators of Compromise</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-20 resize-none" {...field} />
                    </FormControl>
                    <FormDescription>List any technical indicators associated with this incident</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mitigationSteps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mitigation Steps</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-20 resize-none" {...field} />
                    </FormControl>
                    <FormDescription>Describe actions taken or planned to address the incident</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Add a section in the report details dialog to show the organization info
              but don't allow editing it */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="text-sm font-medium">Organization</h3>
                  <p className="mt-1 text-sm">{report.organization?.name || "Your Organization"}</p>
                </div>
              </div>

              <CardFooter className="flex justify-between px-0">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
