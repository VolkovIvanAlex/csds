"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function PublicThreatStats({ data }) {
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
