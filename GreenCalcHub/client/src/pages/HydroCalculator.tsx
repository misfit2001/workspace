import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getHydroEquipment, calculateHydroProduction } from "@/api/hydro"
import { useToast } from "@/hooks/useToast"
import { useTranslation } from "react-i18next"
import { Waves, MapPin, Zap, TrendingUp, Leaf, Calculator, Save } from "lucide-react"
import { LocationSelector } from "@/components/LocationSelector"
import { ResultsChart } from "@/components/ResultsChart"

interface HydroEquipment {
  id: string
  name: string
  type: string
  efficiency: number
  maxFlow: number
  maxHead: number
  cost: number
  isCustom: boolean
}

interface CalculationResult {
  dailyProduction: number
  monthlyProduction: number
  yearlyProduction: number
  efficiency: number
  co2Savings: number
  financialSavings: number
}

export function HydroCalculator() {
  const { t } = useTranslation()
  const [equipment, setEquipment] = useState<HydroEquipment[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<string>("")
  const [head, setHead] = useState<number>(50)
  const [flow, setFlow] = useState<number>(2.0)
  const [location, setLocation] = useState<string>("")
  const [results, setResults] = useState<CalculationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        console.log('Fetching hydro equipment...')
        const response = await getHydroEquipment() as { equipment: HydroEquipment[] }
        setEquipment(response.equipment)
        console.log('Hydro equipment loaded:', response.equipment)
      } catch (error) {
        console.error('Error fetching hydro equipment:', error)
        toast({
          title: t('messages.error'),
          description: t('messages.failedToLoadEquipment'),
          variant: "destructive",
        })
      }
    }

    fetchEquipment()
  }, [t, toast])

  const handleCalculate = async () => {
    if (!selectedEquipment || !location) {
      toast({
        title: t('messages.missingInformation'),
        description: t('messages.selectEquipmentAndLocation'),
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      console.log('Calculating hydro production...')
      const response = await calculateHydroProduction({
        equipmentId: selectedEquipment,
        head,
        flow,
        location
      }) as CalculationResult

      setResults(response)
      console.log('Hydro calculation completed:', response)
      toast({
        title: t('messages.calculationComplete'),
        description: t('messages.hydroCalculationComplete'),
      })
    } catch (error) {
      console.error('Error calculating hydro production:', error)
      toast({
        title: t('messages.calculationError'),
        description: t('messages.failedToCalculateHydro'),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedEquipmentData = equipment.find(e => e.id === selectedEquipment)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Waves className="w-8 h-8 mr-3 text-cyan-500" />
            {t('hydro.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {t('hydro.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Waves className="w-5 h-5 mr-2 text-cyan-600" />
                {t('hydro.systemConfiguration')}
              </CardTitle>
              <CardDescription>{t('hydro.configureParameters')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="equipment-type">{t('hydro.equipmentType')}</Label>
                <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('hydro.selectEquipmentType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {equipment.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{item.name}</span>
                          {item.isCustom && (
                            <Badge variant="secondary" className="ml-2">{t('common.custom')}</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEquipmentData && (
                <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                  <h4 className="font-semibold text-cyan-800 dark:text-cyan-200 mb-2">{t('hydro.equipmentSpecifications')}</h4>
                  <div className="grid gap-2 md:grid-cols-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">{t('hydro.type')}:</span>
                      <span className="ml-2 font-medium capitalize">{selectedEquipmentData.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">{t('hydro.efficiency')}:</span>
                      <span className="ml-2 font-medium">{(selectedEquipmentData.efficiency * 100).toFixed(1)}{t('units.percent')}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">{t('hydro.maxFlow')}:</span>
                      <span className="ml-2 font-medium">{selectedEquipmentData.maxFlow} {t('units.cubicMetersPerSecond')}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">{t('hydro.maxHead')}:</span>
                      <span className="ml-2 font-medium">{selectedEquipmentData.maxHead}{t('units.meters')}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="head">{t('hydro.headHeight')} ({t('units.meters')})</Label>
                  <Input
                    id="head"
                    type="number"
                    value={head}
                    onChange={(e) => setHead(Number(e.target.value))}
                    min="1"
                    max="500"
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500">{t('hydro.verticalDistance')}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flow">{t('hydro.flowRate')} ({t('units.cubicMetersPerSecond')})</Label>
                  <Input
                    id="flow"
                    type="number"
                    value={flow}
                    onChange={(e) => setFlow(Number(e.target.value))}
                    min="0.1"
                    max="50"
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500">{t('hydro.volumePerSecond')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <LocationSelector onLocationChange={setLocation} />

          <div className="flex space-x-4">
            <Button
              onClick={handleCalculate}
              disabled={loading || !selectedEquipment || !location}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('common.calculating')}
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  {t('hydro.calculateProduction')}
                </>
              )}
            </Button>

            {results && (
              <Button variant="outline">
                <Save className="w-4 h-4 mr-2" />
                {t('hydro.saveScenario')}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {results ? (
            <>
              <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-800">
                    <Zap className="w-5 h-5 mr-2" />
                    {t('hydro.energyProduction')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-cyan-700">{t('hydro.daily')}:</span>
                      <span className="font-semibold text-cyan-900">
                        {(results.dailyProduction / 1000).toFixed(1)} {t('units.kWh')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-cyan-700">{t('hydro.monthly')}:</span>
                      <span className="font-semibold text-cyan-900">
                        {(results.monthlyProduction / 1000).toFixed(1)} {t('units.kWh')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-cyan-700">{t('hydro.yearly')}:</span>
                      <span className="font-semibold text-cyan-900">
                        {(results.yearlyProduction / 1000).toFixed(1)} {t('units.kWh')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-cyan-200">
                    <div className="flex justify-between">
                      <span className="text-sm text-cyan-700">{t('hydro.systemEfficiency')}:</span>
                      <span className="font-semibold text-cyan-900">
                        {(results.efficiency * 100).toFixed(1)}{t('units.percent')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <Leaf className="w-5 h-5 mr-2" />
                    {t('hydro.environmentalImpact')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">{t('hydro.co2Savings')}:</span>
                      <span className="font-semibold text-green-900">
                        {results.co2Savings.toFixed(1)} {t('units.tons')}/{t('hydro.years')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">{t('hydro.equivalentTrees')}:</span>
                      <span className="font-semibold text-green-900">
                        {Math.round(results.co2Savings * 16)} {t('hydro.trees')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-800">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    {t('hydro.financialAnalysis')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-700">{t('hydro.annualSavings')}:</span>
                      <span className="font-semibold text-purple-900">
                        {t('units.euros')}{results.financialSavings.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-700">{t('hydro.systemCost')}:</span>
                      <span className="font-semibold text-purple-900">
                        {t('units.euros')}{selectedEquipmentData ? (selectedEquipmentData.cost / 1000).toFixed(0) : 0}k
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-700">{t('hydro.paybackPeriod')}:</span>
                      <span className="font-semibold text-purple-900">
                        {selectedEquipmentData ?
                          Math.round(selectedEquipmentData.cost / results.financialSavings) : 0
                        } {t('hydro.years')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ResultsChart data={results} type="hydro" />
            </>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <Waves className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t('hydro.configureSystem')}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}