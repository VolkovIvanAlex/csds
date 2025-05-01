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
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

// Sample organization data - in a real app, this would be fetched from an API based on the ID
const organizations = {
  "1": {
    id: "1",
    name: "Acme Corp",
    description: "A global leader in security solutions",
    website: "https://acme.example.com",
    contactEmail: "security@acme.example.com",
    contactPhone: "+1 (555) 123-4567",
    address: "123 Security Blvd, Cyber City, CS 12345",
  },
  "2": {
    id: "2",
    name: "TechGlobal",
    description: "Innovative technology solutions for modern security challenges",
    website: "https://techglobal.example.com",
    contactEmail: "info@techglobal.example.com",
    contactPhone: "+1 (555) 987-6543",
    address: "456 Innovation Way, Tech Valley, TV 67890",
  },
  "3": {
    id: "3",
    name: "DataDefense",
    description: "Specialized in data protection and threat intelligence",
    website: "https://datadefense.example.com",
    contactEmail: "contact@datadefense.example.com",
    contactPhone: "+1 (555) 456-7890",
    address: "789 Secure Drive, Data Harbor, DH 54321",
  },
  "4": {
    id: "4",
    name: "SecureNet",
    description: "Network security and infrastructure protection",
    website: "https://securenet.example.com",
    contactEmail: "support@securenet.example.com",
    contactPhone: "+1 (555) 789-0123",
    address: "321 Network Lane, Firewall City, FC 09876",
  },
}

const organizationFormSchema = z.object({
  name: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  contactPhone: z.string().min(5, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
})

type OrganizationFormValues = z.infer<typeof organizationFormSchema>

export default function EditOrganizationPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get the organization based on the ID parameter
  const organization = organizations[params.id] || null

  const defaultValues: OrganizationFormValues = organization
    ? {
        name: organization.name,
        description: organization.description,
        website: organization.website,
        contactEmail: organization.contactEmail,
        contactPhone: organization.contactPhone,
        address: organization.address,
      }
    : {
        name: "",
        description: "",
        website: "",
        contactEmail: "",
        contactPhone: "",
        address: "",
      }

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: OrganizationFormValues) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Organization updated",
        description: "The organization has been updated successfully.",
      })
      router.push("/dashboard/organizations")
    }, 1500)
  }

  // If organization not found, show error
  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h1 className="text-2xl font-bold">Organization Not Found</h1>
        <p className="text-muted-foreground">The organization you're looking for doesn't exist or has been deleted.</p>
        <Button asChild>
          <Link href="/dashboard/organizations">Back to Organizations</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl w-full space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/organizations">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Organization</h1>
          <p className="text-muted-foreground">Update organization details for {organization.name}</p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>Update the information about this organization</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                      <Textarea className="min-h-32 resize-none" {...field} />
                    </FormControl>
                    <FormDescription>Provide a brief description of the organization</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
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
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-20 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
