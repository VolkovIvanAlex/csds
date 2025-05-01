// Mock users for authentication
export const mockUsers = [
  {
    id: "user-1",
    email: "admin@cybershield.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    organization: "CyberShield Inc.",
    jobTitle: "Security Administrator",
    avatar: "/avatars/admin-avatar.png",
  },
  {
    id: "user-2",
    email: "analyst@cybershield.com",
    password: "analyst123",
    firstName: "Security",
    lastName: "Analyst",
    role: "analyst",
    organization: "CyberShield Inc.",
    jobTitle: "Security Analyst",
    avatar: "/avatars/analyst-avatar.png",
  },
  {
    id: "user-3",
    email: "user@cybershield.com",
    password: "user123",
    firstName: "Regular",
    lastName: "User",
    role: "user",
    organization: "Client Corp",
    jobTitle: "IT Manager",
    avatar: "/avatars/user-avatar.png",
  },
  {
    id: "user-4",
    email: "demo@cybershield.com",
    password: "demo123",
    firstName: "Demo",
    lastName: "Account",
    role: "demo",
    organization: "Demo Organization",
    jobTitle: "Demo User",
    avatar: "/avatars/demo-avatar.png",
  },
]

// Global threat statistics for public dashboard
export const globalThreatStats = [
  {
    name: "Jan",
    malware: 245,
    phishing: 388,
    ddos: 103,
    insider: 42,
  },
  {
    name: "Feb",
    malware: 278,
    phishing: 352,
    ddos: 87,
    insider: 51,
  },
  {
    name: "Mar",
    malware: 312,
    phishing: 376,
    ddos: 142,
    insider: 39,
  },
  {
    name: "Apr",
    malware: 287,
    phishing: 401,
    ddos: 118,
    insider: 47,
  },
  {
    name: "May",
    malware: 356,
    phishing: 429,
    ddos: 97,
    insider: 62,
  },
  {
    name: "Jun",
    malware: 391,
    phishing: 375,
    ddos: 126,
    insider: 58,
  },
]

// Global risk assessment data for public dashboard
export const globalRiskData = [
  { name: "Critical", value: 18, color: "#ef4444" },
  { name: "High", value: 27, color: "#f97316" },
  { name: "Medium", value: 32, color: "#eab308" },
  { name: "Low", value: 23, color: "#22c55e" },
]

// Recent global incidents for public dashboard
export const globalRecentIncidents = [
  {
    id: "GLOB-001",
    title: "Major Ransomware Campaign Targeting Healthcare",
    type: "Ransomware",
    severity: "Critical",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    affectedSector: "Healthcare",
    region: "Global",
  },
  {
    id: "GLOB-002",
    title: "Supply Chain Attack on Software Provider",
    type: "Supply Chain",
    severity: "High",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    affectedSector: "Technology",
    region: "North America, Europe",
  },
  {
    id: "GLOB-003",
    title: "Critical Vulnerability in Popular Web Framework",
    type: "Vulnerability",
    severity: "High",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    affectedSector: "Multiple",
    region: "Global",
  },
  {
    id: "GLOB-004",
    title: "State-Sponsored APT Campaign Discovered",
    type: "APT",
    severity: "Critical",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    affectedSector: "Government, Defense",
    region: "Asia, Middle East",
  },
  {
    id: "GLOB-005",
    title: "Large-Scale DDoS Attack on Financial Services",
    type: "DDoS",
    severity: "Medium",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    affectedSector: "Financial",
    region: "Europe",
  },
]

// Global security news for public dashboard
export const globalSecurityNews = [
  {
    id: "NEWS-G001",
    title: "New International Cybersecurity Coalition Formed",
    source: "Global Security Times",
    category: "Policy",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    summary: "Major nations form new coalition to combat rising cyber threats and establish global standards.",
    logo: "/news-logos/global-security-times.png",
  },
  {
    id: "NEWS-G002",
    title: "Critical Zero-Day Vulnerability Affects Millions of Devices",
    source: "Cyber Defense Review",
    category: "Vulnerability",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    summary: "Researchers discover severe vulnerability affecting IoT devices worldwide. Patch released.",
    logo: "/news-logos/cyber-defense-review.png",
  },
  {
    id: "NEWS-G003",
    title: "Ransomware Attacks Increased 300% in Q2 2023",
    source: "Threat Intelligence Network",
    category: "Threat",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    summary: "New report shows alarming rise in ransomware attacks targeting critical infrastructure.",
    logo: "/news-logos/threat-intelligence-network.png",
  },
  {
    id: "NEWS-G004",
    title: "AI-Powered Security Solutions Show Promise in Early Tests",
    source: "Tech Security Today",
    category: "Technology",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    summary: "New generation of AI-based security tools demonstrate 85% improvement in threat detection.",
    logo: "/news-logos/tech-security-today.png",
  },
]

// Threat map data for public dashboard
export const threatMapData = [
  { id: 1, country: "United States", attacks: 1245, lat: 37.0902, lng: -95.7129 },
  { id: 2, country: "China", attacks: 1089, lat: 35.8617, lng: 104.1954 },
  { id: 3, country: "Russia", attacks: 986, lat: 61.524, lng: 105.3188 },
  { id: 4, country: "Germany", attacks: 754, lat: 51.1657, lng: 10.4515 },
  { id: 5, country: "United Kingdom", attacks: 682, lat: 55.3781, lng: -3.436 },
  { id: 6, country: "Brazil", attacks: 578, lat: -14.235, lng: -51.9253 },
  { id: 7, country: "India", attacks: 543, lat: 20.5937, lng: 78.9629 },
  { id: 8, country: "Japan", attacks: 489, lat: 36.2048, lng: 138.2529 },
  { id: 9, country: "Australia", attacks: 367, lat: -25.2744, lng: 133.7751 },
  { id: 10, country: "Canada", attacks: 342, lat: 56.1304, lng: -106.3468 },
]

// Industry vulnerability data for public dashboard
export const industryVulnerabilityData = [
  { name: "Financial", vulnerabilities: 876, exploited: 312 },
  { name: "Healthcare", vulnerabilities: 743, exploited: 289 },
  { name: "Government", vulnerabilities: 692, exploited: 245 },
  { name: "Technology", vulnerabilities: 1245, exploited: 387 },
  { name: "Manufacturing", vulnerabilities: 543, exploited: 176 },
  { name: "Energy", vulnerabilities: 487, exploited: 203 },
  { name: "Retail", vulnerabilities: 412, exploited: 134 },
  { name: "Education", vulnerabilities: 376, exploited: 98 },
]

// Attack vector distribution for public dashboard
export const attackVectorDistribution = [
  { name: "Phishing", value: 32 },
  { name: "Vulnerability Exploit", value: 24 },
  { name: "Credential Theft", value: 18 },
  { name: "Social Engineering", value: 12 },
  { name: "Supply Chain", value: 8 },
  { name: "Other", value: 6 },
]
