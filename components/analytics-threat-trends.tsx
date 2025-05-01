"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", malware: 4, phishing: 7, ddos: 2, insider: 1 },
  { name: "Feb", malware: 3, phishing: 8, ddos: 1, insider: 2 },
  { name: "Mar", malware: 5, phishing: 6, ddos: 3, insider: 0 },
  { name: "Apr", malware: 7, phishing: 4, ddos: 2, insider: 1 },
  { name: "May", malware: 6, phishing: 5, ddos: 4, insider: 2 },
  { name: "Jun", malware: 8, phishing: 3, ddos: 1, insider: 3 },
  { name: "Jul", malware: 9, phishing: 4, ddos: 2, insider: 1 },
  { name: "Aug", malware: 7, phishing: 6, ddos: 3, insider: 2 },
  { name: "Sep", malware: 5, phishing: 8, ddos: 2, insider: 1 },
  { name: "Oct", malware: 6, phishing: 7, ddos: 1, insider: 2 },
  { name: "Nov", malware: 8, phishing: 5, ddos: 3, insider: 1 },
  { name: "Dec", malware: 9, phishing: 6, ddos: 2, insider: 2 },
]

export function AnalyticsThreatTrends() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="malware" name="Malware" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="phishing" name="Phishing" stroke="#82ca9d" />
        <Line type="monotone" dataKey="ddos" name="DDoS" stroke="#ffc658" />
        <Line type="monotone" dataKey="insider" name="Insider" stroke="#ff8042" />
      </LineChart>
    </ResponsiveContainer>
  )
}
