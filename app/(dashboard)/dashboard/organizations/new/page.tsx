"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Save, ArrowLeft } from "lucide-react"
import { useAtom } from "jotai"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { authStateAtom } from "@/lib/jotai/atoms"

const organizationFormSchema = z.object({
  name: z.string().min(3, {
    message: "Organization name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  industry: z.string({
    required_error: "Please select an industry.",
  }),
})

type OrganizationFormValues = z.infer<typeof organizationFormSchema>

export default function NewOrganizationPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [authState] = useAtom(authStateAtom)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      industry: "",
    },
  })

  function onSubmit(data: OrganizationFormValues) {
    setIsSubmitting(true)

    // Create the organization object following the required structure
    const organization = {
      id: `org-${Date.now()}`, // Generate a temporary ID (would be done by the backend)
      name: data.name,
      description: data.description,
      website: data.website,
      industry: data.industry,
      founder: authState.user,
      users: [authState.user], // Initialize with the founder as the first user
      reports: [], // Initialize with empty reports
      sharedReportsSent: [], // Initialize with empty shared reports sent
      sharedReportsReceived: [], // Initialize with empty shared reports received
    }

    console.log("Creating organization:", organization)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Organization created",
        description: "Your organization has been created successfully.",
      })
      router.push("/dashboard/organizations")
    }, 1500)
  }

  return (
    <div className="container mx-auto max-w-4xl w-full">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/organizations">
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-1">Back</span>
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create New Organization</h1>
        <p className="text-muted-foreground">Add a new organization to the system</p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>Enter the details for the new organization</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form id="org-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter organization name" {...field} />
                    </FormControl>
                    <FormDescription>The official name of your organization</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Government">Government</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Energy">Energy</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>The official website of your organization</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your organization" className="min-h-32 resize-none" {...field} />
                    </FormControl>
                    <FormDescription>Provide a brief description of your organization</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-sm font-medium">Founder Information</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You ({authState.user?.name || "Current User"}) will be automatically assigned as the founder of this
                  organization.
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" form="org-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>Creating...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Organization
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
