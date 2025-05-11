"use client"

import type React from "react"

import { useState } from "react"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"

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

export function FineForm({ open, onOpenChange, initialData, onSubmit }: FineFormProps) {
  const [formData, setFormData] = useState({
    rentalId: initialData?.rentalId || 0,
    customer: initialData?.customer || "",
    item: initialData?.item || "",
    amount: initialData?.amount || 0,
    reason: initialData?.reason || "",
    date: initialData?.date || format(new Date(), "yyyy-MM-dd"),
    status: initialData?.status || "Belum Dibayar",
  })
  const [date, setDate] = useState<Date | undefined>(initialData?.date ? new Date(initialData.date) : new Date())
  const [isLoading, setIsLoading] = useState(false)

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

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date)
      setFormData((prev) => ({
        ...prev,
        date: format(date, "yyyy-MM-dd"),
      }))
    }
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
      onOpenChange(false)
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
                <Label>Tanggal</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: id }) : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
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
