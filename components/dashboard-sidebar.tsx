"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Package, Menu, User, LogOut, Home, FolderTree, ShoppingBag, Users, Calendar, AlertCircle } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useDialog } from "@/components/dialog-context"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { LogoutDialog } from "@/components/logout-dialog"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  subItems?: { href: string; label: string }[]
}

export function DashboardSidebar() {
  const { openDialog } = useDialog()
  const [open, setOpen] = useState(false)
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({})
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const pathname = usePathname()

  // Initialize open submenus based on current path
  useEffect(() => {
    const newOpenSubmenus: Record<string, boolean> = {}
    navItems.forEach((item, index) => {
      if (item.subItems) {
        // Check if current path is the main item or any of its subitems
        const isActive = pathname === item.href || item.subItems.some((subItem) => pathname === subItem.href)
        if (isActive) {
          newOpenSubmenus[index] = true
        }
      }
    })
    setOpenSubmenus(newOpenSubmenus)
  }, [pathname])

  const navItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      subItems: [{ href: "/dashboard/analytics", label: "Analitik" }],
    },
    {
      href: "/dashboard/categories",
      label: "Kategori",
      icon: FolderTree,
      subItems: [{ href: "/dashboard/categories/reports", label: "Laporan Kategori" }],
    },
    {
      href: "/dashboard/items",
      label: "Barang",
      icon: ShoppingBag,
      subItems: [{ href: "/dashboard/items/inventory", label: "Inventaris" }],
    },
    {
      href: "/dashboard/customers",
      label: "Pelanggan",
      icon: Users,
      subItems: [{ href: "/dashboard/customers/vip", label: "Pelanggan VIP" }],
    },
    {
      href: "/dashboard/rentals",
      label: "Penyewaan",
      icon: Calendar,
      subItems: [{ href: "/dashboard/rentals/history", label: "Riwayat Penyewaan" }],
    },
    {
      href: "/dashboard/fines",
      label: "Denda",
      icon: AlertCircle,
      subItems: [{ href: "/dashboard/fines/reports", label: "Laporan Denda" }],
    },
  ]

  const handleLogout = () => {
    setOpen(false)
    setShowLogoutDialog(true)
  }

  const toggleSubmenu = (index: number) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Check if a menu item or any of its subitems is active
  const isMenuActive = (item: NavItem) => {
    if (pathname === item.href) return true
    if (item.subItems && item.subItems.some((subItem) => pathname === subItem.href)) return true
    return false
  }

  // For mobile
  const MobileSidebar = () => (
    <div className="md:hidden fixed top-0 left-0 z-40 w-full h-16 flex items-center px-4 bg-background border-b">
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span>KamuSewa</span>
          </Link>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-auto">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
                <Package className="h-6 w-6" />
                <span>KamuSewa</span>
              </Link>
            </div>
            <nav className="flex flex-col p-4 gap-1 overflow-y-auto">
              {navItems.map((item, index) => (
                <div key={item.href} className="flex flex-col">
                  {item.subItems && item.subItems.length > 0 ? (
                    <Collapsible
                      open={openSubmenus[index]}
                      onOpenChange={() => toggleSubmenu(index)}
                      className="w-full"
                    >
                      <CollapsibleTrigger asChild>
                        <button
                          className={cn(
                            "flex items-center justify-between w-full h-10 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            isMenuActive(item)
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                          )}
                        >
                          <div className="flex items-center">
                            <item.icon className="h-4 w-4 mr-2" />
                            {item.label}
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              openSubmenus[index] && "transform rotate-180",
                            )}
                          />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-6 pt-1">
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center h-8 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            pathname === item.href
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                          )}
                          onClick={() => setOpen(false)}
                        >
                          Overview
                        </Link>
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "flex items-center h-8 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                              pathname === subItem.href
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                            )}
                            onClick={() => setOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center h-10 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            <div className="mt-auto p-4 border-t">
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" asChild onClick={() => setOpen(false)}>
                  <Link href="/profile" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Profil
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )

  // For desktop
  return (
    <>
      <MobileSidebar />

      <div className="hidden md:flex h-screen w-64 flex-col border-r bg-background fixed left-0 top-0 overflow-hidden">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span>KamuSewa</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={item.href}>
                {item.subItems && item.subItems.length > 0 ? (
                  <Collapsible open={openSubmenus[index]} onOpenChange={() => toggleSubmenu(index)} className="w-full">
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center justify-between w-full h-10 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          isMenuActive(item)
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                        )}
                      >
                        <div className="flex items-center">
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </div>
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform", openSubmenus[index] && "transform rotate-180")}
                        />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 pt-1">
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center h-8 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                        )}
                      >
                        Overview
                      </Link>
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center h-8 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            pathname === subItem.href
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                          )}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center h-10 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Profil
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>
      <LogoutDialog 
        open={showLogoutDialog} 
        onOpenChange={setShowLogoutDialog} 
      />
    </>
  )
}
