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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, FileText, Building2, Mail, User, Wallet, Briefcase, Filter } from "lucide-react"
import Link from "next/link"

// Mock data for users
const mockUsers = [
  {
    id: "1",
    privyId: "prv_123456",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "admin",
    jobTitle: "Security Analyst",
    wallet: "0x1234...5678",
    photo: "/abstract-geometric-shapes.png",
    submissionQuantity: 24,
    organization: { id: "1", name: "Acme Corp" },
  },
  {
    id: "2",
    privyId: "prv_234567",
    name: "Sarah Miller",
    email: "sarah@example.com",
    role: "user",
    jobTitle: "Threat Researcher",
    wallet: "0x2345...6789",
    photo: "/number-two-graphic.png",
    submissionQuantity: 18,
    organization: { id: "2", name: "TechGlobal" },
  },
  {
    id: "3",
    privyId: "prv_345678",
    name: "James Wilson",
    email: "james@example.com",
    role: "admin",
    jobTitle: "CISO",
    wallet: "0x3456...7890",
    photo: "/abstract-geometric-shapes.png",
    submissionQuantity: 32,
    organization: { id: "3", name: "DataDefense" },
  },
  {
    id: "4",
    privyId: "prv_456789",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "user",
    jobTitle: "Security Engineer",
    wallet: "0x4567...8901",
    photo: "/abstract-geometric-shapes.png",
    submissionQuantity: 15,
    organization: { id: "1", name: "Acme Corp" },
  },
  {
    id: "5",
    privyId: "prv_567890",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "user",
    jobTitle: "Incident Responder",
    wallet: "0x5678...9012",
    photo: "/abstract-geometric-composition-5.png",
    submissionQuantity: 21,
    organization: { id: "2", name: "TechGlobal" },
  },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const openUserProfile = (user) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage users and their access</p>
        </div>
        {/* Removed "Add User" button as requested */}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users by name or email..."
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
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead className="text-center">Reports</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.jobTitle}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role === "admin" ? "Admin" : "User"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.organization.name}</TableCell>
                      <TableCell className="text-center">{user.submissionQuantity}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openUserProfile(user)}>
                              <User className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/users/${user.id}/edit`}>
                                <User className="mr-2 h-4 w-4" />
                                Edit User
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/users/${user.id}/reports`}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Reports
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
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

      {/* User Profile Dialog */}
      {selectedUser && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
              <DialogDescription>User details and information</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.photo || "/placeholder.svg"} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.jobTitle}</p>
                  <Badge variant={selectedUser.role === "admin" ? "default" : "secondary"} className="mt-1">
                    {selectedUser.role === "admin" ? "Admin" : "User"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Organization</p>
                    <p className="text-sm">{selectedUser.organization.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Job Title</p>
                    <p className="text-sm">{selectedUser.jobTitle}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Wallet Address</p>
                    <p className="text-sm font-mono">{selectedUser.wallet}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Reports Submitted</p>
                    <p className="text-sm">{selectedUser.submissionQuantity}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/users/${selectedUser.id}/reports`}>
                    <FileText className="mr-2 h-4 w-4" />
                    View Reports
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/dashboard/users/${selectedUser.id}/edit`}>
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
