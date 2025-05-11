"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, ShoppingBag } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ItemForm } from "@/components/forms/item-form"
import { TablePagination } from "@/components/table-pagination"
import { LogoutDialog } from "@/components/logout-dialog"
import { ResponsiveNavbar } from "@/components/responsive-navbar"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import { ItemDetail } from "@/components/item-detail"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ItemsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Sample data for items with images
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Kamera Sony A7III",
      category: "Kamera & Fotografi",
      price: 250000,
      stock: 5,
      status: "Tersedia",
      description: "Kamera mirrorless full-frame dengan kualitas gambar yang sangat baik",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Sound System 500W",
      category: "Audio & Sound System",
      price: 500000,
      stock: 3,
      status: "Tersedia",
      description: "Sound system lengkap dengan speaker, mixer, dan mikrofon",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Proyektor Epson",
      category: "Proyektor & Display",
      price: 200000,
      stock: 4,
      status: "Tersedia",
      description: "Proyektor HD dengan brightness tinggi",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      name: "Laptop MacBook Pro",
      category: "Komputer & Laptop",
      price: 350000,
      stock: 2,
      status: "Disewa",
      description: "Laptop MacBook Pro 16 inch dengan spesifikasi tinggi",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      name: "Drone DJI Mavic",
      category: "Drone & Peralatan Aerial",
      price: 450000,
      stock: 2,
      status: "Tersedia",
      description: "Drone dengan kamera 4K dan stabilisasi gambar",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      name: "Lensa Canon 24-70mm",
      category: "Lensa Kamera",
      price: 150000,
      stock: 3,
      status: "Disewa",
      description: "Lensa zoom standar dengan aperture f/2.8",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 7,
      name: "Tripod Manfrotto",
      category: "Tripod & Stabilizer",
      price: 75000,
      stock: 8,
      status: "Tersedia",
      description: "Tripod profesional dengan kepala fluid untuk video",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 8,
      name: "LED Light Panel",
      category: "Lighting",
      price: 100000,
      stock: 6,
      status: "Tersedia",
      description: "Panel lampu LED dengan temperatur warna yang dapat diatur",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 9,
      name: "Kamera Canon EOS R5",
      category: "Kamera & Fotografi",
      price: 350000,
      stock: 2,
      status: "Tersedia",
      description: "Kamera mirrorless full-frame dengan kemampuan video 8K",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 10,
      name: "Microphone Rode NTG",
      category: "Audio & Sound System",
      price: 120000,
      stock: 4,
      status: "Tersedia",
      description: "Mikrofon shotgun untuk video dan film",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 11,
      name: "Proyektor BenQ",
      category: "Proyektor & Display",
      price: 180000,
      stock: 3,
      status: "Disewa",
      description: "Proyektor 4K untuk home theater",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 12,
      name: "Laptop Dell XPS",
      category: "Komputer & Laptop",
      price: 300000,
      stock: 2,
      status: "Tersedia",
      description: "Laptop premium dengan layar 4K",
      image: "/placeholder.svg?height=200&width=300",
    },
  ])

  // Filter and paginate items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || item.category.toLowerCase().includes(categoryFilter.toLowerCase())
    return matchesSearch && matchesCategory
  })

  const totalItems = filteredItems.length
  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleAddItem = () => {
    setEditingItem(null)
    setIsFormOpen(true)
  }

  const handleEditItem = (item: any) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  const handleViewItem = (item: any) => {
    setSelectedItem(item)
    setShowDetailDialog(true)
  }

  const handleDeleteItem = (item: any) => {
    setItemToDelete(item)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      // In a real app, you would call an API to delete the item
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemToDelete.id))
      toast({
        title: "Barang berhasil dihapus",
        description: `${itemToDelete.name} telah dihapus dari daftar barang.`,
      })
      setShowDeleteDialog(false)
      setItemToDelete(null)
    }
  }

  const handleFormSubmit = (data: any) => {
    // In a real app, you would call an API to save the data
    if (data.id) {
      // Update existing item
      setItems((prevItems) => prevItems.map((item) => (item.id === data.id ? { ...item, ...data } : item)))
      toast({
        title: "Barang berhasil diperbarui",
        description: `Perubahan pada ${data.name} telah disimpan.`,
      })
    } else {
      // Add new item
      const newItem = {
        ...data,
        id: items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1,
      }
      setItems((prevItems) => [...prevItems, newItem])
      toast({
        title: "Barang berhasil ditambahkan",
        description: `${data.name} telah ditambahkan ke daftar barang.`,
      })
    }
    setIsFormOpen(false)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleEditFromDetail = () => {
    setEditingItem(selectedItem)
    setShowDetailDialog(false)
    setIsFormOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ResponsiveNavbar />
      <main className="flex-1 p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Manajemen Barang</h1>
            <p className="text-muted-foreground">Kelola barang yang tersedia untuk disewa</p>
          </div>
          <Button className="gap-1" onClick={handleAddItem}>
            <Plus className="h-4 w-4" /> Tambah Barang
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <CardTitle>Daftar Barang</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari barang..."
                    className="w-full bg-background pl-8"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    <SelectItem value="Kamera">Kamera & Fotografi</SelectItem>
                    <SelectItem value="Audio">Audio & Sound System</SelectItem>
                    <SelectItem value="Proyektor">Proyektor & Display</SelectItem>
                    <SelectItem value="Komputer">Komputer & Laptop</SelectItem>
                    <SelectItem value="Drone">Drone & Peralatan Aerial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription>Total {totalItems} barang tersedia</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga Sewa/Hari</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.image ? (
                          <div className="h-8 w-8 rounded-md overflow-hidden">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        )}
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>Rp {item.price.toLocaleString("id-ID")}</TableCell>
                    <TableCell>{item.stock} unit</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Tersedia" ? "success" : "secondary"}>{item.status}</Badge>
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
                          <DropdownMenuItem onClick={() => handleViewItem(item)}>
                            <Eye className="mr-2 h-4 w-4" /> Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditItem(item)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteItem(item)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              totalItems={totalItems}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </CardContent>
        </Card>
      </main>

      {/* Forms and Dialogs */}
      <ItemForm open={isFormOpen} onOpenChange={setIsFormOpen} initialData={editingItem} onSubmit={handleFormSubmit} />

      <LogoutDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog} />

      <DeleteConfirmation
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name}
      />

      <ItemDetail
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        item={selectedItem}
        onEdit={handleEditFromDetail}
      />

      <Toaster />
    </div>
  )
}
