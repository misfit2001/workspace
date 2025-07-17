import { NavLink } from "react-router-dom"
import { 
  Home, 
  Lightbulb, 
  MapPin, 
  Zap, 
  Settings,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Devices', href: '/devices', icon: Lightbulb },
  { name: 'Rooms', href: '/rooms', icon: MapPin },
  { name: 'Scenes', href: '/scenes', icon: Zap },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-700/50">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.name}</span>
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isActive ? "rotate-90" : "group-hover:translate-x-1"
                  )} 
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}