import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/useToast"
import { Zap, Sun, Wind, Waves, TrendingUp, Leaf, Calculator, Save, PieChart } from "lucide-react"
import { LocationSelector } from "@/components/LocationSelector"

export function CombinedSystems() {
  const [location, setLocation] = useState<string>("")
  const [solarPercentage, setSolarPercentage] = useState<number[]>([40])
  const [windPercentage, setWindPercentage] = useState<number[]>([35])
  const [hydroPercentage, setHydroPercentage] = useState<number[]>([25])
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleCalculate = async () => {
    if (!location) {
      toast({
        title: "Missing Information",
        description: "Please select a location",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      console.log('Calculating combined system...')
      // Mock calculation
      setTimeout(() => {
        const mockResults = {
          totalProduction: 125000,
          dailyProduction: 342,
          monthlyProduction: 10400,
          yearlyProduction: 125000,
          co2Savings: 62.5,
          financialSavings: 15000,
          reliability: 0.92,
          systemCost: 2500000
        }
        setResults(mockResults)
        setLoading(false)
        toast({
          title: "Calculation Complete",
          description: "Combined system analysis completed successfully",
        })
      }, 1500)
    } catch (error) {
      console.error('Error calculating combined system:', error)
      toast({
        title: "Calculation Error",
        description: "Failed to calculate combined system",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const totalPercentage = solarPercentage[0] + windPercentage[0] + hydroPercentage[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Zap className="w-8 h-8 mr-3 text-purple-500" />
            Combined Energy Systems
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Optimize multi-source renewable energy integration
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                Energy Mix Configuration
              </CardTitle>
              <CardDescription>Adjust the percentage allocation for each energy source</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center">
                      <Sun className="w-4 h-4 mr-2 text-yellow-500" />
                      Solar Energy: {solarPercentage[0]}%
                    </Label>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {solarPercentage[0]}%
                    </Badge>
                  </div>
                  <Slider
                    value={solarPercentage}
                    onValueChange={setSolarPercentage}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center">
                      <Wind className="w-4 h-4 mr-2 text-blue-500" />
                      Wind Energy: {windPercentage[0]}%
                    </Label>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {windPercentage[0]}%
                    </Badge>
                  </div>
                  <Slider
                    value={windPercentage}
                    onValueChange={setWindPercentage}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center">
                      <Waves className="w-4 h-4 mr-2 text-cyan-500" />
                      Hydro Energy: {hydroPercentage[0]}%
                    </Label>
                    <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">
                      {hydroPercentage[0]}%
                    </Badge>
                  </div>
                  <Slider
                    value={hydroPercentage}
                    onValueChange={setHydroPercentage}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${
                totalPercentage === 100 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                  : 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Allocation:</span>
                  <Badge variant={totalPercentage === 100 ? "default" : "destructive"}>
                    {totalPercentage}%
                  </Badge>
                </div>
                {totalPercentage !== 100 && (
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                    Total must equal 100% for optimal system design
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <LocationSelector onLocationChange={setLocation} />

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>System Optimization</CardTitle>
              <CardDescription>Automated recommendations for your energy mix</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Complementary Generation</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Solar and wind energy complement each other well - solar peaks during day, wind often stronger at night
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Reliability Score</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Current mix provides 92% system reliability with good seasonal balance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button
              onClick={handleCalculate}
              disabled={loading || !location || totalPercentage !== 100}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Combined System
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
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-800">
                    <Zap className="w-5 h-5 mr-2" />
                    Combined Production
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-700">Daily:</span>
                      <span className="font-semibold text-purple-900">
                        {(results.dailyProduction).toFixed(0)} kWh
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-700">Monthly:</span>
                      <span className="font-semibold text-purple-900">
                        {(results.monthlyProduction / 1000).toFixed(1)} MWh
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-700">Yearly:</span>
                      <span className="font-semibold text-purple-900">
                        {(results.yearlyProduction / 1000).toFixed(0)} MWh
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-purple-200">
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-700">System Reliability:</span>
                      <span className="font-semibold text-purple-900">
                        {(results.reliability * 100).toFixed(1)}%
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
                        €{results.financialSavings.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">System Cost:</span>
                      <span className="font-semibold text-blue-900">
                        €{(results.systemCost / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Payback Period:</span>
                      <span className="font-semibold text-blue-900">
                        {Math.round(results.systemCost / results.financialSavings)} years
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
                  <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Configure your energy mix and calculate to see results</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}