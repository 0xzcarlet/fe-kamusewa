"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Calendar,
  Clock,
  Users,
  ShoppingBag,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RentalForm } from "@/components/forms/rental-form"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { rentalService, type Rental } from "@/lib/api-service"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import { DialogProvider, useDialog } from "@/components/dialog-context"

// Simple date formatter function
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

// Get status badge variant
function getStatusBadgeVariant(status: number) {
  switch (status) {
    case 1: // Active
      return "default"
    case 2: // Completed
      return "success"
    case 3: // Overdue
      return "destructive"
    default:
      return "secondary"
  }
}

// Get status text
function getStatusText(status: number) {
  switch (status) {
    case 1:
      return "Aktif"
    case 2:
      return "Selesai"
    case 3:
      return "Terlambat"
    default:
      return "Tidak Diketahui"
  }
}

function RentalsPageContent() {
  const { openDialog, setDialogData } = useDialog()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRental, setEditingRental] = useState<Rental | undefined>(undefined)
  const [rentals, setRentals] = useState<Rental[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchRentals()
  }, [])

  const fetchRentals = async () => {
    setIsLoading(true)
    try {
      const response = await rentalService.getAll()
      if (response.status === "success" && response.data) {
        setRentals(response.data)
      } else {
        toast({
          title: "Error",
          description: response.message || "Gagal memuat data penyewaan",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching rentals:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data penyewaan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddRental = () => {
    setEditingRental(undefined)
    setIsFormOpen(true)
  }

  const handleEditRental = (rental: Rental) => {
    setEditingRental(rental)
    setIsFormOpen(true)
  }

  const handleDeleteRental = (rental: Rental) => {
    setDialogData({
      itemName: rental.title,
      onConfirm: async () => {
        try {
          const response = await rentalService.delete(rental.id)
          if (response.status === "success") {
            setRentals((prev) => prev.filter((r) => r.id !== rental.id))
            toast({
              title: "Penyewaan berhasil dihapus",
              description: `${rental.title} telah dihapus dari daftar penyewaan.`,
            })
          } else {
            throw new Error(response.message || "Gagal menghapus penyewaan")
          }
        } catch (error) {
          console.error("Error deleting rental:", error)
          toast({
            title: "Error",
            description: "Gagal menghapus penyewaan",
            variant: "destructive",
          })
        }
      },
    })
    openDialog("delete-confirmation")
  }

  const handleUpdateRentalStatus = async (rental: Rental, newStatus: number) => {
    try {
      const response = await rentalService.updateStatus(rental.id, { status: newStatus })
      if (response.status === "success" && response.data) {
        setRentals((prev) => prev.map((r) => (r.id === rental.id ? { ...r, status: newStatus } : r)))
        toast({
          title: "Status penyewaan berhasil diperbarui",
          description: `Status penyewaan ${rental.title} telah diperbarui menjadi ${getStatusText(newStatus)}.`,
        })
      } else {
        throw new Error(response.message || "Gagal memperbarui status penyewaan")
      }
    } catch (error) {
      console.error("Error updating rental status:", error)
      toast({
        title: "Error",
        description: "Gagal memperbarui status penyewaan",
        variant: "destructive",
      })
    }
  }

  const handleFormSubmit = (data: Rental) => {
    if (editingRental) {
      // Update existing rental in the list
      setRentals((prev) => prev.map((r) => (r.id === data.id ? data : r)))
    } else {
      // Add new rental to the list
      setRentals((prev) => [...prev, data])
    }
  }

  // Filter rentals based on search query and status filter
  const filteredRentals = rentals.filter((rental) => {
    // Filter by status
    if (statusFilter !== "all") {
      const statusNumber = Number.parseInt(statusFilter)
      if (rental.status !== statusNumber) return false
    }

    // Filter by search query
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      rental.title.toLowerCase().includes(query) ||
      rental.customer_name.toLowerCase().includes(query) ||
      rental.rental_number.toLowerCase().includes(query) ||
      rental.rental_items.some((item) => item.item_name.toLowerCase().includes(query))
    )
  })

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
                    <Input
                      type="search"
                      placeholder="Cari penyewaan..."
                      className="w-full bg-background pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="1">Aktif</SelectItem>
                      <SelectItem value="2">Selesai</SelectItem>
                      <SelectItem value="3">Terlambat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>Total {filteredRentals.length} penyewaan tercatat</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2">Memuat data...</p>
                </div>
              ) : (
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
                    {filteredRentals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          {searchQuery || statusFilter !== "all"
                            ? "Tidak ada penyewaan yang sesuai dengan pencarian"
                            : "Belum ada penyewaan"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRentals.map((rental) => (
                        <TableRow key={rental.id}>
                          <TableCell className="font-medium">{rental.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {rental.customer_name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {rental.rental_items.map((item, index) => (
                                <div key={index} className="flex items-center gap-1">
                                  <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="text-sm">
                                    {item.item_name} x{item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm">
                                  {formatDate(rental.start_date)} s/d {formatDate(rental.end_date)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm">
                                  {calculateDaysBetween(rental.start_date, rental.end_date)} hari
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">Rp {rental.total_cost.toLocaleString("id-ID")}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(rental.status)}>{getStatusText(rental.status)}</Badge>
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
                                <DropdownMenuItem onClick={() => handleEditRental(rental)}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" /> Cetak Invoice
                                </DropdownMenuItem>
                                {rental.status === 1 && (
                                  <DropdownMenuItem onClick={() => handleUpdateRentalStatus(rental, 2)}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Tandai Selesai
                                  </DropdownMenuItem>
                                )}
                                {rental.status === 1 && (
                                  <DropdownMenuItem onClick={() => handleUpdateRentalStatus(rental, 3)}>
                                    <XCircle className="mr-2 h-4 w-4" /> Tandai Terlambat
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteRental(rental)}
                                >
                                  <XCircle className="mr-2 h-4 w-4" /> Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
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
      <DeleteConfirmation />
      <Toaster />
    </div>
  )
}

export default function RentalsPage() {
  return (
    <DialogProvider>
      <RentalsPageContent />
    </DialogProvider>
  )
}
