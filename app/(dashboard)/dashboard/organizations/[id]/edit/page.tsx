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
import { useOrganization } from "@/hooks/organization.hooks"
import { useAtom } from "jotai"
import { selectedOrganizationAtom } from "@/lib/jotai/organization-actions"

const organizationFormSchema = z.object({
  name: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
})

type OrganizationFormValues = z.infer<typeof organizationFormSchema>

export default function EditOrganizationPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [organization] = useAtom(selectedOrganizationAtom)
  const { updateOrganization } = useOrganization()

  const defaultValues: OrganizationFormValues = {
    name: organization?.name || "",
  }

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: OrganizationFormValues) {
    setIsSubmitting(true)
    updateOrganization({
      id: organization.id,
      name: data.name,
      options: {
        onSuccess: () => {
          setIsSubmitting(false)
          toast({
            title: "Organization updated",
            description: "The organization has been updated successfully.",
          })
          //router.push("/dashboard/organizations")
        },
        onError: (error) => {
          setIsSubmitting(false)
          toast({
            title: "Error",
            description: "Failed to update organization.",
            variant: "destructive",
          })
          console.error("Error updating organization:", error)
        },
      },
    })
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
