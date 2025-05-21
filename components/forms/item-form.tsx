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
import { categoryService, itemService, type Category } from "@/lib/api-service"

export function ItemForm() {
  const { activeDialog, closeDialog, dialogData: initialData } = useDialog()
  const isOpen = activeDialog === "item-form"

  const [formData, setFormData] = useState({
    item_name: "",
    category_id: "",
    rental_price: 0,
    total_stock: 1,
    available_stock: 1,
    description: "",
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
          item_name: initialData.item_name || "",
          category_id:
            initialData.categories && initialData.categories.length > 0 ? initialData.categories[0].id.toString() : "",
          rental_price: initialData.rental_price || 0,
          total_stock: initialData.total_stock || 1,
          available_stock: initialData.available_stock || 1,
          description: initialData.description || "",
        })
        // In a real app, you would set the image from the API
        setPreviewImage(null)
      } else {
        // Reset form for new item
        setFormData({
          item_name: "",
          category_id: "",
          rental_price: 0,
          total_stock: 1,
          available_stock: 1,
          description: "",
        })
        setPreviewImage(null)
      }
    }
  }, [initialData, isOpen])

  const fetchCategories = async () => {
    setLoadingCategories(true)
    try {
      const response = await categoryService.getAll()

      if (response.status === "success" && response.data) {
        setCategories(response.data)
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat data kategori",
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
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const itemData = {
        item_name: formData.item_name,
        description: formData.description,
        rental_price: formData.rental_price,
        total_stock: formData.total_stock,
        available_stock: formData.available_stock,
        category_ids: formData.category_id ? [Number(formData.category_id)] : [],
      }

      if (initialData && initialData.id) {
        // Update existing item
        const response = await itemService.update(initialData.id, itemData)

        if (response.status !== "success") {
          throw new Error(response.message || "Failed to update item")
        }

        toast({
          title: "Barang berhasil diperbarui",
          description: `Barang ${formData.item_name} telah diperbarui.`,
        })
      } else {
        // Create new item
        const response = await itemService.create(itemData)

        if (response.status !== "success") {
          throw new Error(response.message || "Failed to create item")
        }

        toast({
          title: "Barang berhasil ditambahkan",
          description: `Barang ${formData.item_name} telah ditambahkan.`,
        })
      }

      // Call the onSubmit callback if provided
      if (initialData && initialData.onSubmit) {
        initialData.onSubmit()
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
            <Label htmlFor="item_name">Nama Barang</Label>
            <Input
              id="item_name"
              name="item_name"
              value={formData.item_name}
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
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rental_price">Harga Sewa/Hari (Rp)</Label>
              <Input
                id="rental_price"
                name="rental_price"
                type="number"
                value={formData.rental_price}
                onChange={handleNumberChange}
                placeholder="0"
                min={0}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="total_stock">Total Stok</Label>
              <Input
                id="total_stock"
                name="total_stock"
                type="number"
                value={formData.total_stock}
                onChange={handleNumberChange}
                placeholder="1"
                min={0}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="available_stock">Stok Tersedia</Label>
            <Input
              id="available_stock"
              name="available_stock"
              type="number"
              value={formData.available_stock}
              onChange={handleNumberChange}
              placeholder="1"
              min={0}
              max={formData.total_stock}
              required
            />
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
