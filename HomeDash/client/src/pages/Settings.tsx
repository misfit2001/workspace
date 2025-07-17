import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Wifi,
  Smartphone,
  Moon,
  Sun,
  Volume2,
  Lock,
  Eye,
  Download,
  Upload,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function Settings() {
  const [notifications, setNotifications] = useState({
    deviceAlerts: true,
    sceneUpdates: false,
    systemStatus: true,
    weeklyReports: false
  })

  const [privacy, setPrivacy] = useState({
    dataCollection: false,
    analytics: true,
    locationTracking: false,
    voiceRecording: false
  })

  const [automation, setAutomation] = useState({
    autoScenes: true,
    smartScheduling: false,
    energySaving: true,
    guestMode: false
  })

  const { toast } = useToast()

  const handleSaveSettings = () => {
    console.log('Settings: Saving user settings')
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  const handleExportData = () => {
    console.log('Settings: Exporting user data')
    toast({
      title: "Export Started",
      description: "Your data export will be ready shortly.",
    })
  }

  const handleImportData = () => {
    console.log('Settings: Importing user data')
    toast({
      title: "Import Started",
      description: "Please select a file to import your settings.",
    })
  }

  const handleResetSettings = () => {
    console.log('Settings: Resetting to defaults')
    setNotifications({
      deviceAlerts: true,
      sceneUpdates: false,
      systemStatus: true,
      weeklyReports: false
    })
    setPrivacy({
      dataCollection: false,
      analytics: true,
      locationTracking: false,
      voiceRecording: false
    })
    setAutomation({
      autoScenes: true,
      smartScheduling: false,
      energySaving: true,
      guestMode: false
    })
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your smart home preferences and account settings
          </p>
        </div>
        <Button
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <SettingsIcon className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              <Separator />
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-green-600" />
                Connected Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">iPhone 14 Pro</p>
                      <p className="text-sm text-muted-foreground">Last active: 2 minutes ago</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500">Current</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">MacBook Pro</p>
                      <p className="text-sm text-muted-foreground">Last active: 1 hour ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Revoke</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-600" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="deviceAlerts">Device Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when devices go offline or need attention</p>
                </div>
                <Switch
                  id="deviceAlerts"
                  checked={notifications.deviceAlerts}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, deviceAlerts: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sceneUpdates">Scene Updates</Label>
                  <p className="text-sm text-muted-foreground">Notifications when automated scenes are triggered</p>
                </div>
                <Switch
                  id="sceneUpdates"
                  checked={notifications.sceneUpdates}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sceneUpdates: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="systemStatus">System Status</Label>
                  <p className="text-sm text-muted-foreground">Important system updates and maintenance notifications</p>
                </div>
                <Switch
                  id="systemStatus"
                  checked={notifications.systemStatus}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, systemStatus: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyReports">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Weekly summary of your smart home activity</p>
                </div>
                <Switch
                  id="weeklyReports"
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReports: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dataCollection">Data Collection</Label>
                  <p className="text-sm text-muted-foreground">Allow collection of usage data to improve services</p>
                </div>
                <Switch
                  id="dataCollection"
                  checked={privacy.dataCollection}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, dataCollection: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics">Analytics</Label>
                  <p className="text-sm text-muted-foreground">Share anonymous analytics to help improve the platform</p>
                </div>
                <Switch
                  id="analytics"
                  checked={privacy.analytics}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, analytics: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="locationTracking">Location Tracking</Label>
                  <p className="text-sm text-muted-foreground">Use location data for automated scenes and geofencing</p>
                </div>
                <Switch
                  id="locationTracking"
                  checked={privacy.locationTracking}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, locationTracking: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="voiceRecording">Voice Recording</Label>
                  <p className="text-sm text-muted-foreground">Allow voice commands and recordings for smart assistants</p>
                </div>
                <Switch
                  id="voiceRecording"
                  checked={privacy.voiceRecording}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, voiceRecording: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Settings */}
        <TabsContent value="automation" className="space-y-6">
          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-purple-600" />
                Automation Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoScenes">Automatic Scenes</Label>
                  <p className="text-sm text-muted-foreground">Allow scenes to trigger automatically based on conditions</p>
                </div>
                <Switch
                  id="autoScenes"
                  checked={automation.autoScenes}
                  onCheckedChange={(checked) => setAutomation(prev => ({ ...prev, autoScenes: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smartScheduling">Smart Scheduling</Label>
                  <p className="text-sm text-muted-foreground">Optimize device schedules based on usage patterns</p>
                </div>
                <Switch
                  id="smartScheduling"
                  checked={automation.smartScheduling}
                  onCheckedChange={(checked) => setAutomation(prev => ({ ...prev, smartScheduling: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="energySaving">Energy Saving Mode</Label>
                  <p className="text-sm text-muted-foreground">Automatically optimize devices for energy efficiency</p>
                </div>
                <Switch
                  id="energySaving"
                  checked={automation.energySaving}
                  onCheckedChange={(checked) => setAutomation(prev => ({ ...prev, energySaving: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="guestMode">Guest Mode</Label>
                  <p className="text-sm text-muted-foreground">Simplified interface and limited access for guests</p>
                </div>
                <Switch
                  id="guestMode"
                  checked={automation.guestMode}
                  onCheckedChange={(checked) => setAutomation(prev => ({ ...prev, guestMode: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-gray-600" />
                System Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                </div>
                <ThemeToggle />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Input id="language" defaultValue="English (US)" disabled />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="UTC-5 (Eastern)" disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-600" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Export Data</Label>
                  <p className="text-sm text-muted-foreground">Download all your smart home data</p>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Import Data</Label>
                  <p className="text-sm text-muted-foreground">Import settings from a backup file</p>
                </div>
                <Button variant="outline" onClick={handleImportData}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Reset Settings</Label>
                  <p className="text-sm text-muted-foreground">Reset all settings to default values</p>
                </div>
                <Button variant="destructive" onClick={handleResetSettings}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-green-600" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">99.9%</div>
                  <div className="text-sm text-green-600 dark:text-green-500">Uptime</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">v2.1.0</div>
                  <div className="text-sm text-blue-600 dark:text-blue-500">Version</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}