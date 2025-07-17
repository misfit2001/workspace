import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { getCustomTechnologies, uploadCustomTechnology, deleteCustomTechnology, downloadTemplate } from "@/api/technology"
import { useToast } from "@/hooks/useToast"
import { Settings, Upload, Download, Trash2, Sun, Wind, Waves, FileText, Plus } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CustomTechnology {
  id: string
  name: string
  uploadDate: string
  [key: string]: any
}

interface TechnologyData {
  solar: CustomTechnology[]
  wind: CustomTechnology[]
  hydro: CustomTechnology[]
}

export function CustomTechnology() {
  const [technologies, setTechnologies] = useState<TechnologyData>({ solar: [], wind: [], hydro: [] })
  const [loading, setLoading] = useState(true)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({})
  const { toast } = useToast()

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        console.log('Fetching custom technologies...')
        const response = await getCustomTechnologies() as { technologies: TechnologyData }
        setTechnologies(response.technologies)
        console.log('Custom technologies loaded:', response.technologies)
      } catch (error) {
        console.error('Error fetching custom technologies:', error)
        toast({
          title: "Error",
          description: "Failed to load custom technologies",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTechnologies()
  }, [])

  const handleFileSelect = (type: string, file: File | null) => {
    setSelectedFiles(prev => ({ ...prev, [type]: file }))
  }

  const handleUpload = async (type: string) => {
    const file = selectedFiles[type]
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      })
      return
    }

    setUploadProgress(prev => ({ ...prev, [type]: 0 }))
    
    try {
      console.log(`Uploading ${type} technology file...`)
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[type] || 0
          if (current >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return { ...prev, [type]: current + 10 }
        })
      }, 200)

      const response = await uploadCustomTechnology({ file, type }) as { success: boolean, message: string, count: number }
      
      clearInterval(progressInterval)
      setUploadProgress(prev => ({ ...prev, [type]: 100 }))
      
      if (response.success) {
        toast({
          title: "Upload Successful",
          description: `${response.count} ${type} technologies uploaded successfully`,
        })
        
        // Refresh data
        const updatedResponse = await getCustomTechnologies() as { technologies: TechnologyData }
        setTechnologies(updatedResponse.technologies)
        
        // Reset file selection
        setSelectedFiles(prev => ({ ...prev, [type]: null }))
        setTimeout(() => {
          setUploadProgress(prev => ({ ...prev, [type]: 0 }))
        }, 2000)
      }
    } catch (error) {
      console.error(`Error uploading ${type} technology:`, error)
      toast({
        title: "Upload Failed",
        description: `Failed to upload ${type} technology file`,
        variant: "destructive",
      })
      setUploadProgress(prev => ({ ...prev, [type]: 0 }))
    }
  }

  const handleDelete = async (type: string, id: string) => {
    try {
      console.log(`Deleting ${type} technology:`, id)
      await deleteCustomTechnology(id)
      
      setTechnologies(prev => ({
        ...prev,
        [type]: prev[type as keyof TechnologyData].filter(tech => tech.id !== id)
      }))
      
      toast({
        title: "Success",
        description: "Technology deleted successfully",
      })
    } catch (error) {
      console.error(`Error deleting ${type} technology:`, error)
      toast({
        title: "Error",
        description: "Failed to delete technology",
        variant: "destructive",
      })
    }
  }

  const handleDownloadTemplate = async (type: string) => {
    try {
      console.log(`Downloading ${type} template...`)
      const blob = await downloadTemplate(type) as Blob
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${type}_template.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: "Template Downloaded",
        description: `${type} CSV template downloaded successfully`,
      })
    } catch (error) {
      console.error(`Error downloading ${type} template:`, error)
      toast({
        title: "Download Failed",
        description: "Failed to download template",
        variant: "destructive",
      })
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'solar': return <Sun className="w-5 h-5 text-yellow-500" />
      case 'wind': return <Wind className="w-5 h-5 text-blue-500" />
      case 'hydro': return <Waves className="w-5 h-5 text-cyan-500" />
      default: return <Settings className="w-5 h-5 text-gray-500" />
    }
  }

  const renderTechnologyList = (type: string, techs: CustomTechnology[]) => (
    <div className="space-y-4">
      {techs.length === 0 ? (
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No custom {type} technologies uploaded yet</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        techs.map((tech) => (
          <Card key={tech.id} className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">{tech.name}</h4>
                  <div className="grid gap-1 md:grid-cols-3 text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {type === 'solar' && (
                      <>
                        <div>Efficiency: {tech.efficiency}%</div>
                        <div>Wattage: {tech.wattage}W</div>
                        <div>Cost: €{tech.cost}</div>
                      </>
                    )}
                    {type === 'wind' && (
                      <>
                        <div>Power: {tech.power / 1000}MW</div>
                        <div>Hub Height: {tech.hubHeight}m</div>
                        <div>Rotor: {tech.rotorDiameter}m</div>
                      </>
                    )}
                    {type === 'hydro' && (
                      <>
                        <div>Efficiency: {(tech.efficiency * 100).toFixed(1)}%</div>
                        <div>Max Flow: {tech.maxFlow} m³/s</div>
                        <div>Max Head: {tech.maxHead}m</div>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Uploaded: {new Date(tech.uploadDate).toLocaleDateString()}
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-gray-900">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Technology</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{tech.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(type, tech.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )

  const renderUploadSection = (type: string) => (
    <Card className="bg-white/80 backdrop-blur-sm mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="w-5 h-5 mr-2 text-green-600" />
          Upload {type.charAt(0).toUpperCase() + type.slice(1)} Technology
        </CardTitle>
        <CardDescription>
          Upload CSV file with custom {type} technology specifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => handleDownloadTemplate(type)}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
          <Badge variant="secondary" className="flex items-center">
            <FileText className="w-3 h-3 mr-1" />
            CSV Format Required
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor={`file-${type}`}>Select CSV File</Label>
            <Input
              id={`file-${type}`}
              type="file"
              accept=".csv"
              onChange={(e) => handleFileSelect(type, e.target.files?.[0] || null)}
              className="mt-1"
            />
          </div>

          {uploadProgress[type] > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Upload Progress</span>
                <span>{uploadProgress[type]}%</span>
              </div>
              <Progress value={uploadProgress[type]} className="w-full" />
            </div>
          )}

          <Button
            onClick={() => handleUpload(type)}
            disabled={!selectedFiles[type] || uploadProgress[type] > 0}
            className="w-full"
          >
            {uploadProgress[type] > 0 ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {type.charAt(0).toUpperCase() + type.slice(1)} Data
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Custom Technology Manager</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Settings className="w-8 h-8 mr-3 text-green-500" />
            Custom Technology Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Upload and manage your custom renewable energy equipment specifications
          </p>
        </div>
      </div>

      <Tabs defaultValue="solar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="solar" className="flex items-center">
            <Sun className="w-4 h-4 mr-2" />
            Solar Panels ({technologies.solar.length})
          </TabsTrigger>
          <TabsTrigger value="wind" className="flex items-center">
            <Wind className="w-4 h-4 mr-2" />
            Wind Turbines ({technologies.wind.length})
          </TabsTrigger>
          <TabsTrigger value="hydro" className="flex items-center">
            <Waves className="w-4 h-4 mr-2" />
            Hydro Equipment ({technologies.hydro.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="solar" className="space-y-6">
          {renderUploadSection('solar')}
          {renderTechnologyList('solar', technologies.solar)}
        </TabsContent>

        <TabsContent value="wind" className="space-y-6">
          {renderUploadSection('wind')}
          {renderTechnologyList('wind', technologies.wind)}
        </TabsContent>

        <TabsContent value="hydro" className="space-y-6">
          {renderUploadSection('hydro')}
          {renderTechnologyList('hydro', technologies.hydro)}
        </TabsContent>
      </Tabs>
    </div>
  )
}