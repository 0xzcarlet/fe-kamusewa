"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, ShoppingBag, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TablePagination } from "@/components/table-pagination"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { DialogProvider, useDialog } from "@/components/dialog-context"
import { ItemDetail } from "@/components/item-detail"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import { LogoutDialog } from "@/components/logout-dialog"
import { ItemForm } from "@/components/forms/item-form"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { itemService, categoryService, type Item, type Category } from "@/lib/api-service"

// Wrap the main content with the dialog provider
function ItemsPageContent() {
  const { openDialog, setDialogData } = useDialog()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [categories, setCategories] = useState<Category[]>([])

  // Data state
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)

  // Fetch items and categories on component mount
  useEffect(() => {
    fetchCategories()
    fetchItems()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll()

      if (response.status === "success" && response.data) {
        setCategories(response.data)
      } else {
        toast({
          title: "Error",
          description: response.message || "Gagal memuat data kategori",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data kategori",
        variant: "destructive",
      })
    }
  }

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      const response = await itemService.getAll()

      if (response.status === "success" && response.data) {
        // Filter items based on search query and category filter
        // Note: This is client-side filtering since the API doesn't support filtering yet
        let filteredItems = response.data

        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase()
          filteredItems = filteredItems.filter(
            (item) =>
              item.item_name.toLowerCase().includes(searchLower) ||
              (item.description && item.description.toLowerCase().includes(searchLower)),
          )
        }

        if (categoryFilter !== "all") {
          const categoryId = Number(categoryFilter)
          filteredItems = filteredItems.filter((item) => item.categories.some((cat) => cat.id === categoryId))
        }

        setItems(filteredItems)
        setTotalItems(filteredItems.length)
      } else {
        toast({
          title: "Error",
          description: response.message || "Gagal memuat data barang",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching items:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data barang",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddItem = () => {
    setDialogData({
      onSubmit: handleFormSubmit,
    })
    openDialog("item-form")
  }

  const handleEditItem = (item: Item) => {
    setDialogData({
      ...item,
      onSubmit: handleFormSubmit,
    })
    openDialog("item-form")
  }

  const handleViewItem = (item: Item) => {
    setDialogData(item)
    openDialog("item-detail")
  }

  const handleDeleteItem = (item: Item) => {
    setDialogData({
      itemName: item.item_name,
      onConfirm: async () => {
        try {
          const response = await itemService.delete(item.id)

          if (response.status === "success") {
            // Remove the item from the state
            setItems((prevItems) => prevItems.filter((i) => i.id !== item.id))
            setTotalItems((prev) => prev - 1)

            toast({
              title: "Barang berhasil dihapus",
              description: `${item.item_name} telah dihapus dari daftar barang.`,
            })
          } else {
            throw new Error(response.message || "Failed to delete item")
          }
        } catch (error) {
          console.error("Error deleting item:", error)
          toast({
            title: "Error",
            description: "Gagal menghapus barang",
            variant: "destructive",
          })
        }
      },
    })
    openDialog("delete-confirmation")
  }

  const handleFormSubmit = () => {
    // Refresh the items list after form submission
    fetchItems()
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

  // Paginate items
  const paginatedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Helper function to get category name from an item
  const getCategoryName = (item: Item) => {
    if (item.categories && item.categories.length > 0) {
      return item.categories[0].category_name
    }
    return "Uncategorized"
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-6 pt-20 md:pt-6 md:p-8 max-w-7xl mx-auto">
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
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>Total {totalItems} barang tersedia</CardDescription>
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
                      <TableHead>Nama Barang</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Harga Sewa/Hari</TableHead>
                      <TableHead>Stok</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          {searchQuery || categoryFilter !== "all"
                            ? "Tidak ada barang yang sesuai dengan pencarian"
                            : "Belum ada barang"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                              {item.item_name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {getCategoryName(item)}
                            </Badge>
                          </TableCell>
                          <TableCell>Rp {item.rental_price.toLocaleString("id-ID")}</TableCell>
                          <TableCell>
                            {item.available_stock} / {item.total_stock} unit
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.available_stock > 0 ? "success" : "secondary"}>
                              {item.available_stock > 0 ? "Tersedia" : "Tidak Tersedia"}
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
                      ))
                    )}
                  </TableBody>
                </Table>
              )}

              <TablePagination
                totalItems={totalItems}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Render all dialogs */}
      <ItemDetail />
      <DeleteConfirmation />
      <LogoutDialog />
      <ItemForm />

      <Toaster />
    </div>
  )
}

// Wrap the page with the dialog provider
export default function ItemsPage() {
  return (
    <DialogProvider>
      <ItemsPageContent />
    </DialogProvider>
  )
}
