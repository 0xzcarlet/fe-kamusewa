"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CustomDialog } from "@/components/custom-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { categoryService, type Category, type CreateCategoryRequest, type UpdateCategoryRequest } from "@/lib/api"
import { useDialog } from "@/components/dialog-context"

export function CategoryForm() {
  const { activeDialog, closeDialog, dialogData: initialData } = useDialog()
  const isOpen = activeDialog === "category-form"

  const [formData, setFormData] = useState<CreateCategoryRequest | UpdateCategoryRequest>({
    category_name: "",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Reset form data when initialData changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          category_name: initialData.category_name || "",
          description: initialData.description || "",
        })
      } else {
        // Reset form for new category
        setFormData({
          category_name: "",
          description: "",
        })
      }
    } else {
      // Reset form when dialog closes
      setFormData({
        category_name: "",
        description: "",
      })
      setIsLoading(false)
    }
  }, [initialData, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let response

      if (initialData?.id) {
        // Update existing category
        response = await categoryService.update(initialData.id, formData)
      } else {
        // Create new category
        response = await categoryService.create(formData as CreateCategoryRequest)
      }

      if (response.status === "success" && response.data) {
        toast({
          title: initialData?.id ? "Kategori berhasil diperbarui" : "Kategori berhasil ditambahkan",
          description: `${formData.category_name} telah ${initialData?.id ? "diperbarui" : "ditambahkan"}.`,
        })
        
        // Call the onSubmit callback if provided
        if (initialData?.onSubmit) {
          initialData.onSubmit()
        }
        
        closeDialog()
      } else {
        throw new Error(response.message || "Terjadi kesalahan")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan kategori",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isEditing = !!initialData?.id

  return (
    <CustomDialog
      open={isOpen}
      onClose={closeDialog}
      title={isEditing ? "Edit Kategori" : "Tambah Kategori Baru"}
      description={isEditing ? "Ubah informasi kategori yang sudah ada" : "Tambahkan kategori baru untuk barang yang disewakan"}
      className="sm:max-w-[425px]"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category_name">Nama Kategori</Label>
            <Input
              id="category_name"
              name="category_name"
              value={formData.category_name}
              onChange={handleChange}
              placeholder="Masukkan nama kategori"
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
              placeholder="Masukkan deskripsi kategori"
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={closeDialog}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Kategori"}
          </Button>
        </div>
      </form>
    </CustomDialog>
  )
}
