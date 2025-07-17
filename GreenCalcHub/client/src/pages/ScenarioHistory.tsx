import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getScenarioHistory, deleteScenario } from "@/api/scenarios"
import { useToast } from "@/hooks/useToast"
import { History, Search, Filter, Trash2, Eye, Download, Sun, Wind, Waves, Zap, Droplets } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Scenario {
  id: string
  name: string
  type: string
  location: string
  date: string
  energy: number
  cost: number
  co2Savings: number
}

export function ScenarioHistory() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [filteredScenarios, setFilteredScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        console.log('Fetching scenario history...')
        const response = await getScenarioHistory() as { scenarios: Scenario[] }
        setScenarios(response.scenarios)
        setFilteredScenarios(response.scenarios)
        console.log('Scenario history loaded:', response.scenarios)
      } catch (error) {
        console.error('Error fetching scenario history:', error)
        toast({
          title: "Error",
          description: "Failed to load scenario history",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchScenarios()
  }, [])

  useEffect(() => {
    let filtered = scenarios

    if (searchTerm) {
      filtered = filtered.filter(scenario =>
        scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scenario.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(scenario => scenario.type.toLowerCase() === typeFilter)
    }

    setFilteredScenarios(filtered)
  }, [searchTerm, typeFilter, scenarios])

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting scenario:', id)
      await deleteScenario(id)
      setScenarios(scenarios.filter(s => s.id !== id))
      toast({
        title: "Success",
        description: "Scenario deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting scenario:', error)
      toast({
        title: "Error",
        description: "Failed to delete scenario",
        variant: "destructive",
      })
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'solar': return <Sun className="w-4 h-4 text-yellow-500" />
      case 'wind': return <Wind className="w-4 h-4 text-blue-500" />
      case 'hydro': return <Waves className="w-4 h-4 text-cyan-500" />
      case 'combined': return <Zap className="w-4 h-4 text-purple-500" />
      case 'desalination': return <Droplets className="w-4 h-4 text-blue-600" />
      default: return <Zap className="w-4 h-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'solar': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'wind': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'hydro': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'combined': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'desalination': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Scenario History</h1>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <History className="w-8 h-8 mr-3 text-blue-500" />
            Scenario History
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            View and manage your saved energy calculations
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-gray-600" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search scenarios by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="solar">Solar</SelectItem>
                <SelectItem value="wind">Wind</SelectItem>
                <SelectItem value="hydro">Hydro</SelectItem>
                <SelectItem value="combined">Combined</SelectItem>
                <SelectItem value="desalination">Desalination</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-300">
          Showing {filteredScenarios.length} of {scenarios.length} scenarios
        </p>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Scenarios List */}
      <div className="grid gap-4">
        {filteredScenarios.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center text-gray-500">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No scenarios found matching your criteria</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredScenarios.map((scenario) => (
            <Card key={scenario.id} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getTypeIcon(scenario.type)}
                      <h3 className="text-lg font-semibold">{scenario.name}</h3>
                      <Badge className={getTypeColor(scenario.type)}>
                        {scenario.type}
                      </Badge>
                    </div>
                    <div className="grid gap-2 md:grid-cols-4 text-sm text-gray-600 dark:text-gray-300">
                      <div>
                        <span className="font-medium">Location:</span> {scenario.location}
                      </div>
                      <div>
                        <span className="font-medium">Energy:</span> {(scenario.energy / 1000).toFixed(1)}k kWh
                      </div>
                      <div>
                        <span className="font-medium">Cost:</span> €{scenario.cost.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">CO₂ Saved:</span> {scenario.co2Savings} tons
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Created on {new Date(scenario.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white dark:bg-gray-900">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Scenario</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{scenario.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(scenario.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}