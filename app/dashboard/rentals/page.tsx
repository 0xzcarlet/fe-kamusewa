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
import { useState, useEffect } from "react"
import { RentalForm } from "@/components/forms/rental-form"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { rentalService } from "@/lib/api/services/rental.service"
import { Rental } from "@/lib/api/types/rental"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { DialogProvider, useDialog } from "@/components/dialog-context"

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

function RentalsPageContent() {
  const { openDialog, setDialogData } = useDialog()
  const [rentals, setRentals] = useState<Rental[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchRentals()
  }, [])

  const fetchRentals = async () => {
    try {
      setIsLoading(true)
      const response = await rentalService.getAll()
      if (response.data) {
        setRentals(response.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch rentals. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddRental = () => {
    setDialogData({
      onSubmit: handleFormSubmit,
    })
    openDialog("rental-form")
  }

  const handleEditRental = (rental: Rental) => {
    setDialogData({
      ...rental,
      onSubmit: handleFormSubmit,
    })
    openDialog("rental-form")
  }

  const handleFormSubmit = async () => {
    await fetchRentals()
  }

  const handleStatusUpdate = async (id: number, status: number) => {
    try {
      await rentalService.updateStatus(id, { status })
      toast({
        title: "Success",
        description: "Rental status updated successfully",
      })
      await fetchRentals()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch = rental.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.rental_number.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && rental.status === 1) ||
      (statusFilter === "completed" && rental.status === 2) ||
      (statusFilter === "overdue" && rental.status === 3)
    return matchesSearch && matchesStatus
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
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                      <SelectItem value="overdue">Terlambat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>Total {filteredRentals.length} penyewaan tercatat</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">No</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Barang</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredRentals.map((rental, index) => (
                      <TableRow key={rental.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
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
                                <span className="text-sm">{item.item_name} ({item.quantity}x)</span>
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
                          <Badge
                            variant={
                              rental.status === 1
                                ? "default"
                                : rental.status === 2
                                  ? "success"
                                  : "destructive"
                            }
                          >
                            {rental.status === 1 ? "Aktif" : rental.status === 2 ? "Selesai" : "Terlambat"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditRental(rental)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(rental.id, 2)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Selesai
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(rental.id, 3)}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Terlambat
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <RentalForm />
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
