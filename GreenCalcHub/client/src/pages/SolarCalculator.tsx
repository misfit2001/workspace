import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getSolarPanels, calculateSolarProduction } from "@/api/solar"
import { getGreekRegions } from "@/api/dashboard"
import { useToast } from "@/hooks/useToast"
import { Sun, MapPin, Zap, TrendingUp, Leaf, Calculator, Save } from "lucide-react"
import { LocationSelector } from "@/components/LocationSelector"
import { ResultsChart } from "@/components/ResultsChart"

interface SolarPanel {
  id: string
  name: string
  type: string
  efficiency: number
  wattage: number
  cost: number
  isCustom: boolean
}

interface CalculationResult {
  dailyProduction: number
  monthlyProduction: number
  yearlyProduction: number
  peakPower: number
  capacityFactor: number
  co2Savings: number
  financialSavings: number
}

export function SolarCalculator() {
  const [panels, setPanels] = useState<SolarPanel[]>([])
  const [selectedPanel, setSelectedPanel] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(10)
  const [location, setLocation] = useState<string>("")
  const [angle, setAngle] = useState<number[]>([30])
  const [orientation, setOrientation] = useState<number[]>([180])
  const [shadingFactor, setShadingFactor] = useState<number[]>([0])
  const [results, setResults] = useState<CalculationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPanels = async () => {
      try {
        console.log('Fetching solar panels...')
        const response = await getSolarPanels() as { panels: SolarPanel[] }
        setPanels(response.panels)
        console.log('Solar panels loaded:', response.panels)
      } catch (error) {
        console.error('Error fetching solar panels:', error)
        toast({
          title: "Error",
          description: "Failed to load solar panels",
          variant: "destructive",
        })
      }
    }

    fetchPanels()
  }, [])

  const handleCalculate = async () => {
    if (!selectedPanel || !location) {
      toast({
        title: "Missing Information",
        description: "Please select a panel type and location",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      console.log('Calculating solar production...')
      const response = await calculateSolarProduction({
        panelId: selectedPanel,
        quantity,
        location,
        angle: angle[0],
        orientation: orientation[0],
        shadingFactor: shadingFactor[0]
      }) as CalculationResult

      setResults(response)
      console.log('Solar calculation completed:', response)
      toast({
        title: "Calculation Complete",
        description: "Solar energy production calculated successfully",
      })
    } catch (error) {
      console.error('Error calculating solar production:', error)
      toast({
        title: "Calculation Error",
        description: "Failed to calculate solar production",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedPanelData = panels.find(p => p.id === selectedPanel)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Sun className="w-8 h-8 mr-3 text-yellow-500" />
            Solar Calculator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Calculate solar energy production for photovoltaic systems across Greece
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sun className="w-5 h-5 mr-2 text-yellow-600" />
                Panel Configuration
              </CardTitle>
              <CardDescription>Select and configure your solar panel system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="panel-type">Panel Type</Label>
                  <Select value={selectedPanel} onValueChange={setSelectedPanel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select panel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {panels.map((panel) => (
                        <SelectItem key={panel.id} value={panel.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{panel.name}</span>
                            {panel.isCustom && (
                              <Badge variant="secondary" className="ml-2">Custom</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Number of Panels</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    max="1000"
                  />
                </div>
              </div>

              {selectedPanelData && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Panel Specifications</h4>
                  <div className="grid gap-2 md:grid-cols-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Efficiency:</span>
                      <span className="ml-2 font-medium">{selectedPanelData.efficiency}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Wattage:</span>
                      <span className="ml-2 font-medium">{selectedPanelData.wattage}W</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Cost:</span>
                      <span className="ml-2 font-medium">€{selectedPanelData.cost}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Installation Angle: {angle[0]}°</Label>
                  <Slider
                    value={angle}
                    onValueChange={setAngle}
                    max={90}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0° (Flat)</span>
                    <span>90° (Vertical)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Orientation: {orientation[0]}° (South = 180°)</Label>
                  <Slider
                    value={orientation}
                    onValueChange={setOrientation}
                    max={360}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0° (North)</span>
                    <span>180° (South)</span>
                    <span>360° (North)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Shading Factor: {shadingFactor[0]}%</Label>
                  <Slider
                    value={shadingFactor}
                    onValueChange={setShadingFactor}
                    max={50}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0% (No Shading)</span>
                    <span>50% (Heavy Shading)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <LocationSelector onLocationChange={setLocation} />

          <div className="flex space-x-4">
            <Button
              onClick={handleCalculate}
              disabled={loading || !selectedPanel || !location}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
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

        {/* Results Panel */}
        <div className="space-y-6">
          {results ? (
            <>
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-800">
                    <Zap className="w-5 h-5 mr-2" />
                    Energy Production
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-700">Daily:</span>
                      <span className="font-semibold text-yellow-900">
                        {(results.dailyProduction / 1000).toFixed(1)} kWh
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-700">Monthly:</span>
                      <span className="font-semibold text-yellow-900">
                        {(results.monthlyProduction / 1000).toFixed(1)} kWh
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-700">Yearly:</span>
                      <span className="font-semibold text-yellow-900">
                        {(results.yearlyProduction / 1000).toFixed(1)} kWh
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-yellow-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-yellow-700">Peak Power:</span>
                      <span className="font-semibold text-yellow-900">
                        {(results.peakPower / 1000).toFixed(1)} kW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-700">Capacity Factor:</span>
                      <span className="font-semibold text-yellow-900">
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

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Financial Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Annual Savings:</span>
                      <span className="font-semibold text-blue-900">
                        €{results.financialSavings.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">System Cost:</span>
                      <span className="font-semibold text-blue-900">
                        €{selectedPanelData ? (selectedPanelData.cost * quantity).toLocaleString() : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Payback Period:</span>
                      <span className="font-semibold text-blue-900">
                        {selectedPanelData ?
                          Math.round((selectedPanelData.cost * quantity) / results.financialSavings) : 0
                        } years
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ResultsChart data={results} type="solar" />
            </>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <Sun className="w-12 h-12 mx-auto mb-4 opacity-50" />
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