import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/useToast"
import { useTranslation } from "react-i18next"
import {
  Calculator,
  Save,
  Play,
  Sun,
  Wind,
  Waves,
  Battery,
  Home,
  Car,
  Droplets,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Settings,
  Lightbulb
} from "lucide-react"
import { LocationSelector } from "@/components/LocationSelector"

export function ScenarioBuilder() {
  const { t } = useTranslation()
  const { toast } = useToast()

  const [scenarioName, setScenarioName] = useState("")
  const [location, setLocation] = useState("")
  const [population, setPopulation] = useState(1000)
  const [duration, setDuration] = useState(25)

  // Producers
  const [solarPanels, setSolarPanels] = useState(100)
  const [windTurbines, setWindTurbines] = useState(5)
  const [hydroTurbines, setHydroTurbines] = useState(2)

  // Storage
  const [batteries, setBatteries] = useState(50)
  const [hydrogenStorage, setHydrogenStorage] = useState(10)

  // Consumers
  const [buildings, setBuildings] = useState(200)
  const [evChargers, setEvChargers] = useState(20)
  const [desalinationPlant, setDesalinationPlant] = useState(1)

  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    if (!scenarioName.trim() || !location) {
      toast({
        title: t('messages.missingInformation'),
        description: t('messages.fillAllFields'),
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Mock calculation
      setTimeout(() => {
        const totalProduction = (solarPanels * 400 * 365) + (windTurbines * 2000000) + (hydroTurbines * 1000000)
        const totalConsumption = (buildings * 3000) + (evChargers * 50000) + (desalinationPlant * 1000000)
        const balance = totalProduction - totalConsumption

        const mockResults = {
          totalProduction,
          totalConsumption,
          balance,
          storageCapacity: (batteries * 100) + (hydrogenStorage * 1000),
          co2Savings: totalProduction * 0.0005,
          financialSavings: balance * 0.12
        }

        setResults(mockResults)
        setLoading(false)
        toast({
          title: t('messages.calculationComplete'),
          description: t('messages.scenarioCalculationComplete'),
        })
      }, 2000)
    } catch (error) {
      console.error('Error calculating scenario:', error)
      toast({
        title: t('messages.calculationError'),
        description: t('messages.failedToCalculate'),
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!scenarioName.trim()) {
      toast({
        title: t('messages.missingInformation'),
        description: t('messages.missingScenarioName'),
        variant: "destructive",
      })
      return
    }

    try {
      // Mock save
      setTimeout(() => {
        toast({
          title: t('messages.scenarioSaved'),
          description: t('messages.scenarioSavedSuccess', { name: scenarioName }),
        })
      }, 1000)
    } catch (error) {
      toast({
        title: t('messages.error'),
        description: t('messages.failedToSaveScenario'),
        variant: "destructive",
      })
    }
  }

  const getBalanceIcon = () => {
    if (!results) return <Minus className="w-5 h-5" />
    if (results.balance > 0) return <TrendingUp className="w-5 h-5 text-green-600" />
    if (results.balance < 0) return <TrendingDown className="w-5 h-5 text-red-600" />
    return <Minus className="w-5 h-5 text-yellow-600" />
  }

  const getBalanceMessage = () => {
    if (!results) return ""
    if (results.balance > results.totalProduction * 0.1) return t('scenarioBuilder.positiveBalance')
    if (results.balance < -results.totalConsumption * 0.1) return t('scenarioBuilder.negativeBalance')
    return t('scenarioBuilder.nearZeroBalance')
  }

  const getOptimizationSuggestions = () => {
    if (!results || results.balance >= 0) return []
    
    const deficit = Math.abs(results.balance)
    const suggestions = []
    
    if (deficit > 1000000) {
      suggestions.push(`Προσθέστε ${Math.ceil(deficit / 2000000)} επιπλέον ανεμογεννήτριες`)
    }
    if (deficit > 500000) {
      suggestions.push(`Προσθέστε ${Math.ceil(deficit / (400 * 365))} επιπλέον ηλιακά πάνελ`)
    }
    if (buildings > 100) {
      suggestions.push(`Μειώστε την κατανάλωση κτιρίων κατά 20% με ενεργειακές αναβαθμίσεις`)
    }
    
    return suggestions
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Calculator className="w-8 h-8 mr-3 text-purple-500" />
            {t('scenarioBuilder.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {t('scenarioBuilder.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Scenario Configuration */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                <Settings className="w-5 h-5 mr-2" />
                {t('scenarioBuilder.scenarioConfiguration')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scenario-name">Όνομα Σεναρίου</Label>
                  <Input
                    id="scenario-name"
                    placeholder={t('scenarioBuilder.enterScenarioName')}
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="population">{t('scenarioBuilder.population')}</Label>
                  <Input
                    id="population"
                    type="number"
                    value={population}
                    onChange={(e) => setPopulation(Number(e.target.value))}
                    min="100"
                    max="100000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('scenarioBuilder.duration')}: {duration} έτη</Label>
                <Slider
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <LocationSelector onLocationChange={setLocation} />

          {/* Producers, Storage, Consumers Tabs */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <Tabs defaultValue="producers" className="w-full">
                <div className="border-b bg-gray-50/50 p-4">
                  <TabsList className="grid w-full grid-cols-3 bg-white">
                    <TabsTrigger value="producers" className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>{t('scenarioBuilder.producers')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="storage" className="flex items-center space-x-2">
                      <Battery className="w-4 h-4 text-blue-500" />
                      <span>{t('scenarioBuilder.storage')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="consumers" className="flex items-center space-x-2">
                      <Home className="w-4 h-4 text-red-500" />
                      <span>{t('scenarioBuilder.consumers')}</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  <TabsContent value="producers" className="mt-0 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="flex items-center">
                          <Sun className="w-4 h-4 mr-2 text-yellow-500" />
                          {t('scenarioBuilder.solarPanels')}: {solarPanels}
                        </Label>
                        <Slider
                          value={[solarPanels]}
                          onValueChange={(value) => setSolarPanels(value[0])}
                          max={1000}
                          min={0}
                          step={10}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center">
                          <Wind className="w-4 h-4 mr-2 text-blue-500" />
                          {t('scenarioBuilder.windTurbines')}: {windTurbines}
                        </Label>
                        <Slider
                          value={[windTurbines]}
                          onValueChange={(value) => setWindTurbines(value[0])}
                          max={50}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center">
                          <Waves className="w-4 h-4 mr-2 text-cyan-500" />
                          {t('scenarioBuilder.hydroTurbines')}: {hydroTurbines}
                        </Label>
                        <Slider
                          value={[hydroTurbines]}
                          onValueChange={(value) => setHydroTurbines(value[0])}
                          max={20}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="storage" className="mt-0 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="flex items-center">
                          <Battery className="w-4 h-4 mr-2 text-green-500" />
                          {t('scenarioBuilder.batteries')}: {batteries} MWh
                        </Label>
                        <Slider
                          value={[batteries]}
                          onValueChange={(value) => setBatteries(value[0])}
                          max={500}
                          min={0}
                          step={10}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-purple-500" />
                          {t('scenarioBuilder.hydrogenStorage')}: {hydrogenStorage} τόνοι
                        </Label>
                        <Slider
                          value={[hydrogenStorage]}
                          onValueChange={(value) => setHydrogenStorage(value[0])}
                          max={100}
                          min={0}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="consumers" className="mt-0 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="flex items-center">
                          <Home className="w-4 h-4 mr-2 text-orange-500" />
                          {t('scenarioBuilder.buildings')}: {buildings}
                        </Label>
                        <Slider
                          value={[buildings]}
                          onValueChange={(value) => setBuildings(value[0])}
                          max={1000}
                          min={0}
                          step={10}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center">
                          <Car className="w-4 h-4 mr-2 text-blue-600" />
                          {t('scenarioBuilder.evChargers')}: {evChargers}
                        </Label>
                        <Slider
                          value={[evChargers]}
                          onValueChange={(value) => setEvChargers(value[0])}
                          max={100}
                          min={0}
                          step={5}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center">
                          <Droplets className="w-4 h-4 mr-2 text-cyan-600" />
                          {t('scenarioBuilder.desalinationPlant')}: {desalinationPlant}
                        </Label>
                        <Slider
                          value={[desalinationPlant]}
                          onValueChange={(value) => setDesalinationPlant(value[0])}
                          max={5}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button
              onClick={handleCalculate}
              disabled={loading || !scenarioName.trim() || !location}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('common.calculating')}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {t('scenarioBuilder.runCalculation')}
                </>
              )}
            </Button>

            {results && (
              <Button onClick={handleSave} variant="outline">
                <Save className="w-4 h-4 mr-2" />
                {t('scenarioBuilder.saveScenario')}
              </Button>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {results ? (
            <>
              {/* Energy Balance */}
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800">
                    {getBalanceIcon()}
                    <span className="ml-2">{t('scenarioBuilder.energyBalance')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">{t('scenarioBuilder.production')}:</span>
                      <span className="font-semibold text-blue-900">
                        {(results.totalProduction / 1000000).toFixed(1)} GWh
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">{t('scenarioBuilder.consumption')}:</span>
                      <span className="font-semibold text-blue-900">
                        {(results.totalConsumption / 1000000).toFixed(1)} GWh
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm text-blue-700">{t('scenarioBuilder.balance')}:</span>
                      <span className={`font-semibold ${results.balance >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                        {results.balance >= 0 ? '+' : ''}{(results.balance / 1000000).toFixed(1)} GWh
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-blue-600 mt-2">
                    {getBalanceMessage()}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Production Breakdown */}
              {(results.solarDetails || results.windDetails || results.hydroDetails) && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-800">
                      <Zap className="w-5 h-5 mr-2" />
                      Λεπτομέρειες Παραγωγής
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {results.solarDetails && (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                          <Sun className="w-4 h-4 mr-2" />
                          Ηλιακά Συστήματα
                        </h5>
                        <div className="grid gap-1 text-xs">
                          <div className="flex justify-between">
                            <span>Πάνελ:</span>
                            <span>{results.solarDetails.panels}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Απόδοση:</span>
                            <span>{results.solarDetails.efficiency}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Γωνία:</span>
                            <span>{results.solarDetails.angle}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Παραγωγή:</span>
                            <span>{(results.solarDetails.production / 1000000).toFixed(1)} GWh</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {results.windDetails && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
                          <Wind className="w-4 h-4 mr-2" />
                          Αιολικά Συστήματα
                        </h5>
                        <div className="grid gap-1 text-xs">
                          <div className="flex justify-between">
                            <span>Ανεμογεννήτριες:</span>
                            <span>{results.windDetails.turbines}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Ισχύς:</span>
                            <span>{results.windDetails.power / 1000}MW</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Ύψος Πύργου:</span>
                            <span>{results.windDetails.hubHeight}m</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Παραγωγή:</span>
                            <span>{(results.windDetails.production / 1000000).toFixed(1)} GWh</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {results.hydroDetails && (
                      <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                        <h5 className="font-semibold text-cyan-800 mb-2 flex items-center">
                          <Waves className="w-4 h-4 mr-2" />
                          Υδροηλεκτρικά Συστήματα
                        </h5>
                        <div className="grid gap-1 text-xs">
                          <div className="flex justify-between">
                            <span>Μονάδες:</span>
                            <span>{results.hydroDetails.units}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Απόδοση:</span>
                            <span>{(results.hydroDetails.efficiency * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Ύψος/Ροή:</span>
                            <span>{results.hydroDetails.head}m / {results.hydroDetails.flow}m³/s</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Παραγωγή:</span>
                            <span>{(results.hydroDetails.production / 1000000).toFixed(1)} GWh</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Equipment Costs Summary */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-800">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Κόστος Εξοπλισμού
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-700">Ηλιακά Πάνελ:</span>
                    <span className="font-semibold text-purple-900">
                      €{results.equipmentCosts.solar.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-700">Ανεμογεννήτριες:</span>
                    <span className="font-semibold text-purple-900">
                      €{(results.equipmentCosts.wind / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-700">Υδροηλεκτρικός:</span>
                    <span className="font-semibold text-purple-900">
                      €{(results.equipmentCosts.hydro / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm text-purple-700 font-medium">Σύνολο:</span>
                    <span className="font-bold text-purple-900">
                      €{((results.equipmentCosts.solar + results.equipmentCosts.wind + results.equipmentCosts.hydro) / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Optimization Suggestions */}
              {results.balance < 0 && (
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-yellow-800">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      {t('scenarioBuilder.optimizationSuggestions')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {getOptimizationSuggestions().map((suggestion, index) => (
                        <div key={index} className="text-sm text-yellow-700 flex items-start">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Storage Capacity */}
              <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-800">
                    <Battery className="w-5 h-5 mr-2" />
                    {t('scenarioBuilder.storage')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Συνολική Χωρητικότητα:</span>
                      <span className="font-semibold text-gray-900">
                        {(results.storageCapacity / 1000).toFixed(1)} GWh
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Αυτονομία:</span>
                      <span className="font-semibold text-gray-900">
                        {(results.storageCapacity / (results.totalConsumption / 365)).toFixed(1)} ημέρες
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
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Διαμορφώστε το σενάριό σας και υπολογίστε για να δείτε τα αποτελέσματα</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}