import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getDashboardOverview } from "@/api/dashboard"
import { useToast } from "@/hooks/useToast"
import {
  Calculator,
  TrendingUp,
  Leaf,
  MapPin,
  Thermometer,
  Eye,
  ArrowRight,
  Wind,
  Sun,
  Waves,
  Zap,
  BarChart3,
  Activity,
  Calendar,
  Target,
  Lightbulb
} from "lucide-react"
import { Link } from "react-router-dom"

interface DashboardData {
  stats: {
    savedScenarios: number
    totalEnergy: number
    co2Savings: number
  }
  recentCalculations: Array<{
    id: string
    type: string
    location: string
    date: string
    energy: number
  }>
  weather: {
    location: string
    temperature: number
    condition: string
    windSpeed: number
  }
}

export function Dashboard() {
  const { t } = useTranslation()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching dashboard data...')
        const response = await getDashboardOverview() as DashboardData
        setData(response)
        console.log('Dashboard data loaded:', response)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast({
          title: t('messages.error'),
          description: t('messages.failedToLoadDashboard'),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 sm:p-8 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{t('dashboard.title')}</h1>
                <p className="text-green-100 text-base sm:text-lg mt-2">
                  {t('dashboard.subtitle')}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Link to="/scenario-builder">
                <Button size="lg" className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Calculator className="w-5 h-5 mr-2" />
                  {t('dashboard.startScenarioBuilder')}
                </Button>
              </Link>
              <Link to="/history">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Προβολή Ιστορικού
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden xl:block">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/10 rounded-lg text-center">
                <Sun className="w-6 h-6 mx-auto mb-1 text-yellow-300" />
                <div className="text-xs">Ηλιακά</div>
              </div>
              <div className="p-3 bg-white/10 rounded-lg text-center">
                <Wind className="w-6 h-6 mx-auto mb-1 text-blue-300" />
                <div className="text-xs">Αιολικά</div>
              </div>
              <div className="p-3 bg-white/10 rounded-lg text-center">
                <Waves className="w-6 h-6 mx-auto mb-1 text-cyan-300" />
                <div className="text-xs">Υδροηλεκτρικά</div>
              </div>
              <div className="p-3 bg-white/10 rounded-lg text-center">
                <Zap className="w-6 h-6 mx-auto mb-1 text-purple-300" />
                <div className="text-xs">Συνδυασμένα</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.savedScenarios')}</CardTitle>
            <Eye className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data.stats.savedScenarios}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              {t('dashboard.totalSimulationsSaved')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.totalEnergy')}</CardTitle>
            <Zap className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {(data.stats.totalEnergy / 1000).toFixed(1)}k
            </div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Activity className="w-3 h-3 mr-1" />
              {t('dashboard.kWhCalculated')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.co2Savings')}</CardTitle>
            <Leaf className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data.stats.co2Savings}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Target className="w-3 h-3 mr-1" />
              {t('dashboard.tonsCO2Avoided')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.weather')}</CardTitle>
            <Thermometer className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data.weather.temperature}°C</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {data.weather.location}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
        {/* Recent Calculations */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-500" />
                {t('dashboard.recentCalculations')}
              </CardTitle>
              <CardDescription>Τελευταίες προσομοιώσεις ενεργειακών συστημάτων</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentCalculations.map((calc) => (
                  <div key={calc.id} className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className="p-2 rounded-full bg-blue-100 flex-shrink-0">
                        {calc.type === 'Solar' && <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />}
                        {calc.type === 'Wind' && <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
                        {calc.type === 'Combined' && <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />}
                        {!['Solar', 'Wind', 'Combined'].includes(calc.type) && <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{calc.type} - {calc.location}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {calc.date}
                          </span>
                          <Badge variant="secondary" className="mt-1 sm:mt-0 w-fit">Ολοκληρώθηκε</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base sm:text-lg font-bold text-gray-900">{(calc.energy / 1000).toFixed(1)}k</p>
                      <p className="text-xs sm:text-sm text-gray-500">kWh</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/history">
                <Button variant="outline" className="w-full mt-6">
                  {t('dashboard.viewAllHistory')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Weather */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                {t('dashboard.quickActions')}
              </CardTitle>
              <CardDescription>Γρήγορη πρόσβαση στα εργαλεία</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to="/scenario-builder">
                  <Button variant="outline" className="w-full justify-start h-12 hover:bg-blue-50">
                    <Calculator className="w-5 h-5 mr-3 text-blue-500" />
                    <div className="text-left">
                      <div className="font-semibold">{t('navigation.scenarioBuilder')}</div>
                      <div className="text-xs text-gray-500">Δημιουργία σεναρίων</div>
                    </div>
                  </Button>
                </Link>

                <Link to="/history">
                  <Button variant="outline" className="w-full justify-start h-12 hover:bg-green-50">
                    <BarChart3 className="w-5 h-5 mr-3 text-green-500" />
                    <div className="text-left">
                      <div className="font-semibold">{t('navigation.scenarioHistory')}</div>
                      <div className="text-xs text-gray-500">Προβολή ιστορικού</div>
                    </div>
                  </Button>
                </Link>

                <Link to="/technology">
                  <Button variant="outline" className="w-full justify-start h-12 hover:bg-purple-50">
                    <Leaf className="w-5 h-5 mr-3 text-purple-500" />
                    <div className="text-left">
                      <div className="font-semibold">{t('navigation.customTechnology')}</div>
                      <div className="text-xs text-gray-500">Προσαρμοσμένες τεχνολογίες</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Weather Widget */}
          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <MapPin className="w-5 h-5 mr-2" />
                {t('dashboard.currentWeather')} - {data.weather.location}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold mb-2">{data.weather.temperature}°C</div>
                  <div className="text-blue-100">{data.weather.condition}</div>
                  <div className="mt-2 text-sm text-blue-200">
                    Ιδανικές συνθήκες για ανανεώσιμη ενέργεια
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-blue-100 mb-2">
                    <Wind className="w-4 h-4 mr-2" />
                    {data.weather.windSpeed} km/h
                  </div>
                  <div className="text-sm text-blue-200">{t('dashboard.windSpeed')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}