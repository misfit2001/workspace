import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { getGreekRegions } from "@/api/dashboard"
import { useToast } from "@/hooks/useToast"
import { MapPin, Thermometer, Wind, Mountain } from "lucide-react"
import { useTranslation } from "react-i18next"

interface Region {
  id: string
  name: string
  nameEn: string
  coordinates: [number, number]
  solarIrradiance: number
  windSpeed: number
  elevation: number
}

interface LocationSelectorProps {
  onLocationChange: (location: string) => void
}

export function LocationSelector({ onLocationChange }: LocationSelectorProps) {
  const [regions, setRegions] = useState<Region[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const { toast } = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        console.log('Fetching Greek regions...')
        const response = await getGreekRegions() as { regions: Region[] }
        setRegions(response.regions)
        console.log('Greek regions loaded:', response.regions)
      } catch (error) {
        console.error('Error fetching regions:', error)
        toast({
          title: t('messages.error'),
          description: t('messages.failedToLoadRegions'),
          variant: "destructive",
        })
      }
    }

    fetchRegions()
  }, [])

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId)
    onLocationChange(regionId)
  }

  const selectedRegionData = regions.find(r => r.id === selectedRegion)

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          {t('location.locationSelection')}
        </CardTitle>
        <CardDescription>{t('location.chooseGreekRegion')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Select value={selectedRegion} onValueChange={handleRegionChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('location.selectGreekRegion')} />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{region.name} ({region.nameEn})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedRegionData && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">{t('location.locationDetails')}</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('location.solarIrradiance')}:</span>
                <Badge variant="secondary">{selectedRegionData.solarIrradiance} kWh/m²</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Wind className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('location.windSpeed')}:</span>
                <Badge variant="secondary">{selectedRegionData.windSpeed} km/h</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Mountain className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('location.elevation')}:</span>
                <Badge variant="secondary">{selectedRegionData.elevation}m</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('location.coordinates')}:</span>
                <Badge variant="secondary">
                  {selectedRegionData.coordinates[0].toFixed(2)}, {selectedRegionData.coordinates[1].toFixed(2)}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}