"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Package, ShoppingBag, Users, FileText, Settings, Menu, X, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LogoutDialog } from "@/components/logout-dialog"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Kategori",
      icon: Package,
      href: "/dashboard/categories",
      active: pathname === "/dashboard/categories",
    },
    {
      label: "Barang",
      icon: ShoppingBag,
      href: "/dashboard/items",
      active: pathname === "/dashboard/items",
    },
    {
      label: "Pelanggan",
      icon: Users,
      href: "/dashboard/customers",
      active: pathname === "/dashboard/customers",
    },
    {
      label: "Penyewaan",
      icon: FileText,
      href: "/dashboard/rentals",
      active: pathname === "/dashboard/rentals",
    },
    {
      label: "Denda",
      icon: FileText,
      href: "/dashboard/fines",
      active: pathname === "/dashboard/fines",
    },
    {
      label: "Pengaturan",
      icon: Settings,
      href: "/profile",
      active: pathname === "/profile",
    },
  ]

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 rounded-full md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <ShoppingBag className="h-5 w-5" />
                <span>KamuSewa</span>
              </Link>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close Menu</span>
                </Button>
              </SheetTrigger>
            </div>
            <nav className="flex-1 overflow-auto py-4">
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight">Menu</h2>
                <div className="space-y-1">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        route.active ? "bg-accent text-accent-foreground" : "transparent",
                      )}
                    >
                      <route.icon className="h-5 w-5" />
                      {route.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
            <div className="border-t p-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setIsLogoutDialogOpen(true)}
              >
                <LogOut className="h-5 w-5" />
                Keluar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background md:flex md:flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="h-5 w-5" />
            <span>KamuSewa</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight">Menu</h2>
            <div className="space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    route.active ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="border-t p-4">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setIsLogoutDialogOpen(true)}>
            <LogOut className="h-5 w-5" />
            Keluar
          </Button>
        </div>
      </div>

      {/* Logout Dialog */}
      <LogoutDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen} />
    </>
  )
}
