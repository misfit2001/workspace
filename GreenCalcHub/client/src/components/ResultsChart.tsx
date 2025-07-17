import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp } from "lucide-react"
import { useTranslation } from "react-i18next"

interface ResultsChartProps {
  data: any
  type: 'solar' | 'wind' | 'hydro' | 'combined'
}

export function ResultsChart({ data, type }: ResultsChartProps) {
  const { t } = useTranslation()
  
  const monthlyData = [
    { month: 'Ιαν', production: data.monthlyProduction * 0.7 },
    { month: 'Φεβ', production: data.monthlyProduction * 0.8 },
    { month: 'Μαρ', production: data.monthlyProduction * 0.9 },
    { month: 'Απρ', production: data.monthlyProduction * 1.1 },
    { month: 'Μάι', production: data.monthlyProduction * 1.3 },
    { month: 'Ιουν', production: data.monthlyProduction * 1.4 },
    { month: 'Ιουλ', production: data.monthlyProduction * 1.5 },
    { month: 'Αυγ', production: data.monthlyProduction * 1.4 },
    { month: 'Σεπ', production: data.monthlyProduction * 1.2 },
    { month: 'Οκτ', production: data.monthlyProduction * 1.0 },
    { month: 'Νοε', production: data.monthlyProduction * 0.8 },
    { month: 'Δεκ', production: data.monthlyProduction * 0.6 },
  ]

  const getColor = () => {
    switch (type) {
      case 'solar': return '#f59e0b'
      case 'wind': return '#3b82f6'
      case 'hydro': return '#06b6d4'
      case 'combined': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" style={{ color: getColor() }} />
          Μηνιαία Παραγωγή
        </CardTitle>
        <CardDescription>Παραγωγή ενέργειας καθ' όλη τη διάρκεια του έτους</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${(value / 1000).toFixed(1)} kWh`, 'Παραγωγή']}
              />
              <Bar dataKey="production" fill={getColor()} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}