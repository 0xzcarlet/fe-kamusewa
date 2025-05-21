"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CustomDialog } from "@/components/custom-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImagePlus, X, Upload } from "lucide-react"
import { useDialog } from "@/components/dialog-context"
import { toast } from "@/components/ui/use-toast"
import { getCategories, createItem, updateItem } from "@/lib/data"

interface Category {
  id: number
  name: string
}

export function ItemForm() {
  const { activeDialog, closeDialog, dialogData: initialData } = useDialog()
  const isOpen = activeDialog === "item-form"

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: 0,
    stock: 1,
    description: "",
    status: "Tersedia",
    image_url: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch categories
  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  // Reset form data when initialData changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          category_id: initialData.category_id?.toString() || "",
          price: initialData.price || 0,
          stock: initialData.stock || 1,
          description: initialData.description || "",
          status: initialData.status || "Tersedia",
          image_url: initialData.image_url || "",
        })
        setPreviewImage(initialData.image_url || null)
      } else {
        // Reset form for new item
        setFormData({
          name: "",
          category_id: "",
          price: 0,
          stock: 1,
          description: "",
          status: "Tersedia",
          image_url: "",
        })
        setPreviewImage(null)
      }
    }
  }, [initialData, isOpen])

  const fetchCategories = () => {
    setLoadingCategories(true)
    try {
      const data = getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data kategori",
        variant: "destructive",
      })
    } finally {
      setLoadingCategories(false)
    }
  }

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server and get a URL back
      // For this demo, we'll create a local object URL
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
      setFormData((prev) => ({ ...prev, image_url: imageUrl }))
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    setFormData((prev) => ({ ...prev, image_url: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (initialData && initialData.id) {
        // Update existing item
        const updatedItem = updateItem(initialData.id, {
          name: formData.name,
          category_id: formData.category_id ? Number(formData.category_id) : undefined,
          price: formData.price,
          stock: formData.stock,
          status: formData.status,
          description: formData.description,
          image_url: formData.image_url,
        })

        if (!updatedItem) {
          throw new Error("Failed to update item")
        }

        toast({
          title: "Barang berhasil diperbarui",
          description: `Barang ${updatedItem.name} telah diperbarui.`,
        })

        // Call the onSubmit callback if provided
        if (initialData.onSubmit) {
          initialData.onSubmit(updatedItem)
        }
      } else {
        // Create new item
        const newItem = createItem({
          name: formData.name,
          category_id: formData.category_id ? Number(formData.category_id) : 1,
          price: formData.price,
          stock: formData.stock,
          status: formData.status,
          description: formData.description,
          image_url: formData.image_url,
        })

        toast({
          title: "Barang berhasil ditambahkan",
          description: `Barang ${newItem.name} telah ditambahkan.`,
        })

        // Call the onSubmit callback if provided
        if (initialData && initialData.onSubmit) {
          initialData.onSubmit(newItem)
        }
      }

      closeDialog()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan barang",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isEditing = initialData && initialData.id

  return (
    <CustomDialog
      open={isOpen}
      onClose={closeDialog}
      title={isEditing ? "Edit Barang" : "Tambah Barang Baru"}
      description={isEditing ? "Ubah informasi barang yang sudah ada" : "Tambahkan barang baru untuk disewakan"}
      className="sm:max-w-[500px]"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Barang</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama barang"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category_id">Kategori</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => handleSelectChange("category_id", value)}
              disabled={loadingCategories}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Pilih kategori"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Harga Sewa/Hari (Rp)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleNumberChange}
                placeholder="0"
                min={0}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stok</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleNumberChange}
                placeholder="1"
                min={0}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Masukkan deskripsi barang"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tersedia">Tersedia</SelectItem>
                <SelectItem value="Disewa">Disewa</SelectItem>
                <SelectItem value="Perbaikan">Perbaikan</SelectItem>
                <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Foto Barang</Label>
            <div className="flex flex-col gap-4">
              {previewImage ? (
                <div className="relative w-full h-48 rounded-md overflow-hidden border">
                  <img src={previewImage || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-muted/50 hover:bg-muted"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Klik untuk mengunggah foto</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              {!previewImage && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Pilih Foto
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={closeDialog}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Barang"}
          </Button>
        </div>
      </form>
    </CustomDialog>
  )
}
