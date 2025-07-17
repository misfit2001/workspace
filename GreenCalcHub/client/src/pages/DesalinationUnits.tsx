import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/useToast"
import { Droplets, Zap, TrendingUp, Leaf, Calculator, Save, Battery } from "lucide-react"
import { LocationSelector } from "@/components/LocationSelector"

export function DesalinationUnits() {
  const [location, setLocation] = useState<string>("")
  const [technology, setTechnology] = useState<string>("")
  const [dailyProduction, setDailyProduction] = useState<number>(1000)
  const [energySource, setEnergySource] = useState<string>("")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const technologies = [
    { id: 'ro', name: 'Reverse Osmosis', efficiency: 0.85, energyConsumption: 3.5 },
    { id: 'thermal', name: 'Thermal Distillation', efficiency: 0.75, energyConsumption: 5.2 },
    { id: 'hybrid', name: 'Hybrid RO-Thermal', efficiency: 0.90, energyConsumption: 4.1 }
  ]

  const energySources = [
    { id: 'solar', name: 'Solar Power', color: 'yellow' },
    { id: 'wind', name: 'Wind Power', color: 'blue' },
    { id: 'hydro', name: 'Hydro Power', color: 'cyan' },
    { id: 'combined', name: 'Combined System', color: 'purple' }
  ]

  const handleCalculate = async () => {
    if (!location || !technology || !energySource) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      console.log('Calculating desalination system...')
      // Mock calculation
      setTimeout(() => {
        const selectedTech = technologies.find(t => t.id === technology)
        const dailyEnergyConsumption = dailyProduction * (selectedTech?.energyConsumption || 4)
        
        const mockResults = {
          dailyWaterProduction: dailyProduction,
          monthlyWaterProduction: dailyProduction * 30,
          yearlyWaterProduction: dailyProduction * 365,
          dailyEnergyConsumption,
          monthlyEnergyConsumption: dailyEnergyConsumption * 30,
          yearlyEnergyConsumption: dailyEnergyConsumption * 365,
          waterCostSavings: dailyProduction * 365 * 0.002, // €2 per m³
          operationalCost: dailyEnergyConsumption * 365 * 0.12, // €0.12 per kWh
          systemCost: 500000,
          autonomyPercentage: 85
        }
        setResults(mockResults)
        setLoading(false)
        toast({
          title: "Calculation Complete",
          description: "Desalination system analysis completed successfully",
        })
      }, 1500)
    } catch (error) {
      console.error('Error calculating desalination system:', error)
      toast({
        title: "Calculation Error",
        description: "Failed to calculate desalination system",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const selectedTechnology = technologies.find(t => t.id === technology)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Droplets className="w-8 h-8 mr-3 text-blue-500" />
            Desalination Units
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Design renewable energy-powered desalination systems
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Droplets className="w-5 h-5 mr-2 text-blue-600" />
                Desalination Configuration
              </CardTitle>
              <CardDescription>Configure your desalination system parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="technology">Desalination Technology</Label>
                  <Select value={technology} onValueChange={setTechnology}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select technology" />
                    </SelectTrigger>
                    <SelectContent>
                      {technologies.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="production">Daily Water Production (m³)</Label>
                  <Input
                    id="production"
                    type="number"
                    value={dailyProduction}
                    onChange={(e) => setDailyProduction(Number(e.target.value))}
                    min="100"
                    max="10000"
                    step="100"
                  />
                </div>
              </div>

              {selectedTechnology && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Technology Specifications</h4>
                  <div className="grid gap-2 md:grid-cols-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Efficiency:</span>
                      <span className="ml-2 font-medium">{(selectedTechnology.efficiency * 100).toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Energy Consumption:</span>
                      <span className="ml-2 font-medium">{selectedTechnology.energyConsumption} kWh/m³</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="energy-source">Energy Source</Label>
                <Select value={energySource} onValueChange={setEnergySource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select energy source" />
                  </SelectTrigger>
                  <SelectContent>
                    {energySources.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <LocationSelector onLocationChange={setLocation} />

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Battery className="w-5 h-5 mr-2 text-green-600" />
                Energy Storage & Autonomy
              </CardTitle>
              <CardDescription>Energy buffer and self-sufficiency analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Storage Requirements</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Recommended 48-hour energy storage for continuous operation during low renewable generation periods
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Water Storage</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Minimum 3-day water storage capacity recommended for emergency backup scenarios
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button
              onClick={handleCalculate}
              disabled={loading || !location || !technology || !energySource}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate System
                </>
              )}
            </Button>

            {results && (
              <Button variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Save Scenario
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {results ? (
            <>
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800">
                    <Droplets className="w-5 h-5 mr-2" />
                    Water Production
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Daily:</span>
                      <span className="font-semibold text-blue-900">
                        {results.dailyWaterProduction.toLocaleString()} m³
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Monthly:</span>
                      <span className="font-semibold text-blue-900">
                        {results.monthlyWaterProduction.toLocaleString()} m³
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Yearly:</span>
                      <span className="font-semibold text-blue-900">
                        {results.yearlyWaterProduction.toLocaleString()} m³
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-800">
                    <Zap className="w-5 h-5 mr-2" />
                    Energy Consumption
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-700">Daily:</span>
                      <span className="font-semibold text-yellow-900">
                        {results.dailyEnergyConsumption.toFixed(0)} kWh
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-700">Monthly:</span>
                      <span className="font-semibold text-yellow-900">
                        {(results.monthlyEnergyConsumption / 1000).toFixed(1)} MWh
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-700">Yearly:</span>
                      <span className="font-semibold text-yellow-900">
                        {(results.yearlyEnergyConsumption / 1000).toFixed(1)} MWh
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <Battery className="w-5 h-5 mr-2" />
                    Autonomy Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Self-Sufficiency:</span>
                      <span className="font-semibold text-green-900">
                        {results.autonomyPercentage}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Grid Dependency:</span>
                      <span className="font-semibold text-green-900">
                        {100 - results.autonomyPercentage}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-800">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Financial Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-700">Water Savings:</span>
                      <span className="font-semibold text-purple-900">
                        €{results.waterCostSavings.toFixed(0)}/year
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-700">Operational Cost:</span>
                      <span className="font-semibold text-purple-900">
                        €{results.operationalCost.toFixed(0)}/year
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-700">Net Savings:</span>
                      <span className="font-semibold text-purple-900">
                        €{(results.waterCostSavings - results.operationalCost).toFixed(0)}/year
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-700">System Cost:</span>
                      <span className="font-semibold text-purple-900">
                        €{(results.systemCost / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <Droplets className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Configure your system and calculate to see results</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}