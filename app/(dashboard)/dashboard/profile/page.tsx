"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Save, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAtom } from "jotai"
import { authStateAtom } from "@/lib/jotai/atoms/authState"
import { useAuth } from "@/hooks/auth.hooks"
import { User } from "@/lib/jotai/atoms/user"
import { AuthGuard } from "@/components/auth-guard"

const profileFormSchema = z.object({
  name: z.string().min(1, {
    message: "First name must be at least 1 character.",
  }),
  jobTitle: z.string().optional(),
  photo: z.string().url().optional().or(z.literal("")), // Allow empty string for no photo
})

type ProfileFormValues = z.infer<typeof profileFormSchema>


export default function ProfilePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { authState, updateUserProfile } = useAuth()
  
  const defaultValues: Partial<ProfileFormValues> = {
    name: authState.user?.name || "",
    jobTitle: authState.user?.jobTitle || "",
    photo: authState.user?.photo || "",
  }
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: ProfileFormValues) {
    console.log("submitted");
    setIsLoading(true)
    updateUserProfile({
      userData: {
        name: data.name,
        jobTitle: data.jobTitle || undefined,
        photo: data.photo || undefined,
      },
      options: {
        onSuccess: (updatedUser) => {
          toast({
            title: "Profile updated",
            description: "Your profile has been updated successfully.",
          });
          setIsLoading(false)
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to update profile.",
          });
          setIsLoading(false)
        },
      },
    });
  }

  const handleUploadPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate uploading the file and getting a URL (replace with actual upload logic)
      const photoUrl = URL.createObjectURL(file); // Temporary URL for demo
      form.setValue("photo", photoUrl);
    }
  };

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={form.getValues("photo") || "/placeholder-avatar.png"} alt="User" />
                    <AvatarFallback>{authState.user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium">Profile picture</h3>
                      <p className="text-sm text-muted-foreground">
                        This will be displayed on your profile and in your reports
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <label>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleUploadPhoto}
                          />
                        </label>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => form.setValue("photo", "")}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                {/* <FormField
                  control={form.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input value={authState.user?.email || ""} disabled />
                      </FormControl>
                      <FormDescription>
                        Email cannot be changed here. Contact support to update.
                      </FormDescription>
                    </FormItem>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormItem>
                        <FormLabel>Organization</FormLabel>
                        <FormControl>
                          <Input
                            value={authState.user?.organization?.name || "No organization"}
                            disabled
                          />
                        </FormControl>
                        <FormDescription>
                          Manage organization membership in the Organizations section.
                        </FormDescription>
                      </FormItem>
                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save changes
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  )
}
