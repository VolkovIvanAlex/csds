"use client"

import { useEffect, useState } from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, MoreHorizontal, FileText, Building2, Share2, Bell, Filter, UserPlus, Check, X } from "lucide-react"
import Link from "next/link"
import { useAtom } from "jotai"
import { authStateAtom } from "@/lib/jotai/atoms/authState"
import { useAuth } from "@/hooks/auth.hooks"
import { useOrganization } from "@/hooks/organization.hooks"
import { AuthGuard } from "@/components/auth-guard"
import { organizationsErrorAtom, organizationsLoadingAtom, selectedOrganizationAtom } from "@/lib/jotai/organization-actions"
import { useUser } from "@/hooks/user.hooks"
import { useToast } from "@/components/ui/use-toast"

// Mock data for shared reports
const mockSharedReports = [
  {
    id: "1",
    title: "Phishing Campaign Analysis",
    sharedBy: "TechGlobal",
    sharedTo: "Acme Corp",
    date: "2023-06-15",
    status: "Accepted",
  },
  {
    id: "2",
    title: "Ransomware Threat Intelligence",
    sharedBy: "Acme Corp",
    sharedTo: "DataDefense",
    date: "2023-06-10",
    status: "Pending",
  },
  {
    id: "3",
    title: "Network Vulnerability Assessment",
    sharedBy: "DataDefense",
    sharedTo: "Acme Corp",
    date: "2023-06-05",
    status: "Accepted",
  },
]

