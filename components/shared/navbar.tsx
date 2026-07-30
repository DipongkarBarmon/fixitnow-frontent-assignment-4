'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Wrench,
  Bell,
  Menu,
  X,
  Moon,
  Sun,
  LayoutDashboard,
  User,
  Calendar,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown_menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'

// Navigation items array
export const navItems = [
  { title: 'Home', href: '/' },
  { title: 'Services', href: '/services' },
  { title: 'Technicians', href: '/technicians' },
  { title: 'Bookings', href: '/bookings' },
  { title: 'Payments', href: '/payments' },
  { title: 'Reviews', href: '/reviews' },
]

// Dropdown menu item that wraps a link
function DropdownMenuLinkItem({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <DropdownMenuItem onClick={() => {
      window.location.href = href
    }}>
      <Icon className="size-4" />
      <span>{children}</span>
    </DropdownMenuItem>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const isAuthenticated = true

  const toggleTheme = () => {
    setIsDark(!isDark)
    // In a real app, this would update the theme globally
    document.documentElement.classList.toggle('dark')
  }

  const isActive = (href: string) => pathname === href

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section - Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Wrench className="size-6 text-blue-600" />
          <span className="hidden text-xl font-bold text-neutral-900 dark:text-white sm:inline">
            FixItNow
          </span>
        </Link>

        {/* Center Navigation - Desktop Only */}
        <div className="hidden gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              {item.title}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                <Bell className="size-5" />
                <span className="sr-only">Notifications</span>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                {isDark ? (
                  <Sun className="size-5" />
                ) : (
                  <Moon className="size-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* User Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                  >
                    <Avatar className="size-8">
                      <AvatarImage
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                        alt="User avatar"
                      />
                      <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLinkItem href="/dashboard" icon={LayoutDashboard}>
                    Dashboard
                  </DropdownMenuLinkItem>
                  <DropdownMenuLinkItem href="/profile" icon={User}>
                    My Profile
                  </DropdownMenuLinkItem>
                  <DropdownMenuLinkItem href="/bookings" icon={Calendar}>
                    My Bookings
                  </DropdownMenuLinkItem>
                  <DropdownMenuLinkItem href="/payments" icon={CreditCard}>
                    Payment History
                  </DropdownMenuLinkItem>
                  <DropdownMenuLinkItem href="/settings" icon={Settings}>
                    Settings
                  </DropdownMenuLinkItem>
                  <DropdownMenuLinkItem href="/help" icon={HelpCircle}>
                    Help Center
                  </DropdownMenuLinkItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => console.log('Logout')}
                    className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950 dark:focus:text-red-400 cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Login and Register Buttons */}
              <Button
                variant="ghost"
                onClick={() => {
                  window.location.href = '/login'
                }}
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  window.location.href = '/register'
                }}
              >
                Register
              </Button>
            </>
          )}

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
              className="md:hidden text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>

            <SheetContent side="left" className="w-64">
              <SheetTitle className="mb-4 text-lg font-bold">
                FixItNow
              </SheetTitle>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
