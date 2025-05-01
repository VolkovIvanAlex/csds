"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", time: 4.2 },
  { name: "Feb", time: 4.5 },
  { name: "Mar", time: 4.1 },
  { name: "Apr", time: 3.8 },
  { name: "May", time: 3.5 },
  { name: "Jun", time: 3.2 },
  { name: "Jul", time: 3.0 },
  { name: "Aug", time: 3.1 },
  { name: "Sep", time: 3.3 },
  { name: "Oct", time: 3.2 },
  { name: "Nov", time: 3.0 },
  { name: "Dec", time: 2.8 },
]

export function AnalyticsResponseTime() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
        <Tooltip formatter={(value) => [`${value} hours`, "Response Time"]} />
        <Area type="monotone" dataKey="time" name="Response Time" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
