"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CustomDialog } from "@/components/custom-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { customerService, type Customer, type CreateCustomerRequest, type UpdateCustomerRequest } from "@/lib/api"
import { useDialog } from "@/components/dialog-context"

export function CustomerForm() {
  const { activeDialog, closeDialog, dialogData: initialData } = useDialog()
  const isOpen = activeDialog === "customer-form"

  const [formData, setFormData] = useState<CreateCustomerRequest | UpdateCustomerRequest>({
    customer_name: "",
    email: "",
    phone_number: "",
    identity_number: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Reset form data when initialData changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          customer_name: initialData.customer_name || "",
          email: initialData.email || "",
          phone_number: initialData.phone_number || "",
          identity_number: initialData.identity_number || "",
        })
      } else {
        // Reset form for new customer
        setFormData({
          customer_name: "",
          email: "",
          phone_number: "",
          identity_number: "",
        })
      }
    } else {
      // Reset form when dialog closes
      setFormData({
        customer_name: "",
        email: "",
        phone_number: "",
        identity_number: "",
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
        // Update existing customer
        response = await customerService.update(initialData.id, formData)
      } else {
        // Create new customer
        response = await customerService.create(formData as CreateCustomerRequest)
      }

      if (response.status === "success" && response.data) {
        toast({
          title: initialData?.id ? "Pelanggan berhasil diperbarui" : "Pelanggan berhasil ditambahkan",
          description: `${formData.customer_name} telah ${initialData?.id ? "diperbarui" : "ditambahkan"}.`,
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
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan pelanggan",
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
      title={isEditing ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
      description={isEditing ? "Ubah informasi pelanggan yang sudah ada" : "Tambahkan pelanggan baru ke sistem"}
      className="sm:max-w-[500px]"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="customer_name">Nama Lengkap</Label>
            <Input
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone_number">Nomor Telepon</Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="identity_number">Nomor Identitas (KTP/SIM)</Label>
            <Input
              id="identity_number"
              name="identity_number"
              value={formData.identity_number}
              onChange={handleChange}
              placeholder="Masukkan nomor identitas"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={closeDialog}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Pelanggan"}
          </Button>
        </div>
      </form>
    </CustomDialog>
  )
}
