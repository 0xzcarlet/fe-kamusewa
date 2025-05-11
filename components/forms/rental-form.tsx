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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"

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

export function RentalForm({ open, onOpenChange, initialData, onSubmit }: RentalFormProps) {
  const [formData, setFormData] = useState({
    customer: initialData?.customer || "",
    items: initialData?.items || [],
    startDate: initialData?.startDate || format(new Date(), "yyyy-MM-dd"),
    endDate: initialData?.endDate || format(new Date(Date.now() + 86400000), "yyyy-MM-dd"),
    totalAmount: initialData?.totalAmount || 0,
    status: initialData?.status || "Menunggu Pengambilan",
  })
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.startDate ? new Date(initialData.startDate) : new Date(),
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.endDate ? new Date(initialData.endDate) : new Date(Date.now() + 86400000),
  )
  const [isLoading, setIsLoading] = useState(false)

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

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setStartDate(date)
      setFormData((prev) => ({
        ...prev,
        startDate: format(date, "yyyy-MM-dd"),
      }))
    }
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setEndDate(date)
      setFormData((prev) => ({
        ...prev,
        endDate: format(date, "yyyy-MM-dd"),
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
                <Label>Tanggal Mulai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: id }) : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={handleStartDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>Tanggal Selesai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: id }) : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={handleEndDateChange}
                      initialFocus
                      disabled={(date) => date < (startDate || new Date())}
                    />
                  </PopoverContent>
                </Popover>
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
