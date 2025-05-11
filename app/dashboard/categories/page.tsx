"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FolderTree, Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { CategoryForm } from "@/components/forms/category-form"
import { ResponsiveNavbar } from "@/components/responsive-navbar"
import { Container } from "@/components/ui/container"

export default function CategoriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)

  // Sample data for categories
  const categories = [
    { id: 1, name: "Kamera & Fotografi", description: "Peralatan fotografi dan videografi", itemCount: 25 },
    { id: 2, name: "Audio & Sound System", description: "Peralatan audio dan sound system", itemCount: 18 },
    { id: 3, name: "Proyektor & Display", description: "Peralatan proyeksi dan display", itemCount: 12 },
    { id: 4, name: "Komputer & Laptop", description: "Perangkat komputer dan laptop", itemCount: 15 },
    { id: 5, name: "Drone & Peralatan Aerial", description: "Drone dan peralatan aerial", itemCount: 8 },
    { id: 6, name: "Lighting", description: "Peralatan pencahayaan", itemCount: 20 },
    { id: 7, name: "Tripod & Stabilizer", description: "Tripod, monopod, dan stabilizer", itemCount: 14 },
    { id: 8, name: "Lensa Kamera", description: "Berbagai jenis lensa kamera", itemCount: 30 },
  ]

  const handleAddCategory = () => {
    setEditingCategory(null)
    setIsFormOpen(true)
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data)
    // Here you would typically save the data to your backend
    setIsFormOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ResponsiveNavbar />
      <main className="flex-1 p-6 md:p-8">
        <Container>
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
                  <Input type="search" placeholder="Cari kategori..." className="w-full bg-background pl-8" />
                </div>
              </div>
              <CardDescription>Total {categories.length} kategori tersedia</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nama Kategori</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Jumlah Barang</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FolderTree className="h-4 w-4 text-muted-foreground" />
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>{category.itemCount} barang</TableCell>
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
        </Container>
      </main>
      <CategoryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingCategory}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
