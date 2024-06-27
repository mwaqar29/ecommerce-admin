"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface OverviewProps {
  data: any[]
}

const Overview: React.FC<OverviewProps> = ({ data }) => {
  const { theme } = useTheme()

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke={theme === "dark" ? "#cfcfcf" : "#123123"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={theme === "dark" ? "#cfcfcf" : "#123123"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Overview
