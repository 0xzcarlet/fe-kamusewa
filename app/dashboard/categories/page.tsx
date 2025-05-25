"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FolderTree, Plus, Search, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { CategoryForm } from "@/components/forms/category-form"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { DialogProvider, useDialog } from "@/components/dialog-context"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { categoryService, type Category } from "@/lib/api"
import { CustomDialog } from "@/components/custom-dialog"

// Wrap the main content with the dialog provider
function CategoriesPageContent() {
  const { openDialog, setDialogData } = useDialog()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCategory = () => {
    setDialogData({
      onSubmit: handleFormSubmit,
    })
    openDialog("category-form")
  }

  const handleEditCategory = (category: Category) => {
    setDialogData({
      ...category,
      onSubmit: handleFormSubmit,
    })
    openDialog("category-form")
  }

  const handleDeleteCategory = (category: Category) => {
    setDialogData({
      itemName: category.category_name,
      onConfirm: async () => {
        try {
          const response = await categoryService.delete(category.id)

          if (response.status === "success") {
            // Remove the category from the state
            setCategories((prev) => prev.filter((c) => c.id !== category.id))

            toast({
              title: "Kategori berhasil dihapus",
              description: `Kategori ${category.category_name} telah dihapus.`,
            })
          } else {
            throw new Error(response.message || "Failed to delete category")
          }
        } catch (error) {
          console.error("Error deleting category:", error)
          toast({
            title: "Error",
            description: "Gagal menghapus kategori",
            variant: "destructive",
          })
        }
      },
    })
    openDialog("delete-confirmation")
  }

  const handleFormSubmit = () => {
    // Refresh the categories list after form submission
    fetchCategories()
  }

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) =>
      category.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-6 pt-20 md:pt-6 md:p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Manajemen Kategori</h1>
              <p className="text-muted-foreground">Kelola kategori barang yang tersedia untuk disewa</p>
            </div>
            <Button className="gap-1" onClick={handleAddCategory}>
              <Plus className="h-4 w-4" /> Tambah Kategori
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Daftar Kategori</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari kategori..."
                    className="w-full bg-background pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <CardDescription>Total {filteredCategories.length} kategori tersedia</CardDescription>
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
                      <TableHead>Nama Kategori</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          {searchQuery ? "Tidak ada kategori yang sesuai dengan pencarian" : "Belum ada kategori"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FolderTree className="h-4 w-4 text-muted-foreground" />
                              {category.category_name}
                            </div>
                          </TableCell>
                          <TableCell>{category.description || "-"}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Aksi</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteCategory(category)}
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
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Render all dialogs */}
      <DeleteConfirmation />
      <CategoryForm />
      <Toaster />
    </div>
  )
}

// Wrap the page with the dialog provider
export default function CategoriesPage() {
  return (
    <DialogProvider>
      <CategoriesPageContent />
    </DialogProvider>
  )
}
