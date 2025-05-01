"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    malware: 4,
    phishing: 7,
    ddos: 2,
    insider: 1,
  },
  {
    name: "Feb",
    malware: 3,
    phishing: 8,
    ddos: 1,
    insider: 2,
  },
  {
    name: "Mar",
    malware: 5,
    phishing: 6,
    ddos: 3,
    insider: 0,
  },
  {
    name: "Apr",
    malware: 7,
    phishing: 4,
    ddos: 2,
    insider: 1,
  },
  {
    name: "May",
    malware: 6,
    phishing: 5,
    ddos: 4,
    insider: 2,
  },
  {
    name: "Jun",
    malware: 8,
    phishing: 3,
    ddos: 1,
    insider: 3,
  },
]

export function ThreatStats() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="malware" name="Malware" fill="#8884d8" />
        <Bar dataKey="phishing" name="Phishing" fill="#82ca9d" />
        <Bar dataKey="ddos" name="DDoS" fill="#ffc658" />
        <Bar dataKey="insider" name="Insider" fill="#ff8042" />
      </BarChart>
    </ResponsiveContainer>
  )
}
