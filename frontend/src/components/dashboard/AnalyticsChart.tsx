'use client'

import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useTheme } from 'next-themes'

interface AnalyticsChartProps {
  data: any[]
  type: 'line' | 'area' | 'bar' | 'pie'
  title: string
  dataKey: string
  color?: string
  height?: number
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export function AnalyticsChart({ 
  data, 
  type, 
  title, 
  dataKey, 
  color = '#3b82f6', 
  height = 300 
}: AnalyticsChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  const tooltipStyle = {
    backgroundColor: isDark ? '#374151' : '#ffffff',
    border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    color: isDark ? '#f9fafb' : '#374151'
  }
  
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              className="text-xs text-gray-600 dark:text-gray-400"
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              className="text-xs text-gray-600 dark:text-gray-400"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={tooltipStyle}
              labelStyle={{ color: isDark ? '#f9fafb' : '#374151' }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        )

      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              className="text-xs text-gray-600 dark:text-gray-400"
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              className="text-xs text-gray-600 dark:text-gray-400"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={tooltipStyle}
              labelStyle={{ color: isDark ? '#f9fafb' : '#374151' }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fill={color}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        )

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              className="text-xs text-gray-600 dark:text-gray-400"
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              className="text-xs text-gray-600 dark:text-gray-400"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={tooltipStyle}
              labelStyle={{ color: isDark ? '#f9fafb' : '#374151' }}
            />
            <Bar 
              dataKey={dataKey} 
              fill={color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={tooltipStyle}
              labelStyle={{ color: isDark ? '#f9fafb' : '#374151' }}
            />
          </PieChart>
        )

      default:
        return <div>Chart type not supported</div>
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {title}
      </h3>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
