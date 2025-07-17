import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sunrise,
  Film,
  Moon,
  Shield,
  Zap,
  Play,
  Clock
} from 'lucide-react'
import { Scene } from '@/api/scenes'

const getSceneIcon = (icon: string) => {
  switch (icon) {
    case 'sunrise': return Sunrise
    case 'film': return Film
    case 'moon': return Moon
    case 'shield': return Shield
    default: return Zap
  }
}

interface SceneCardProps {
  scene: Scene
  onActivate: () => void
}

export function SceneCard({ scene, onActivate }: SceneCardProps) {
  const Icon = getSceneIcon(scene.icon)
  const lastUsed = scene.lastUsed ? new Date(scene.lastUsed).toLocaleDateString() : 'Never'

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-600">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${scene.isActive ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <Icon className={`h-5 w-5 ${scene.isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{scene.name}</h3>
              {scene.isActive && (
                <Badge variant="secondary" className="text-xs mt-1">
                  Active
                </Badge>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {scene.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Last: {lastUsed}</span>
          </div>
          <Button
            size="sm"
            onClick={onActivate}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
          >
            <Play className="h-3 w-3 mr-1" />
            Activate
          </Button>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          {scene.devices.length} device{scene.devices.length !== 1 ? 's' : ''}
        </div>
      </CardContent>
    </Card>
  )
}