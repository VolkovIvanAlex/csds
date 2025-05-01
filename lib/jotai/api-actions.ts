import {
  globalThreatStats,
  globalRiskData,
  globalRecentIncidents,
  globalSecurityNews,
  threatMapData,
  industryVulnerabilityData,
  attackVectorDistribution,
} from "../mock-data"

// Simulated API delay
const apiDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Get global threat statistics
export const getGlobalThreatStats = async () => {
  await apiDelay(800)
  return globalThreatStats
}

// Get global risk assessment data
export const getGlobalRiskData = async () => {
  await apiDelay(600)
  return globalRiskData
}

// Get recent global incidents
export const getGlobalRecentIncidents = async () => {
  await apiDelay(700)
  return globalRecentIncidents
}

// Get global security news
export const getGlobalSecurityNews = async () => {
  await apiDelay(500)
  return globalSecurityNews
}

// Get threat map data
export const getThreatMapData = async () => {
  await apiDelay(900)
  return threatMapData
}

// Get industry vulnerability data
export const getIndustryVulnerabilityData = async () => {
  await apiDelay(750)
  return industryVulnerabilityData
}

// Get attack vector distribution
export const getAttackVectorDistribution = async () => {
  await apiDelay(650)
  return attackVectorDistribution
}

// Get user-specific threat statistics
export const getUserThreatStats = async (userId: string) => {
  await apiDelay(800)
  // In a real app, this would fetch user-specific data
  // For now, we'll return a modified version of the global data
  return globalThreatStats.map((stat) => ({
    ...stat,
    malware: Math.floor(stat.malware * 0.3),
    phishing: Math.floor(stat.phishing * 0.3),
    ddos: Math.floor(stat.ddos * 0.3),
    insider: Math.floor(stat.insider * 0.3),
  }))
}

// Get user-specific risk assessment
export const getUserRiskAssessment = async (userId: string) => {
  await apiDelay(700)
  // In a real app, this would fetch user-specific data
  return globalRiskData
}

// Get user reports
export const getUserReports = async (userId: string, filters = {}) => {
  await apiDelay(800)
  // In a real app, this would fetch user-specific reports with filters
  return globalRecentIncidents.slice(0, 3).map((incident) => ({
    ...incident,
    id: `USER-${incident.id}`,
    title: `Your Organization: ${incident.title}`,
  }))
}

// Submit a new report
export const submitReport = async (reportData: any) => {
  await apiDelay(1200)

  // Generate a report ID
  const reportId = `REP-${Date.now().toString().substring(7)}`

  // In a real app, this would save the report to a database
  return {
    id: reportId,
    ...reportData,
    date: new Date().toISOString(),
    status: "Pending",
  }
}

// Update an existing report
export const updateReport = async (reportId: string, reportData: any) => {
  await apiDelay(1000)

  // In a real app, this would update the report in a database
  return {
    id: reportId,
    ...reportData,
    updatedAt: new Date().toISOString(),
  }
}

// Delete a report
export const deleteReport = async (reportId: string) => {
  await apiDelay(800)

  // In a real app, this would delete the report from a database
  return { success: true }
}

// Share a report with another user
export const shareReport = async (reportId: string, userEmail: string, permission: "read" | "edit" = "read") => {
  await apiDelay(900)

  // In a real app, this would update sharing permissions in a database
  return {
    success: true,
    message: `Report shared with ${userEmail}`,
  }
}
