"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Save, ArrowLeft, Upload, X, Paperclip } from "lucide-react"
import { useAtom } from "jotai"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { calculateHash } from "@/lib/utils"
import { authStateAtom } from "@/lib/jotai/atoms"

// Remove the organizationId field from the form schema
const reportFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  typeOfThreat: z.string({
    required_error: "Please select a threat type.",
  }),
  severity: z.string({
    required_error: "Please select a severity level.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  riskScore: z.coerce.number().min(0).max(100).optional(),
  stix: z.string().optional(),
  emailsToShare: z.string().optional(),
})

type ReportFormValues = z.infer<typeof reportFormSchema>

// Mock organizations for the dropdown
const mockOrganizations = [
  { id: "org-1", name: "CyberShield Inc." },
  { id: "org-2", name: "SecureNet Solutions" },
  { id: "org-3", name: "Digital Defense Group" },
]

export default function NewReportPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [authState] = useAtom(authStateAtom)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attachments, setAttachments] = useState<string[]>([])

  // Update the defaultValues to remove organizationId
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: "",
      description: "",
      typeOfThreat: "",
      severity: "",
      status: "Draft",
      riskScore: 50,
      stix: "",
      emailsToShare: "",
    },
  })

  // Update the onSubmit function to use the user's organization
  function onSubmit(data: ReportFormValues) {
    setIsSubmitting(true)

    // Generate a timestamp and hash for blockchain simulation
    const timestamp = new Date().toISOString()
    const reportData = JSON.stringify({ ...data, timestamp })
    const reportHash = calculateHash(reportData)

    // Parse emails to share into an array
    const emailsArray = data.emailsToShare ? data.emailsToShare.split(",").map((email) => email.trim()) : []

    // Create the report object following the required structure
    const report = {
      id: `report-${Date.now()}`, // Generate a temporary ID (would be done by the backend)
      title: data.title,
      description: data.description,
      attachments: attachments,
      typeOfThreat: data.typeOfThreat,
      severity: data.severity,
      status: data.status,
      submittedAt: timestamp,
      stix: data.stix || "{}",
      blockchainHash: reportHash,
      riskScore: data.riskScore || 50,
      emailsToShare: emailsArray,
      author: authState.user,
      organization: authState.user.organization, // Use the user's organization
      sharedReports: [],
    }

    console.log("Submitting report:", report)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Report submitted",
        description: "Your incident report has been created successfully.",
      })

      // Show blockchain confirmation toast
      setTimeout(() => {
        toast({
          title: "Blockchain verification",
          description: `Report hash ${reportHash.substring(0, 8)}... has been recorded`,
        })
      }, 1500)

      router.push("/dashboard/reports")
    }, 2000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => file.name)
      setAttachments([...attachments, ...newFiles])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  return (
    <div className="container mx-auto max-w-4xl w-full">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/reports">
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-1">Back</span>
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Incident Report</h1>
        <p className="text-muted-foreground">Create a new cybersecurity incident report</p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
          <CardDescription>Provide detailed information about the security incident</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form id="report-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief title describing the incident" {...field} />
                    </FormControl>
                    <FormDescription>Provide a clear, concise title for the incident</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="typeOfThreat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Threat Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select threat type" />
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

              <div className="grid gap-4 sm:grid-cols-2">
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
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Submitted">Submitted</SelectItem>
                          <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="riskScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Score (0-100)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} />
                      </FormControl>
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
                      <Textarea
                        placeholder="Detailed description of the incident"
                        className="min-h-32 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Provide a comprehensive description of what happened</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attachments"
                render={() => (
                  <FormItem>
                    <FormLabel>Attachments</FormLabel>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Files
                      </Button>
                      <Input id="file-upload" type="file" multiple className="hidden" onChange={handleFileUpload} />
                    </div>
                    {attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between rounded-md border p-2">
                            <div className="flex items-center">
                              <Paperclip className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{file}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>STIX Data (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{"type": "indicator", "spec_version": "2.1", ...}'
                        className="min-h-20 resize-none font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Optional STIX 2.1 formatted data in JSON</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailsToShare"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Share with (Emails)</FormLabel>
                    <FormControl>
                      <Input placeholder="email1@example.com, email2@example.com" {...field} />
                    </FormControl>
                    <FormDescription>Enter email addresses separated by commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" form="report-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>Submitting...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Submit Report
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
