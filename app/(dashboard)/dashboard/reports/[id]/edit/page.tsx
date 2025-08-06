"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AlertCircle, ArrowLeft, Save } from "lucide-react"
import { useAtom } from "jotai"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { selectedReportAtom } from "@/lib/jotai/report-actions"
import { useReport } from "@/hooks/report.hooks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const reportFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  typeOfThreat: z.string().nonempty({
    message: "Please select a threat type.",
  }),
  severity: z.string().nonempty({
    message: "Please select a severity level.",
  }),
  status: z.string().nonempty({
    message: "Please select a status.",
  }),
  riskScore: z.coerce.number().min(0).max(100).optional(),
  stix: z.string().min(5, {
    message: "STIX data must be at least 5 characters.",
  }),
})

type ReportFormValues = z.infer<typeof reportFormSchema>

export default function EditReportPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [report] = useAtom(selectedReportAtom)
  const { updateReport } = useReport()
  const [formError, setFormError] = useState<string | null>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  const defaultValues: ReportFormValues = report
    ? {
        title: report.title,
        description: report.description,
        typeOfThreat: report.typeOfThreat || "",
        status: report.status,
        severity: report.severity,
        riskScore: report.riskScore,
        stix: typeof report.stix === 'object' ? JSON.stringify(report.stix, null, 2) : report.stix || "",
      }
    : {
        title: "",
        description: "",
        typeOfThreat: "",
        status: "",
        severity: "",
        riskScore: null,
        stix: "",
      }

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  })

  useEffect(() => {
      if (formError) {
        errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
  }, [formError]);

  async function onSubmit(data: ReportFormValues) {
    let stixObject;
    try {
      stixObject = JSON.parse(data.stix);
    } catch (error) {
      setFormError("The STIX data is not valid JSON. Please correct it and try again.");
      return;
    }

    setIsSubmitting(true)
    try {
      const reportId = report.id
      const organizationId = report.organization.id
      await updateReport({
        organizationId,
        reportId,
        reportData: {
            ...data,
            stix: stixObject,
        },
        options: {
          onSuccess: () => {
            toast({
              title: "Report updated",
              description: "Your incident report has been updated successfully.",
            })
            router.push("/dashboard/reports")
          },
          onError: (error) => {
            const errorMessage = error || "Failed to update report.";
            setFormError(errorMessage);
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message || "Failed to update report.",
            })
            setIsSubmitting(false)
          },
        },
      })
    } catch (error) {
      console.error("Update report failed:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      })
      setIsSubmitting(false)
    }
  }

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" onChange={() => setFormError(null)}>

              <div ref={errorRef}>
                {formError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Submission Failed</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
              </div>

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
                      <Textarea className="min-h-32 resize-none" {...field} />
                    </FormControl>
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
                        className="min-h-40 resize-y font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>STIX 2.1 formatted data in JSON</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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