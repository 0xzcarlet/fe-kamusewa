"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Package, Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, Users, Mail, Phone } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
// Import the CustomerForm component
import { useState } from "react"
import { CustomerForm } from "@/components/forms/customer-form"

// Replace the existing export default function with this updated version
export default function CustomersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<any>(null)

  // Sample data for customers
  const customers = [
    {
      id: 1,
      name: "Budi Santoso",
      email: "budi@example.com",
      phone: "081234567890",
      address: "Jl. Sudirman No. 123, Jakarta",
      activeRentals: 2,
      status: "Aktif",
    },
    {
      id: 2,
      name: "Siti Rahayu",
      email: "siti@example.com",
      phone: "081234567891",
      address: "Jl. Thamrin No. 45, Jakarta",
      activeRentals: 0,
      status: "Aktif",
    },
    {
      id: 3,
      name: "Ahmad Hidayat",
      email: "ahmad@example.com",
      phone: "081234567892",
      address: "Jl. Gatot Subroto No. 67, Jakarta",
      activeRentals: 1,
      status: "Aktif",
    },
    {
      id: 4,
      name: "Dewi Lestari",
      email: "dewi@example.com",
      phone: "081234567893",
      address: "Jl. Kuningan No. 89, Jakarta",
      activeRentals: 0,
      status: "Aktif",
    },
    {
      id: 5,
      name: "Eko Prasetyo",
      email: "eko@example.com",
      phone: "081234567894",
      address: "Jl. Menteng No. 12, Jakarta",
      activeRentals: 3,
      status: "Aktif",
    },
    {
      id: 6,
      name: "Rina Wijaya",
      email: "rina@example.com",
      phone: "081234567895",
      address: "Jl. Kemang No. 34, Jakarta",
      activeRentals: 0,
      status: "Tidak Aktif",
    },
    {
      id: 7,
      name: "Doni Kusuma",
      email: "doni@example.com",
      phone: "081234567896",
      address: "Jl. Senayan No. 56, Jakarta",
      activeRentals: 1,
      status: "Aktif",
    },
    {
      id: 8,
      name: "Maya Sari",
      email: "maya@example.com",
      phone: "081234567897",
      address: "Jl. Cikini No. 78, Jakarta",
      activeRentals: 0,
      status: "Aktif",
    },
  ]

  const handleAddCustomer = () => {
    setEditingCustomer(null)
    setIsFormOpen(true)
  }

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data)
    // Here you would typically save the data to your backend
    setIsFormOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>KamuSewa</span>
        </Link>
        <nav className="hidden flex-1 items-center gap-6 md:flex">
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground">
            Dashboard
          </Link>
          <Link href="/dashboard/categories" className="text-sm font-medium text-muted-foreground">
            Kategori
          </Link>
          <Link href="/dashboard/items" className="text-sm font-medium text-muted-foreground">
            Barang
          </Link>
          <Link href="/dashboard/customers" className="text-sm font-medium">
            Pelanggan
          </Link>
          <Link href="/dashboard/rentals" className="text-sm font-medium text-muted-foreground">
            Penyewaan
          </Link>
          <Link href="/dashboard/fines" className="text-sm font-medium text-muted-foreground">
            Denda
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">
            Profil
          </Button>
          <Button variant="outline" size="sm">
            Keluar
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Manajemen Pelanggan</h1>
            <p className="text-muted-foreground">Kelola data pelanggan yang terdaftar</p>
          </div>
          <Button className="gap-1" onClick={handleAddCustomer}>
            <Plus className="h-4 w-4" /> Tambah Pelanggan
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Pelanggan</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Cari pelanggan..." className="w-full bg-background pl-8" />
              </div>
            </div>
            <CardDescription>Total {customers.length} pelanggan terdaftar</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Penyewaan Aktif</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {customer.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.activeRentals} penyewaan</TableCell>
                    <TableCell>
                      <Badge variant={customer.status === "Aktif" ? "success" : "secondary"}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Aksi</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <CustomerForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingCustomer}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
