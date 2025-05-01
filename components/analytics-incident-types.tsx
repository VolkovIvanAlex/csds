"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Phishing", value: 42, color: "#8884d8" },
  { name: "Malware", value: 28, color: "#82ca9d" },
  { name: "Unauthorized Access", value: 15, color: "#ffc658" },
  { name: "Data Breach", value: 10, color: "#ff8042" },
  { name: "DDoS", value: 5, color: "#0088FE" },
]

export function AnalyticsIncidentTypes() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
