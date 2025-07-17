import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { getWindTurbines, calculateWindProduction } from "@/api/wind"
import { useToast } from "@/hooks/useToast"
import { Wind, MapPin, Zap, TrendingUp, Leaf, Calculator, Save } from "lucide-react"
import { LocationSelector } from "@/components/LocationSelector"
import { ResultsChart } from "@/components/ResultsChart"

interface WindTurbine {
  id: string
  name: string
  power: number
  hubHeight: number
  rotorDiameter: number
  cost: number
  isCustom: boolean
}

interface CalculationResult {
  dailyProduction: number
  monthlyProduction: number
  yearlyProduction: number
  capacityFactor: number
  co2Savings: number
  financialSavings: number
}

export function WindCalculator() {
  const [turbines, setTurbines] = useState<WindTurbine[]>([])
  const [selectedTurbine, setSelectedTurbine] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [location, setLocation] = useState<string>("")
  const [hubHeight, setHubHeight] = useState<number[]>([80])
  const [results, setResults] = useState<CalculationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTurbines = async () => {
      try {
        console.log('Fetching wind turbines...')
        const response = await getWindTurbines() as { turbines: WindTurbine[] }
        setTurbines(response.turbines)
        console.log('Wind turbines loaded:', response.turbines)
      } catch (error) {
        console.error('Error fetching wind turbines:', error)
        toast({
          title: "Error",
          description: "Failed to load wind turbines",
          variant: "destructive",
        })
      }
    }

    fetchTurbines()
  }, [])

  const handleCalculate = async () => {
    if (!selectedTurbine || !location) {
      toast({
        title: "Missing Information",
        description: "Please select a turbine type and location",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      console.log('Calculating wind production...')
      const response = await calculateWindProduction({
        turbineId: selectedTurbine,
        quantity,
        location,
        hubHeight: hubHeight[0]
      }) as CalculationResult

      setResults(response)
      console.log('Wind calculation completed:', response)
      toast({
        title: "Calculation Complete",
        description: "Wind energy production calculated successfully",
      })
    } catch (error) {
      console.error('Error calculating wind production:', error)
      toast({
        title: "Calculation Error",
        description: "Failed to calculate wind production",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedTurbineData = turbines.find(t => t.id === selectedTurbine)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Wind className="w-8 h-8 mr-3 text-blue-500" />
            Wind Calculator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Calculate wind energy production for turbine systems across Greece
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wind className="w-5 h-5 mr-2 text-blue-600" />
                Turbine Configuration
              </CardTitle>
              <CardDescription>Select and configure your wind turbine system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="turbine-type">Turbine Type</Label>
                  <Select value={selectedTurbine} onValueChange={setSelectedTurbine}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select turbine type" />
                    </SelectTrigger>
                    <SelectContent>
                      {turbines.map((turbine) => (
                        <SelectItem key={turbine.id} value={turbine.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{turbine.name}</span>
                            {turbine.isCustom && (
                              <Badge variant="secondary" className="ml-2">Custom</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Number of Turbines</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    max="50"
                  />
                </div>
              </div>

              {selectedTurbineData && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Turbine Specifications</h4>
                  <div className="grid gap-2 md:grid-cols-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Power:</span>
                      <span className="ml-2 font-medium">{selectedTurbineData.power / 1000}MW</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Hub Height:</span>
                      <span className="ml-2 font-medium">{selectedTurbineData.hubHeight}m</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Rotor Diameter:</span>
                      <span className="ml-2 font-medium">{selectedTurbineData.rotorDiameter}m</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Cost:</span>
                      <span className="ml-2 font-medium">€{(selectedTurbineData.cost / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Hub Height: {hubHeight[0]}m</Label>
                  <Slider
                    value={hubHeight}
                    onValueChange={setHubHeight}
                    max={150}
                    min={40}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>40m (Low)</span>
                    <span>150m (High)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <LocationSelector onLocationChange={setLocation} />

          <div className="flex space-x-4">
            <Button
              onClick={handleCalculate}
              disabled={loading || !selectedTurbine || !location}
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
                  Calculate Production
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
                    <Zap className="w-5 h-5 mr-2" />
                    Energy Production
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Daily:</span>
                      <span className="font-semibold text-blue-900">
                        {(results.dailyProduction / 1000).toFixed(1)} kWh
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Monthly:</span>
                      <span className="font-semibold text-blue-900">
                        {(results.monthlyProduction / 1000).toFixed(1)} kWh
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Yearly:</span>
                      <span className="font-semibold text-blue-900">
                        {(results.yearlyProduction / 1000).toFixed(1)} kWh
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-blue-200">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Capacity Factor:</span>
                      <span className="font-semibold text-blue-900">
                        {(results.capacityFactor * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <Leaf className="w-5 h-5 mr-2" />
                    Environmental Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">CO₂ Savings:</span>
                      <span className="font-semibold text-green-900">
                        {results.co2Savings.toFixed(1)} tons/year
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Equivalent Trees:</span>
                      <span className="font-semibold text-green-900">
                        {Math.round(results.co2Savings * 16)} trees
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
                      <span className="text-sm text-purple-700">Annual Savings:</span>
                      <span className="font-semibold text-purple-900">
                        €{results.financialSavings.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-700">System Cost:</span>
                      <span className="font-semibold text-purple-900">
                        €{selectedTurbineData ? ((selectedTurbineData.cost * quantity) / 1000000).toFixed(1) : 0}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-700">Payback Period:</span>
                      <span className="font-semibold text-purple-900">
                        {selectedTurbineData ?
                          Math.round((selectedTurbineData.cost * quantity) / results.financialSavings) : 0
                        } years
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ResultsChart data={results} type="wind" />
            </>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <Wind className="w-12 h-12 mx-auto mb-4 opacity-50" />
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