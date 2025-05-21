"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface RentalFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: {
    id?: number
    customer: string
    items: string[]
    startDate: string
    endDate: string
    totalAmount: number
    status: string
  }
  onSubmit: (data: any) => void
}

// Format date to YYYY-MM-DD
function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Format date for display
function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function RentalForm({ open, onOpenChange, initialData, onSubmit }: RentalFormProps) {
  const [formData, setFormData] = useState({
    customer: "",
    items: [] as string[],
    startDate: formatDateToYYYYMMDD(new Date()),
    endDate: formatDateToYYYYMMDD(new Date(Date.now() + 86400000)), // Tomorrow
    totalAmount: 0,
    status: "Menunggu Pengambilan",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Reset form data when initialData changes or dialog opens
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          customer: initialData.customer || "",
          items: initialData.items || [],
          startDate: initialData.startDate || formatDateToYYYYMMDD(new Date()),
          endDate: initialData.endDate || formatDateToYYYYMMDD(new Date(Date.now() + 86400000)),
          totalAmount: initialData.totalAmount || 0,
          status: initialData.status || "Menunggu Pengambilan",
        })
      } else {
        // Reset form for new rental
        setFormData({
          customer: "",
          items: [],
          startDate: formatDateToYYYYMMDD(new Date()),
          endDate: formatDateToYYYYMMDD(new Date(Date.now() + 86400000)),
          totalAmount: 0,
          status: "Menunggu Pengambilan",
        })
      }
    }
  }, [initialData, open])

  // Return null when not open to ensure proper cleanup
  if (!open) return null

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemToggle = (item: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, item],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i !== item),
      }))
    }
  }

  const handleDateChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSubmit({
        ...formData,
        id: initialData?.id,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isEditing = !!initialData?.id

  // Sample data for dropdowns
  const customers = [
    "Budi Santoso",
    "Siti Rahayu",
    "Ahmad Hidayat",
    "Dewi Lestari",
    "Eko Prasetyo",
    "Rina Wijaya",
    "Doni Kusuma",
    "Maya Sari",
  ]

  const availableItems = [
    "Kamera Sony A7III",
    "Sound System 500W",
    "Proyektor Epson",
    "Laptop MacBook Pro",
    "Drone DJI Mavic",
    "Lensa Canon 24-70mm",
    "Tripod Manfrotto",
    "LED Light Panel",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Penyewaan" : "Tambah Penyewaan Baru"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Ubah informasi penyewaan yang sudah ada" : "Buat transaksi penyewaan baru"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Pelanggan</Label>
              <Select value={formData.customer} onValueChange={(value) => handleSelectChange("customer", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pelanggan" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer} value={customer}>
                      {customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Barang yang Disewa</Label>
              <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-40 overflow-y-auto">
                {availableItems.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`item-${item}`}
                      checked={formData.items.includes(item)}
                      onCheckedChange={(checked) => handleItemToggle(item, checked as boolean)}
                    />
                    <label
                      htmlFor={`item-${item}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Tanggal Mulai</Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleDateChange("startDate", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">Tanggal Selesai</Label>
                <div className="relative">
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleDateChange("endDate", e.target.value)}
                    className="w-full"
                    min={formData.startDate}
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="totalAmount">Total Biaya (Rp)</Label>
              <Input
                id="totalAmount"
                name="totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, totalAmount: Number.parseInt(e.target.value) || 0 }))
                }
                placeholder="0"
                min={0}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Menunggu Pengambilan">Menunggu Pengambilan</SelectItem>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                  <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Penyewaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
