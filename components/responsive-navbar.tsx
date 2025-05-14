"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Package, Menu, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/ui/container"
import { useDialog } from "@/components/dialog-context"

interface NavItem {
  href: string
  label: string
}

export function ResponsiveNavbar() {
  const { openDialog } = useDialog()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/categories", label: "Kategori" },
    { href: "/dashboard/items", label: "Barang" },
    { href: "/dashboard/customers", label: "Pelanggan" },
    { href: "/dashboard/rentals", label: "Penyewaan" },
    { href: "/dashboard/fines", label: "Denda" },
  ]

  const handleLogout = () => {
    setOpen(false)
    openDialog("logout")
  }

  return (
    <>
      <header className="sticky top-0 z-10 h-16 border-b bg-background">
        <Container className="flex h-full items-center">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span>KamuSewa</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center gap-6 ml-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("text-sm font-medium", pathname === item.href ? "" : "text-muted-foreground")}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden ml-auto">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
                      <Package className="h-6 w-6" />
                      <span>KamuSewa</span>
                    </Link>
                  </div>
                  <nav className="flex flex-col p-4 gap-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center h-10 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                        )}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
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

          <div className="ml-auto hidden md:flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile">
                <User className="h-4 w-4 mr-2" />
                Profil
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => openDialog("logout")}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </Container>
      </header>
    </>
  )
}
