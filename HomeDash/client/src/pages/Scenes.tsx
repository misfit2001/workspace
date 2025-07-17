import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Plus,
  Play,
  Pause,
  Sunrise,
  Film,
  Moon,
  Shield,
  Zap,
  Clock,
  Settings,
  Trash2
} from 'lucide-react'
import { getScenes, activateScene, createScene, Scene } from '@/api/scenes'
import { getDevices, Device } from '@/api/devices'
import { useToast } from '@/hooks/useToast'
import { SceneCard } from '@/components/SceneCard'
import { useForm } from 'react-hook-form'

export function Scenes() {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const { toast } = useToast()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    console.log('Scenes: Component mounted, fetching data')
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [scenesData, devicesData] = await Promise.all([
        getScenes(),
        getDevices()
      ])

      setScenes(scenesData.scenes)
      setDevices(devicesData.devices)
      console.log('Scenes: Data fetched successfully')
    } catch (error) {
      console.error('Scenes: Error fetching data', error)
      toast({
        title: "Error",
        description: "Failed to load scenes data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSceneActivate = async (sceneId: string) => {
    try {
      console.log('Scenes: Activating scene', sceneId)
      const result = await activateScene(sceneId)

      toast({
        title: "Scene Activated",
        description: `${result.affectedDevices} devices updated`,
      })

      // Update scene status
      setScenes(prev => prev.map(scene =>
        scene._id === sceneId
          ? { ...scene, isActive: true, lastUsed: new Date().toISOString() }
          : { ...scene, isActive: false }
      ))
    } catch (error) {
      console.error('Scenes: Error activating scene', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleCreateScene = async (data: any) => {
    try {
      console.log('Scenes: Creating new scene', data)
      const deviceActions = selectedDevices.map(deviceId => {
        const device = devices.find(d => d._id === deviceId)
        return {
          deviceId,
          deviceName: device?.name || 'Unknown Device',
          action: 'toggle',
          properties: {}
        }
      })

      const sceneData = {
        ...data,
        devices: deviceActions
      }

      const result = await createScene(sceneData)

      setScenes(prev => [...prev, result.scene])
      setIsCreateDialogOpen(false)
      setSelectedDevices([])
      reset()

      toast({
        title: "Success",
        description: "Scene created successfully",
      })
    } catch (error) {
      console.error('Scenes: Error creating scene', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeviceSelection = (deviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedDevices(prev => [...prev, deviceId])
    } else {
      setSelectedDevices(prev => prev.filter(id => id !== deviceId))
    }
  }

  const activeScenes = scenes.filter(scene => scene.isActive)
  const inactiveScenes = scenes.filter(scene => !scene.isActive)

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
            Automation Scenes
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage automated device scenarios
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Scene
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-900 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Scene</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleCreateScene)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Scene Name</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Scene name is required' })}
                    placeholder="Enter scene name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Select onValueChange={(value) => register('icon').onChange({ target: { value } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunrise">
                        <div className="flex items-center gap-2">
                          <Sunrise className="h-4 w-4" />
                          Sunrise
                        </div>
                      </SelectItem>
                      <SelectItem value="film">
                        <div className="flex items-center gap-2">
                          <Film className="h-4 w-4" />
                          Film
                        </div>
                      </SelectItem>
                      <SelectItem value="moon">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Moon
                        </div>
                      </SelectItem>
                      <SelectItem value="shield">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Shield
                        </div>
                      </SelectItem>
                      <SelectItem value="zap">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Zap
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description', { required: 'Description is required' })}
                  placeholder="Describe what this scene does"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Label>Select Devices</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-4">
                  {devices.map(device => (
                    <div key={device._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={device._id}
                        checked={selectedDevices.includes(device._id)}
                        onCheckedChange={(checked) => handleDeviceSelection(device._id, checked as boolean)}
                      />
                      <Label htmlFor={device._id} className="text-sm">
                        {device.name} ({device.room})
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedDevices.length} device{selectedDevices.length !== 1 ? 's' : ''} selected
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={selectedDevices.length === 0}>
                  Create Scene
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    setSelectedDevices([])
                    reset()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Scene Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Scenes</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{scenes.length}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Scenes</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{activeScenes.length}</p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Available Scenes</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{inactiveScenes.length}</p>
              </div>
              <Pause className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Total Devices</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{devices.length}</p>
              </div>
              <Settings className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Scenes */}
      {activeScenes.length > 0 && (
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-600" />
              Active Scenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeScenes.map((scene) => (
                <SceneCard
                  key={scene._id}
                  scene={scene}
                  onActivate={() => handleSceneActivate(scene._id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Scenes */}
      <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            All Scenes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenes.map((scene) => (
              <SceneCard
                key={scene._id}
                scene={scene}
                onActivate={() => handleSceneActivate(scene._id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {scenes.length === 0 && (
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
          <CardContent className="p-12 text-center">
            <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No scenes created</h3>
            <p className="text-muted-foreground mb-4">
              Create your first automation scene to control multiple devices with a single action.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Scene
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}