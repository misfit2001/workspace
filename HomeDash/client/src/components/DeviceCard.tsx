import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import {
  Lightbulb,
  Thermometer,
  Lock,
  Camera,
  Speaker,
  Plug,
  Power,
  MapPin,
  Clock
} from 'lucide-react'
import { Device } from '@/api/devices'
import { useState } from 'react'

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'light': return Lightbulb
    case 'thermostat': return Thermometer
    case 'lock': return Lock
    case 'camera': return Camera
    case 'speaker': return Speaker
    case 'plug': return Plug
    default: return Power
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-green-500'
    case 'offline': return 'bg-red-500'
    case 'connecting': return 'bg-yellow-500'
    default: return 'bg-gray-500'
  }
}

interface DeviceCardProps {
  device: Device
  onToggle: () => void
}

export function DeviceCard({ device, onToggle }: DeviceCardProps) {
  const [brightness, setBrightness] = useState(device.properties.brightness || 50)
  const [temperature, setTemperature] = useState(device.properties.temperature || 70)
  const [volume, setVolume] = useState(device.properties.volume || 50)

  const Icon = getDeviceIcon(device.type)
  const lastActivity = new Date(device.lastActivity).toLocaleTimeString()

  const handleSliderChange = (value: number[], type: string) => {
    const newValue = value[0]
    switch (type) {
      case 'brightness':
        setBrightness(newValue)
        break
      case 'temperature':
        setTemperature(newValue)
        break
      case 'volume':
        setVolume(newValue)
        break
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${device.isOn ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <Icon className={`h-5 w-5 ${device.isOn ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{device.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(device.status)}`} />
                <span className="text-xs text-muted-foreground capitalize">{device.status}</span>
              </div>
            </div>
          </div>
          <Switch
            checked={device.isOn}
            onCheckedChange={onToggle}
            disabled={device.status === 'offline'}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{device.room}</span>
            <Clock className="h-3 w-3 ml-2" />
            <span>{lastActivity}</span>
          </div>

          {/* Device-specific controls */}
          {device.type === 'light' && device.isOn && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Brightness</span>
                <span>{brightness}%</span>
              </div>
              <Slider
                value={[brightness]}
                onValueChange={(value) => handleSliderChange(value, 'brightness')}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          )}

          {device.type === 'thermostat' && device.isOn && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Temperature</span>
                <span>{temperature}°F</span>
              </div>
              <Slider
                value={[temperature]}
                onValueChange={(value) => handleSliderChange(value, 'temperature')}
                min={60}
                max={85}
                step={1}
                className="w-full"
              />
            </div>
          )}

          {device.type === 'speaker' && device.isOn && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Volume</span>
                <span>{volume}%</span>
              </div>
              <Slider
                value={[volume]}
                onValueChange={(value) => handleSliderChange(value, 'volume')}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          )}

          {device.type === 'plug' && device.properties.powerUsage && (
            <div className="text-xs text-muted-foreground">
              Power: {device.properties.powerUsage}W
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}