// Mock data for notifications
const mockNotifications = [
  {
    id: "1",
    title: "Critical Security Alert",
    description: "Potential data breach detected",
    date: "2023-06-15",
    severity: "Critical",
  },
  {
    id: "2",
    title: "New Shared Report",
    description: "TechGlobal shared a report with your organization",
    date: "2023-06-12",
    severity: "Info",
  },
  {
    id: "3",
    title: "System Update",
    description: "Security patches applied successfully",
    date: "2023-06-08",
    severity: "Low",
  },
]

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  //const [selectedOrg, setSelectedOrg] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAssignUsersDialogOpen, setIsAssignUsersDialogOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [isCurrentUserFounder, setIsCurrentUserFounder] = useState(false)

  const { authState } = useAuth()
  const { userOrganizations, fetchUserOrganizations, updateOrganization, setSelectedOrganization, removeOrganization } = useOrganization()
  const [loading] = useAtom(organizationsLoadingAtom);
  const [error, setError] = useAtom(organizationsErrorAtom);
  const [showErrorBadge, setShowErrorBadge] = useState(false)
  const {allUsers, fetchAllUsers} = useUser();
  const [selectedOrg] = useAtom(selectedOrganizationAtom)
  const { toast } = useToast()

  useEffect(() => {
      if (authState.user?.id) {
          fetchUserOrganizations();
      }
  }, [authState.user?.id, fetchUserOrganizations, selectedOrg]);

  useEffect(() => {
    if (isAssignUsersDialogOpen) {
      fetchAllUsers();
    }
    // if (selectedOrg) {
    //   setSelectedUsers(selectedOrg.users.map(user => user.id))
    // }
  }, [isAssignUsersDialogOpen, fetchAllUsers]);

  useEffect(() => {
    if (error) {
      setShowErrorBadge(true)
    }
  }, [error])

  if (loading) return <div>Loading...</div>;

  // Filter organizations based on search query
  const filteredOrgs = userOrganizations?.filter((org) => org.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const openOrgDetails = (org) => {
    setSelectedOrganization(org)
    setIsDialogOpen(true)
    // Check if the current user is the founder of this organization
    const isFounder = org.founder.id === authState.user?.id
    setIsCurrentUserFounder(isFounder)
  }

  const openAssignUsersDialog = () => {
    setIsAssignUsersDialogOpen(true)
    // Initialize with users already in the organization
    setSelectedUsers(selectedOrg.users.map(user => user.id));
  }

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleAssignUsers = () => {
    updateOrganization({
      id: selectedOrg.id,
      userIds: selectedUsers,
      options: {
        onSuccess: (updatedOrg) => {
          console.log("Users assigned successfully:", updatedOrg);
          setIsAssignUsersDialogOpen(false);
          setSelectedOrganization(updatedOrg);
          setSelectedUsers(updatedOrg.users.map(user => user.id)) // Sync selectedUsers
        },
        onError: (error) => {
          console.error("Error assigning users:", error);
        }
      }
    });
  };

  const handleEditOrganization = (org) => {
    setSelectedOrganization(org) // Store the organization in the atom
  }

  const handleDeleteOrganization = (orgId) => {
    removeOrganization({
      id: orgId,
      options: {
        onSuccess: () => {
          console.log(`Organization ${orgId} deleted successfully`)
          setIsDialogOpen(false)
          setSelectedOrganization(null)
          toast({
            title: "Success",
            description: "Organization deleted successfully",
          })
        },
        onError: (error) => {
          console.error("Error deleting organization:", error)
          toast({
            title: "Error",
            description: error,
          })
        }
      }
    })
  }

  const handleDismissError = () => {
    setShowErrorBadge(false)
    setError(null)
  }

  return (
    <AuthGuard>
    <div className="space-y-6">
      {/* Error Badge */}
      {showErrorBadge && error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50 max-w-md">
            <span>{error}</span>
            <button
              onClick={handleDismissError}
              className="ml-auto p-1 hover:bg-red-700 rounded-full"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">Manage organizations and their members</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/organizations/new">
            <Plus className="mr-2 h-4 w-4" />
            New Organization
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>My Organizations</CardTitle>
          <CardDescription>View and manage all organizations in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search organizations..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Founder</TableHead>
                  <TableHead className="text-center">Users</TableHead>
                  <TableHead className="text-center">Reports</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No organizations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrgs.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-medium">{org.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={org.founder.photo || "/placeholder.svg"} alt={org.founder.name} />
                            <AvatarFallback>{org.founder.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{org.founder.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{org.users.length}</TableCell>
                      <TableCell className="text-center">{org.reports.length}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openOrgDetails(org)}>
                              <Building2 className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild onClick={() => handleEditOrganization(org)}>
                              <Link href={`/dashboard/organizations/${org.id}/edit`}>
                                <Building2 className="mr-2 h-4 w-4" />
                                Edit Organization
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/reports`}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Reports
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive"
                            onClick={() => handleDeleteOrganization(org.id)}
                            >Delete Organization</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Organization Details Dialog */}
      {selectedOrg && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{selectedOrg.name}</DialogTitle>
              <DialogDescription>Organization details and information</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="members" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="shared">Shared Reports</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="members" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Organization Members</h3>
                  {isCurrentUserFounder && (
                    <Button size="sm" variant="outline" onClick={openAssignUsersDialog}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign Users
                    </Button>
                  )}
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrg.users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge>
                              {user.id === selectedOrg.founderId ? "Founder" : "Member"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="shared" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Shared Reports</h3>
                  <Button size="sm" variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Report
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Title</TableHead>
                        <TableHead>Shared By</TableHead>
                        <TableHead>Shared To</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSharedReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.title}</TableCell>
                          <TableCell>{report.sharedBy}</TableCell>
                          <TableCell>{report.sharedTo}</TableCell>
                          <TableCell>{report.date}</TableCell>
                          <TableCell>
                            <Badge variant={report.status === "Accepted" ? "default" : "secondary"}>
                              {report.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Notifications</h3>
                </div>

                <div className="space-y-4">
                  {mockNotifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3 rounded-lg border p-4">
                      <div
                        className={`mt-0.5 ${
                          notification.severity === "Critical"
                            ? "text-destructive"
                            : notification.severity === "Info"
                              ? "text-blue-500"
                              : "text-amber-500"
                        }`}
                      >
                        <Bell className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{notification.title}</h4>
                          <Badge
                            variant={
                              notification.severity === "Critical"
                                ? "destructive"
                                : notification.severity === "Info"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {notification.severity}
                          </Badge>
                        </div>
                        <p className="text-sm">{notification.description}</p>
                        <p className="text-xs text-muted-foreground">{notification.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-4">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/reports`}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Reports
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/dashboard/organizations/${selectedOrg?.id}/edit`} onClick={() => handleEditOrganization(selectedOrg)}>
                  <Building2 className="mr-2 h-4 w-4" />
                  Edit Organization
                </Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Assign Users Dialog */}
      <Dialog open={isAssignUsersDialogOpen} onOpenChange={setIsAssignUsersDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Assign Users to Organization</DialogTitle>
            <DialogDescription>
              Select users to add to {selectedOrg?.name}. Users already in the organization are pre-selected.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users by name or email..."
              className="w-full pl-8"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Organization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {allUsers
                  .filter(user =>
                    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                  )
                  .map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUserSelection(user.id)}
                          id={`user-${user.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <label htmlFor={`user-${user.id}`} className="cursor-pointer">
                            {user.name}
                          </label>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignUsersDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignUsers}>
              <Check className="mr-2 h-4 w-4" />
              Assign Users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AuthGuard>
  )
}
