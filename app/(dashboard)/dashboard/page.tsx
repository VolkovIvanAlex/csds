import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Bell,
  Building2,
  FileText,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your threat reporting dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/dashboard/reports/new">
              <FileText className="mr-2 h-4 w-4" />
              New Report
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+3 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">+1 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.2</div>
            <p className="text-xs text-muted-foreground">-4.5 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Latest threat reports submitted across all organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-1">
                        <h4 className="font-medium">Suspicious Network Activity in Finance Department</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Acme Corp</span>
                          <span>•</span>
                          <span>2 hours ago</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={i % 3 === 0 ? "destructive" : i % 3 === 1 ? "default" : "secondary"}>
                          {i % 3 === 0 ? "Critical" : i % 3 === 1 ? "High" : "Medium"}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/reports/${i}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Threat Distribution</CardTitle>
                <CardDescription>Reports by threat type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="mx-auto h-12 w-12 opacity-50" />
                  <p className="mt-2">Chart visualization will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Organizations</CardTitle>
                <CardDescription>By number of reports submitted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Acme Corp", "TechGlobal", "SecureNet", "DataDefense"].map((org, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <span>{org}</span>
                      </div>
                      <div className="font-medium">{48 - i * 7} reports</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Latest system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Critical vulnerability detected", icon: AlertTriangle, color: "text-destructive" },
                    { title: "New report shared with your organization", icon: FileText, color: "text-blue-500" },
                    { title: "System update completed successfully", icon: CheckCircle2, color: "text-green-500" },
                    { title: "Scheduled maintenance in 2 days", icon: Clock, color: "text-amber-500" },
                  ].map((notification, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 ${notification.color}`}>
                        <notification.icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {i === 0
                            ? "High severity issue requires immediate attention"
                            : i === 1
                              ? "TechGlobal shared 'Ransomware Analysis' with you"
                              : i === 2
                                ? "All systems updated to latest security patches"
                                : "Scheduled downtime on June 15th, 2-4 AM UTC"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>All system activity across users and organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex">
                    <div className="relative mr-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        {i % 4 === 0 ? (
                          <FileText className="h-4 w-4 text-primary" />
                        ) : i % 4 === 1 ? (
                          <Users className="h-4 w-4 text-primary" />
                        ) : i % 4 === 2 ? (
                          <Bell className="h-4 w-4 text-primary" />
                        ) : (
                          <Building2 className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      {i < 4 && <div className="absolute left-4 top-9 bottom-0 w-px bg-border" />}
                    </div>
                    <div className="space-y-1 pt-1">
                      <p className="font-medium">
                        {i % 4 === 0
                          ? "New report submitted"
                          : i % 4 === 1
                            ? "User invited to organization"
                            : i % 4 === 2
                              ? "Notification sent to all users"
                              : "New organization created"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {i % 4 === 0
                          ? "Alex Johnson submitted 'Phishing Campaign Analysis'"
                          : i % 4 === 1
                            ? "Sarah Miller invited to TechGlobal"
                            : i % 4 === 2
                              ? "System-wide security alert notification sent"
                              : "DataDefense organization created by James Wilson"}
                      </p>
                      <p className="text-xs text-muted-foreground">{30 - i * 5} minutes ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Security alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Critical Vulnerability</AlertTitle>
                  <AlertDescription>
                    A critical vulnerability has been detected in your network infrastructure. Immediate action
                    required.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Suspicious Login Attempts</AlertTitle>
                  <AlertDescription>
                    Multiple failed login attempts detected from unknown IP addresses.
                  </AlertDescription>
                </Alert>

                <Alert variant="default">
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Scheduled Maintenance</AlertTitle>
                  <AlertDescription>
                    System maintenance scheduled for June 15th, 2-4 AM UTC. Brief service interruption expected.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild className="h-auto flex-col gap-1 py-4">
                <Link href="/dashboard/reports/new">
                  <FileText className="h-5 w-5 mb-1" />
                  <span>New Report</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto flex-col gap-1 py-4">
                <Link href="/dashboard/users">
                  <Users className="h-5 w-5 mb-1" />
                  <span>Manage Users</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto flex-col gap-1 py-4">
                <Link href="/dashboard/organizations">
                  <Building2 className="h-5 w-5 mb-1" />
                  <span>Organizations</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto flex-col gap-1 py-4">
                <Link href="/dashboard/analytics">
                  <BarChart3 className="h-5 w-5 mb-1" />
                  <span>Analytics</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>API Services</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Database</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <span>Blockchain Verification</span>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                  Degraded
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Notification Service</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Operational
                </Badge>
              </div>

              <Button variant="link" size="sm" className="w-full mt-2" asChild>
                <Link href="/dashboard/status">
                  View detailed status
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
