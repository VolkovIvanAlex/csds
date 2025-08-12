"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, AlertTriangle, Shield, Globe, BarChart } from "lucide-react"
import Link from "next/link"

import {
  getGlobalThreatStats,
  getGlobalRiskData,
  getGlobalRecentIncidents,
  getGlobalSecurityNews,
  getAttackVectorDistribution,
  getIndustryVulnerabilityData,
} from "@/lib/jotai/api-actions"

import { PublicThreatStats } from "@/components/public-threat-stats"
import { PublicRiskAssessment } from "@/components/public-risk-assessment"
import { PublicAttackVectors } from "@/components/public-attack-vectors"
import { PublicVulnerabilityChart } from "@/components/public-vulnerability-chart"

export default function PublicDashboardPage() {
  const [threatStats, setThreatStats] = useState([])
  const [riskData, setRiskData] = useState([])
  const [recentIncidents, setRecentIncidents] = useState([])
  const [securityNews, setSecurityNews] = useState([])
  const [attackVectors, setAttackVectors] = useState([])
  const [vulnerabilityData, setVulnerabilityData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [threatStatsData, riskDataResult, incidentsData, newsData, attackVectorsData, vulnerabilityDataResult] =
          await Promise.all([
            getGlobalThreatStats(),
            getGlobalRiskData(),
            getGlobalRecentIncidents(),
            getGlobalSecurityNews(),
            getAttackVectorDistribution(),
            getIndustryVulnerabilityData(),
          ])

        setThreatStats(threatStatsData)
        setRiskData(riskDataResult)
        setRecentIncidents(incidentsData)
        setSecurityNews(newsData)
        setAttackVectors(attackVectorsData)
        setVulnerabilityData(vulnerabilityDataResult)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Global Cybersecurity Dashboard</h1>
        <p className="text-muted-foreground">
          Public overview of current cybersecurity threats and incidents worldwide
        </p>
      </div>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Public Information</AlertTitle>
        <AlertDescription>
          This dashboard shows anonymized global cybersecurity data.
          <Link href="/register" className="ml-1 underline">
            Register for an account
          </Link>{" "}
          to access organization-specific insights and reporting tools.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Vulnerabilities</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">237</div>
                <p className="text-xs text-muted-foreground">-3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Affected Countries</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">+5 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Global Risk Index</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Global Threat Statistics</CardTitle>
                <CardDescription>Cybersecurity incidents by type over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {isLoading ? (
                  <div className="flex h-[350px] items-center justify-center">Loading...</div>
                ) : (
                  <PublicThreatStats data={threatStats} />
                )}
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Global risk distribution by severity</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex h-[300px] items-center justify-center">Loading...</div>
                ) : (
                  <PublicRiskAssessment data={riskData} />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Attack Vectors</CardTitle>
                <CardDescription>Distribution of attack methods</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex h-[300px] items-center justify-center">Loading...</div>
                ) : (
                  <PublicAttackVectors data={attackVectors} />
                )}
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Industry Vulnerabilities</CardTitle>
                <CardDescription>Vulnerabilities by industry sector</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex h-[300px] items-center justify-center">Loading...</div>
                ) : (
                  <PublicVulnerabilityChart data={vulnerabilityData} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Global Incidents</CardTitle>
              <CardDescription>Major cybersecurity incidents reported worldwide</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-[200px] items-center justify-center">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <div key={incident.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{incident.title}</h3>
                          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <span>ID: {incident.id}</span>
                            <span>•</span>
                            <span>{formatDate(incident.date)}</span>
                            <span>•</span>
                            <span>Sector: {incident.affectedSector}</span>
                            <span>•</span>
                            <span>Region: {incident.region}</span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            incident.severity === "Critical"
                              ? "destructive"
                              : incident.severity === "High"
                                ? "default"
                                : incident.severity === "Medium"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {incident.severity}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline">{incident.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cybersecurity News</CardTitle>
              <CardDescription>Latest updates from the cybersecurity world</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-[200px] items-center justify-center">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {securityNews.map((news) => (
                    <div key={news.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{news.title}</h3>
                          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Source: {news.source}</span>
                            <span>•</span>
                            <span>{formatDate(news.date)}</span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            news.category === "Vulnerability"
                              ? "destructive"
                              : news.category === "Threat"
                                ? "default"
                                : news.category === "Policy"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {news.category}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm">{news.summary}</p>
                      <div className="mt-3">
                        <Button variant="outline" size="sm">
                          Read More
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Intelligence</CardTitle>
              <CardDescription>Current global threat landscape and emerging threats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-semibold">Ransomware Trends</h3>
                  <p className="mt-2">
                    Ransomware attacks continue to evolve with more sophisticated encryption techniques and double
                    extortion tactics. Healthcare and critical infrastructure remain primary targets, with a 43%
                    increase in attacks against these sectors in the last quarter.
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-md bg-muted p-3">
                      <div className="text-sm font-medium">Average Ransom</div>
                      <div className="text-xl font-bold">$1.2M</div>
                      <div className="text-xs text-muted-foreground">+18% YoY</div>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <div className="text-sm font-medium">Recovery Cost</div>
                      <div className="text-xl font-bold">$4.5M</div>
                      <div className="text-xs text-muted-foreground">+32% YoY</div>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <div className="text-sm font-medium">Avg. Downtime</div>
                      <div className="text-xl font-bold">21 Days</div>
                      <div className="text-xs text-muted-foreground">-3 days YoY</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-semibold">Zero-Day Vulnerabilities</h3>
                  <p className="mt-2">
                    Zero-day vulnerabilities remain a critical concern, with 37 new discoveries in the past quarter.
                    Browser and operating system vulnerabilities account for 42% of these discoveries, followed by
                    networking equipment (28%) and IoT devices (18%).
                  </p>
                  <div className="mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Critical Severity</span>
                        <span className="text-sm font-medium">12</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-destructive" style={{ width: "32%" }}></div>
                      </div>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">High Severity</span>
                        <span className="text-sm font-medium">18</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-orange-500" style={{ width: "49%" }}></div>
                      </div>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Medium/Low Severity</span>
                        <span className="text-sm font-medium">7</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-yellow-500" style={{ width: "19%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-semibold">Emerging Threats</h3>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5">
                        NEW
                      </Badge>
                      <div>
                        <h4 className="font-medium">AI-Powered Phishing Campaigns</h4>
                        <p className="text-sm text-muted-foreground">
                          Sophisticated phishing attacks using AI to generate highly personalized content and evade
                          detection systems.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5">
                        NEW
                      </Badge>
                      <div>
                        <h4 className="font-medium">Supply Chain Poisoning</h4>
                        <p className="text-sm text-muted-foreground">
                          Increased targeting of software supply chains to distribute malware through trusted channels.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5">
                        RISING
                      </Badge>
                      <div>
                        <h4 className="font-medium">5G Infrastructure Attacks</h4>
                        <p className="text-sm text-muted-foreground">
                          Growing focus on exploiting vulnerabilities in 5G infrastructure to conduct large-scale
                          attacks.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* <div className="mt-6 flex justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Ready to secure your organization?</h2>
          <p className="mt-2 text-muted-foreground">
            Create an account to access personalized threat intelligence and incident management tools.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div> */}
    </div>
  )
}
