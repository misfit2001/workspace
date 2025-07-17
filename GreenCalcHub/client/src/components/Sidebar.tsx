import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import {
  Home,
  Zap,
  History,
  Settings,
  User,
  Shield,
  Calculator
} from "lucide-react"

export function Sidebar() {
  const { t } = useTranslation()
  const location = useLocation()

  const navigation = [
    {
      name: t('navigation.dashboard'),
      href: "/",
      icon: Home,
    },
    {
      name: t('navigation.scenarioBuilder'),
      href: "/scenario-builder",
      icon: Calculator,
    },
    {
      name: t('navigation.scenarioHistory'),
      href: "/history",
      icon: History,
    },
    {
      name: t('navigation.customTechnology'),
      href: "/technology",
      icon: Settings,
    },
    {
      name: t('common.profile'),
      href: "/profile",
      icon: User,
    },
    {
      name: t('navigation.adminPanel'),
      href: "/admin",
      icon: Shield,
    },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white/80 backdrop-blur-sm border-r">
      <div className="flex h-16 items-center border-b px-4 sm:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          <span className="text-lg sm:text-xl font-bold text-gray-900">RenewableGR</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full justify-start px-3 py-2 text-left font-normal text-sm sm:text-base",
                isActive(item.href) && "bg-green-100 text-green-900"
              )}
              asChild
            >
              <Link to={item.href}>
                <item.icon className="mr-3 h-4 w-4" />
                <span className="truncate">{item.name}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}