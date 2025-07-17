import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Home,
  Lightbulb,
  Thermometer,
  Lock,
  Camera,
  Speaker,
  Plug,
  Power,
  PowerOff,
  Activity,
  Zap,
  Users,
  TrendingUp
} from 'lucide-react'
import { getDevices, toggleDevice, Device } from '@/api/devices'
import { getRooms, Room } from '@/api/rooms'
import { getScenes, activateScene, Scene } from '@/api/scenes'
import { useToast } from '@/hooks/useToast'
import { DeviceCard } from '@/components/DeviceCard'
import { SceneCard } from '@/components/SceneCard'

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

export function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [scenes, setScenes] = useState<Scene[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    console.log('Dashboard: Component mounted, fetching data')
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [devicesData, roomsData, scenesData] = await Promise.all([
        getDevices(),
        getRooms(),
        getScenes()
      ])

      setDevices(devicesData.devices)
      setRooms(roomsData.rooms)
      setScenes(scenesData.scenes)
      console.log('Dashboard: Data fetched successfully')
    } catch (error) {
      console.error('Dashboard: Error fetching data', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeviceToggle = async (deviceId: string) => {
    try {
      console.log('Dashboard: Toggling device', deviceId)
      await toggleDevice(deviceId)

      setDevices(prev => prev.map(device =>
        device._id === deviceId
          ? { ...device, isOn: !device.isOn, lastActivity: new Date().toISOString() }
          : device
      ))

      toast({
        title: "Success",
        description: "Device updated successfully",
      })
    } catch (error) {
      console.error('Dashboard: Error toggling device', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleSceneActivate = async (sceneId: string) => {
    try {
      console.log('Dashboard: Activating scene', sceneId)
      const result = await activateScene(sceneId)

      toast({
        title: "Scene Activated",
        description: `${result.affectedDevices} devices updated`,
      })

      // Refresh data after scene activation
      fetchData()
    } catch (error) {
      console.error('Dashboard: Error activating scene', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const onlineDevices = devices.filter(d => d.status === 'online').length
  const activeDevices = devices.filter(d => d.isOn).length
  const totalRooms = rooms.length
  const activeScenes = scenes.filter(s => s.isActive).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart Home Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening in your home.
          </p>
        </div>
        <Button
          onClick={fetchData}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Online Devices</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{onlineDevices}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Power className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Devices</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{activeDevices}</p>
              </div>
              <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Rooms</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{totalRooms}</p>
              </div>
              <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Home className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Active Scenes</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{activeScenes}</p>
              </div>
              <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Scenes */}
      <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Quick Scenes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {scenes.slice(0, 4).map((scene) => (
              <SceneCard
                key={scene._id}
                scene={scene}
                onActivate={() => handleSceneActivate(scene._id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Devices */}
      <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.slice(0, 6).map((device) => (
              <DeviceCard
                key={device._id}
                device={device}
                onToggle={() => handleDeviceToggle(device._id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}