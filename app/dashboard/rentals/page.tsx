"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Eye,
  Calendar,
  Clock,
  Users,
  ShoppingBag,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { RentalForm } from "@/components/forms/rental-form"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

// Simple date formatter function to replace date-fns
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

// Calculate days between two dates
function calculateDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default function RentalsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRental, setEditingRental] = useState<any>(null)

  // Sample data for rentals
  const rentals = [
    {
      id: 1001,
      customer: "Budi Santoso",
      items: ["Kamera Sony A7III", "Tripod Manfrotto"],
      startDate: "2023-05-10",
      endDate: "2023-05-15",
      totalAmount: 1250000,
      status: "Selesai",
    },
    {
      id: 1002,
      customer: "Siti Rahayu",
      items: ["Sound System 500W"],
      startDate: "2023-05-12",
      endDate: "2023-05-14",
      totalAmount: 1000000,
      status: "Selesai",
    },
    {
      id: 1003,
      customer: "Ahmad Hidayat",
      items: ["Proyektor Epson"],
      startDate: "2023-05-15",
      endDate: "2023-05-18",
      totalAmount: 600000,
      status: "Selesai",
    },
    {
      id: 1004,
      customer: "Dewi Lestari",
      items: ["Laptop MacBook Pro"],
      startDate: "2023-05-18",
      endDate: "2023-05-25",
      totalAmount: 2450000,
      status: "Aktif",
    },
    {
      id: 1005,
      customer: "Eko Prasetyo",
      items: ["Sound System 500W", "LED Light Panel", "Tripod Manfrotto"],
      startDate: "2023-05-20",
      endDate: "2023-05-27",
      totalAmount: 4750000,
      status: "Aktif",
    },
    {
      id: 1006,
      customer: "Rina Wijaya",
      items: ["Kamera Sony A7III", "Lensa Canon 24-70mm"],
      startDate: "2023-05-22",
      endDate: "2023-05-24",
      totalAmount: 800000,
      status: "Dibatalkan",
    },
    {
      id: 1007,
      customer: "Doni Kusuma",
      items: ["Laptop MacBook Pro"],
      startDate: "2023-05-25",
      endDate: "2023-06-01",
      totalAmount: 2450000,
      status: "Aktif",
    },
    {
      id: 1008,
      customer: "Maya Sari",
      items: ["Drone DJI Mavic"],
      startDate: "2023-05-28",
      endDate: "2023-05-30",
      totalAmount: 900000,
      status: "Menunggu Pengambilan",
    },
  ]

  const handleAddRental = () => {
    setEditingRental(null)
    setIsFormOpen(true)
  }

  const handleEditRental = (rental: any) => {
    setEditingRental(rental)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data)
    // Here you would typically save the data to your backend
    setIsFormOpen(false)
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-6 pt-20 md:pt-6 md:p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Manajemen Penyewaan</h1>
              <p className="text-muted-foreground">Kelola semua transaksi penyewaan barang</p>
            </div>
            <Button className="gap-1" onClick={handleAddRental}>
              <Plus className="h-4 w-4" /> Tambah Penyewaan
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <CardTitle>Daftar Penyewaan</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Cari penyewaan..." className="w-full bg-background pl-8" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="waiting">Menunggu Pengambilan</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                      <SelectItem value="canceled">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>Total {rentals.length} penyewaan tercatat</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Barang</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell className="font-medium">{rental.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {rental.customer}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {rental.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">
                              {formatDate(rental.startDate)} s/d {formatDate(rental.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">
                              {calculateDaysBetween(rental.startDate, rental.endDate)} hari
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">Rp {rental.totalAmount.toLocaleString("id-ID")}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            rental.status === "Aktif"
                              ? "default"
                              : rental.status === "Selesai"
                                ? "success"
                                : rental.status === "Dibatalkan"
                                  ? "destructive"
                                  : "secondary"
                          }
                        >
                          {rental.status}
                        </Badge>
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
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" /> Cetak Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditRental(rental)}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            {rental.status === "Aktif" && (
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" /> Tandai Selesai
                              </DropdownMenuItem>
                            )}
                            {rental.status === "Menunggu Pengambilan" && (
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" /> Konfirmasi Pengambilan
                              </DropdownMenuItem>
                            )}
                            {(rental.status === "Menunggu Pengambilan" || rental.status === "Aktif") && (
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="mr-2 h-4 w-4" /> Batalkan
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <RentalForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingRental}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
