import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Search,
  Plus,
  Filter,
  Grid3X3,
  List,
  Lightbulb,
  Thermometer,
  Lock,
  Camera,
  Speaker,
  Plug
} from 'lucide-react'
import { getDevices, addDevice, toggleDevice, Device } from '@/api/devices'
import { getRooms } from '@/api/rooms'
import { useToast } from '@/hooks/useToast'
import { DeviceCard } from '@/components/DeviceCard'
import { useForm } from 'react-hook-form'

const deviceTypes = [
  { value: 'light', label: 'Light', icon: Lightbulb },
  { value: 'thermostat', label: 'Thermostat', icon: Thermometer },
  { value: 'lock', label: 'Lock', icon: Lock },
  { value: 'camera', label: 'Camera', icon: Camera },
  { value: 'speaker', label: 'Speaker', icon: Speaker },
  { value: 'plug', label: 'Smart Plug', icon: Plug },
]

export function Devices() {
  const [devices, setDevices] = useState<Device[]>([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    console.log('Devices: Component mounted, fetching data')
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [devicesData, roomsData] = await Promise.all([
        getDevices(),
        getRooms()
      ])

      setDevices(devicesData.devices)
      setRooms(roomsData.rooms)
      console.log('Devices: Data fetched successfully')
    } catch (error) {
      console.error('Devices: Error fetching data', error)
      toast({
        title: "Error",
        description: "Failed to load devices",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddDevice = async (data: any) => {
    try {
      console.log('Devices: Adding new device', data)
      const result = await addDevice(data)

      setDevices(prev => [...prev, result.device])
      setIsAddDialogOpen(false)
      reset()

      toast({
        title: "Success",
        description: "Device added successfully",
      })
    } catch (error) {
      console.error('Devices: Error adding device', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeviceToggle = async (deviceId: string) => {
    try {
      console.log('Devices: Toggling device', deviceId)
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
      console.error('Devices: Error toggling device', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRoom = selectedRoom === 'all' || device.room === selectedRoom
    const matchesType = selectedType === 'all' || device.type === selectedType
    return matchesSearch && matchesRoom && matchesType
  })

  const devicesByType = deviceTypes.map(type => ({
    ...type,
    devices: filteredDevices.filter(device => device.type === type.value),
    count: filteredDevices.filter(device => device.type === type.value).length
  }))

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
            Devices
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and control all your smart devices
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleAddDevice)} className="space-y-4">
              <div>
                <Label htmlFor="name">Device Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Device name is required' })}
                  placeholder="Enter device name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="type">Device Type</Label>
                <Select onValueChange={(value) => register('type').onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="room">Room</Label>
                <Select onValueChange={(value) => register('room').onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map(room => (
                      <SelectItem key={room._id} value={room.name}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Add Device</Button>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Rooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                {rooms.map(room => (
                  <SelectItem key={room._id} value={room.name}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {deviceTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {deviceTypes.map(type => {
          const count = devices.filter(d => d.type === type.value).length
          const activeCount = devices.filter(d => d.type === type.value && d.isOn).length
          return (
            <Card key={type.value} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <type.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs text-muted-foreground">{type.label}s</div>
                <div className="text-xs text-green-600">{activeCount} active</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Devices List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="all">All ({filteredDevices.length})</TabsTrigger>
          {deviceTypes.map(type => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label} ({devicesByType.find(t => t.value === type.value)?.count || 0})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredDevices.map(device => (
              <DeviceCard
                key={device._id}
                device={device}
                onToggle={() => handleDeviceToggle(device._id)}
              />
            ))}
          </div>
        </TabsContent>

        {deviceTypes.map(type => (
          <TabsContent key={type.value} value={type.value} className="space-y-4">
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {devicesByType.find(t => t.value === type.value)?.devices.map(device => (
                <DeviceCard
                  key={device._id}
                  device={device}
                  onToggle={() => handleDeviceToggle(device._id)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {filteredDevices.length === 0 && (
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
          <CardContent className="p-12 text-center">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No devices found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters, or add a new device to get started.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Device
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}