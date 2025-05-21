"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, AlertCircle, Calendar, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { FineForm } from "@/components/forms/fine-form"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function FinesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingFine, setEditingFine] = useState<any>(null)

  // Sample data for fines
  const fines = [
    {
      id: 1,
      rentalId: 1001,
      customer: "Budi Santoso",
      item: "Kamera Sony A7III",
      amount: 250000,
      reason: "Keterlambatan 5 hari",
      date: "2023-05-15",
      status: "Belum Dibayar",
    },
    {
      id: 2,
      rentalId: 1003,
      customer: "Ahmad Hidayat",
      item: "Proyektor Epson",
      amount: 100000,
      reason: "Keterlambatan 2 hari",
      date: "2023-05-18",
      status: "Sudah Dibayar",
    },
    {
      id: 3,
      rentalId: 1005,
      customer: "Eko Prasetyo",
      item: "Sound System 500W",
      amount: 300000,
      reason: "Kerusakan peralatan",
      date: "2023-05-20",
      status: "Belum Dibayar",
    },
    {
      id: 4,
      rentalId: 1007,
      customer: "Doni Kusuma",
      item: "Laptop MacBook Pro",
      amount: 500000,
      reason: "Kerusakan layar",
      date: "2023-05-22",
      status: "Belum Dibayar",
    },
    {
      id: 5,
      rentalId: 1010,
      customer: "Siti Rahayu",
      item: "Drone DJI Mavic",
      amount: 750000,
      reason: "Kerusakan propeller",
      date: "2023-05-25",
      status: "Sudah Dibayar",
    },
    {
      id: 6,
      rentalId: 1012,
      customer: "Dewi Lestari",
      item: "Lensa Canon 24-70mm",
      amount: 200000,
      reason: "Keterlambatan 4 hari",
      date: "2023-05-28",
      status: "Belum Dibayar",
    },
    {
      id: 7,
      rentalId: 1015,
      customer: "Maya Sari",
      item: "Tripod Manfrotto",
      amount: 75000,
      reason: "Keterlambatan 3 hari",
      date: "2023-05-30",
      status: "Sudah Dibayar",
    },
    {
      id: 8,
      rentalId: 1018,
      customer: "Rina Wijaya",
      item: "LED Light Panel",
      amount: 150000,
      reason: "Kerusakan lampu",
      date: "2023-06-02",
      status: "Belum Dibayar",
    },
  ]

  const handleAddFine = () => {
    setEditingFine(null)
    setIsFormOpen(true)
  }

  const handleEditFine = (fine: any) => {
    setEditingFine(fine)
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
              <h1 className="text-3xl font-bold">Manajemen Denda</h1>
              <p className="text-muted-foreground">Kelola denda untuk keterlambatan dan kerusakan</p>
            </div>
            <Button className="gap-1" onClick={handleAddFine}>
              <Plus className="h-4 w-4" /> Tambah Denda
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <CardTitle>Daftar Denda</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Cari denda..." className="w-full bg-background pl-8" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="unpaid">Belum Dibayar</SelectItem>
                      <SelectItem value="paid">Sudah Dibayar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>Total {fines.length} denda tercatat</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Barang</TableHead>
                    <TableHead>Alasan</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fines.map((fine) => (
                    <TableRow key={fine.id}>
                      <TableCell className="font-medium">{fine.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{fine.customer}</span>
                          <span className="text-xs text-muted-foreground">Penyewaan #{fine.rentalId}</span>
                        </div>
                      </TableCell>
                      <TableCell>{fine.item}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                          {fine.reason}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">Rp {fine.amount.toLocaleString("id-ID")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {fine.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={fine.status === "Sudah Dibayar" ? "success" : "destructive"}>
                          {fine.status}
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
                            <DropdownMenuItem onClick={() => handleEditFine(fine)}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            {fine.status === "Belum Dibayar" && (
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" /> Tandai Sudah Dibayar
                              </DropdownMenuItem>
                            )}
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
        </div>
      </main>
      <FineForm open={isFormOpen} onOpenChange={setIsFormOpen} initialData={editingFine} onSubmit={handleFormSubmit} />
    </div>
  )
}
