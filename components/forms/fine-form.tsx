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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FineFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: {
    id?: number
    rentalId: number
    customer: string
    item: string
    amount: number
    reason: string
    date: string
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

export function FineForm({ open, onOpenChange, initialData, onSubmit }: FineFormProps) {
  const [formData, setFormData] = useState({
    rentalId: 0,
    customer: "",
    item: "",
    amount: 0,
    reason: "",
    date: formatDateToYYYYMMDD(new Date()),
    status: "Belum Dibayar",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Reset form data when initialData changes or dialog opens
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          rentalId: initialData.rentalId || 0,
          customer: initialData.customer || "",
          item: initialData.item || "",
          amount: initialData.amount || 0,
          reason: initialData.reason || "",
          date: initialData.date || formatDateToYYYYMMDD(new Date()),
          status: initialData.status || "Belum Dibayar",
        })
      } else {
        // Reset form for new fine
        setFormData({
          rentalId: 0,
          customer: "",
          item: "",
          amount: 0,
          reason: "",
          date: formatDateToYYYYMMDD(new Date()),
          status: "Belum Dibayar",
        })
      }
    }
  }, [initialData, open])

  // Return null when not open to ensure proper cleanup
  if (!open) return null

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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      date: e.target.value,
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
  const rentals = [
    { id: 1001, customer: "Budi Santoso", item: "Kamera Sony A7III" },
    { id: 1002, customer: "Siti Rahayu", item: "Sound System 500W" },
    { id: 1003, customer: "Ahmad Hidayat", item: "Proyektor Epson" },
    { id: 1004, customer: "Dewi Lestari", item: "Laptop MacBook Pro" },
    { id: 1005, customer: "Eko Prasetyo", item: "Sound System 500W" },
    { id: 1006, customer: "Rina Wijaya", item: "Kamera Sony A7III" },
    { id: 1007, customer: "Doni Kusuma", item: "Laptop MacBook Pro" },
    { id: 1008, customer: "Maya Sari", item: "Drone DJI Mavic" },
  ]

  const handleRentalChange = (rentalId: string) => {
    const rental = rentals.find((r) => r.id === Number.parseInt(rentalId))
    if (rental) {
      setFormData((prev) => ({
        ...prev,
        rentalId: rental.id,
        customer: rental.customer,
        item: rental.item,
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Denda" : "Tambah Denda Baru"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Ubah informasi denda yang sudah ada"
                : "Tambahkan denda baru untuk keterlambatan atau kerusakan"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rentalId">Penyewaan</Label>
              <Select value={formData.rentalId.toString()} onValueChange={handleRentalChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih penyewaan" />
                </SelectTrigger>
                <SelectContent>
                  {rentals.map((rental) => (
                    <SelectItem key={rental.id} value={rental.id.toString()}>
                      #{rental.id} - {rental.customer} - {rental.item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="customer">Pelanggan</Label>
                <Input
                  id="customer"
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  placeholder="Nama pelanggan"
                  readOnly
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="item">Barang</Label>
                <Input
                  id="item"
                  name="item"
                  value={formData.item}
                  onChange={handleChange}
                  placeholder="Nama barang"
                  readOnly
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Alasan Denda</Label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Masukkan alasan denda"
                rows={2}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Jumlah Denda (Rp)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleNumberChange}
                  placeholder="0"
                  min={0}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Tanggal</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleDateChange} required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Belum Dibayar">Belum Dibayar</SelectItem>
                  <SelectItem value="Sudah Dibayar">Sudah Dibayar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Denda"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
