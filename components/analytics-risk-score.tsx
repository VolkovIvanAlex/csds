"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Network Security", value: 35, color: "#8884d8" },
  { name: "Application Security", value: 25, color: "#82ca9d" },
  { name: "Data Protection", value: 20, color: "#ffc658" },
  { name: "User Access", value: 15, color: "#ff8042" },
  { name: "Physical Security", value: 5, color: "#0088FE" },
]

export function AnalyticsRiskScore() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
