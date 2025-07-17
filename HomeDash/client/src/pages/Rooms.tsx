import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Home,
  Power,
  PowerOff,
  Users,
  Activity,
  ChefHat,
  Bed,
  Droplets,
  Briefcase,
  DoorOpen,
  Sofa
} from 'lucide-react'
import { getRooms, controlRoom, Room } from '@/api/rooms'
import { getDevices, Device } from '@/api/devices'
import { useToast } from '@/hooks/useToast'

const getRoomIcon = (icon: string) => {
  switch (icon) {
    case 'sofa': return Sofa
    case 'chef-hat': return ChefHat
    case 'bed': return Bed
    case 'droplets': return Droplets
    case 'briefcase': return Briefcase
    case 'door-open': return DoorOpen
    default: return Home
  }
}

export function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    console.log('Rooms: Component mounted, fetching data')
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [roomsData, devicesData] = await Promise.all([
        getRooms(),
        getDevices()
      ])

      setRooms(roomsData.rooms)
      setDevices(devicesData.devices)
      console.log('Rooms: Data fetched successfully')
    } catch (error) {
      console.error('Rooms: Error fetching data', error)
      toast({
        title: "Error",
        description: "Failed to load rooms data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRoomControl = async (roomId: string, action: 'on' | 'off') => {
    try {
      console.log('Rooms: Controlling room', roomId, action)
      const result = await controlRoom(roomId, action)

      toast({
        title: "Success",
        description: `${result.affectedDevices} devices ${action === 'on' ? 'turned on' : 'turned off'}`,
      })

      // Refresh data after room control
      fetchData()
    } catch (error) {
      console.error('Rooms: Error controlling room', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getRoomDevices = (roomName: string) => {
    return devices.filter(device => device.room === roomName)
  }

  const getRoomStats = (roomName: string) => {
    const roomDevices = getRoomDevices(roomName)
    const activeDevices = roomDevices.filter(d => d.isOn).length
    const onlineDevices = roomDevices.filter(d => d.status === 'online').length
    const totalDevices = roomDevices.length
    
    return {
      activeDevices,
      onlineDevices,
      totalDevices,
      activityPercentage: totalDevices > 0 ? (activeDevices / totalDevices) * 100 : 0
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
            Rooms
          </h1>
          <p className="text-muted-foreground mt-1">
            Control devices by room and monitor activity
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

      {/* Room Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Rooms</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{rooms.length}</p>
              </div>
              <Home className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Devices</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{devices.length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Active Devices</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {devices.filter(d => d.isOn).length}
                </p>
              </div>
              <Power className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Online Devices</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {devices.filter(d => d.status === 'online').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const Icon = getRoomIcon(room.icon)
          const stats = getRoomStats(room.name)
          const roomDevices = getRoomDevices(room.name)

          return (
            <Card
              key={room._id}
              className="group hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {stats.totalDevices} device{stats.totalDevices !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={stats.activeDevices > 0 ? "default" : "secondary"}
                    className={stats.activeDevices > 0 ? "bg-green-500" : ""}
                  >
                    {stats.activeDevices > 0 ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Activity Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Activity</span>
                    <span>{Math.round(stats.activityPercentage)}%</span>
                  </div>
                  <Progress value={stats.activityPercentage} className="h-2" />
                </div>

                {/* Device Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="font-semibold text-green-700 dark:text-green-400">
                      {stats.activeDevices}
                    </div>
                    <div className="text-green-600 dark:text-green-500">Active</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="font-semibold text-blue-700 dark:text-blue-400">
                      {stats.onlineDevices}
                    </div>
                    <div className="text-blue-600 dark:text-blue-500">Online</div>
                  </div>
                </div>

                {/* Room Controls */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleRoomControl(room._id, 'on')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    disabled={stats.totalDevices === 0}
                  >
                    <Power className="h-4 w-4 mr-1" />
                    All On
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRoomControl(room._id, 'off')}
                    className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    disabled={stats.totalDevices === 0}
                  >
                    <PowerOff className="h-4 w-4 mr-1" />
                    All Off
                  </Button>
                </div>

                {/* Device List */}
                {roomDevices.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Devices:</p>
                    <div className="space-y-1">
                      {roomDevices.slice(0, 3).map(device => (
                        <div key={device._id} className="flex items-center justify-between text-xs">
                          <span className="truncate">{device.name}</span>
                          <Badge
                            variant={device.isOn ? "default" : "secondary"}
                            className={`text-xs ${device.isOn ? 'bg-green-500' : ''}`}
                          >
                            {device.isOn ? 'On' : 'Off'}
                          </Badge>
                        </div>
                      ))}
                      {roomDevices.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{roomDevices.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {rooms.length === 0 && (
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
          <CardContent className="p-12 text-center">
            <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No rooms found</h3>
            <p className="text-muted-foreground">
              Rooms will appear here once you add devices and assign them to rooms.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}