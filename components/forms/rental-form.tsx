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
import { customerService } from "@/lib/api/services/customer.service"
import { itemService } from "@/lib/api/services/item.service"
import { rentalService } from "@/lib/api/services/rental.service"
import { Customer } from "@/lib/api/types/customer"
import { Item } from "@/lib/api/types/item"
import { Rental } from "@/lib/api/types/rental"
import { useToast } from "@/components/ui/use-toast"
import { useDialog } from "@/components/dialog-context"

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

const initialFormData = {
  customer_id: 0,
  start_date: formatDateToYYYYMMDD(new Date()),
  end_date: formatDateToYYYYMMDD(new Date(Date.now() + 86400000)),
  title: "",
  items: [] as { item_id: number; quantity: number }[],
}

export function RentalForm() {
  const { closeDialog, dialogData, activeDialog } = useDialog()
  const [formData, setFormData] = useState(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [items, setItems] = useState<Item[]>([])
  const { toast } = useToast()

  // Fetch data when dialog becomes active
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersResponse, itemsResponse] = await Promise.all([
          customerService.getAll(),
          itemService.getAll()
        ])
        
        if (customersResponse.data) {
          setCustomers(customersResponse.data)
        }
        if (itemsResponse.data) {
          setItems(itemsResponse.data)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        })
      }
    }

    if (activeDialog === "rental-form") {
      fetchData()
    }
  }, [activeDialog, toast])

  // Update form data when dialog data changes
  useEffect(() => {
    if (dialogData) {
      setFormData({
        customer_id: dialogData.customer_id || 0,
        start_date: dialogData.start_date || formatDateToYYYYMMDD(new Date()),
        end_date: dialogData.end_date || formatDateToYYYYMMDD(new Date(Date.now() + 86400000)),
        title: dialogData.title || "",
        items: dialogData.rental_items?.map(item => ({
          item_id: item.item_id,
          quantity: item.quantity
        })) || []
      })
    } else {
      setFormData(initialFormData)
    }
  }, [dialogData])

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemToggle = (itemId: number, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, { item_id: itemId, quantity: 1 }],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.item_id !== itemId),
      }))
    }
  }

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.item_id === itemId ? { ...item, quantity } : item
      ),
    }))
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
      if (dialogData?.id) {
        await rentalService.update(dialogData.id, formData)
        toast({
          title: "Success",
          description: "Rental updated successfully",
        })
      } else {
        await rentalService.create(formData)
        toast({
          title: "Success",
          description: "Rental created successfully",
        })
      }
      if (dialogData?.onSubmit) {
        await dialogData.onSubmit()
      }
      closeDialog()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save rental. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData(initialFormData)
    closeDialog()
  }

  const isEditing = !!dialogData?.id

  if (activeDialog !== "rental-form") {
    return null
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
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
              <Select 
                value={formData.customer_id.toString()} 
                onValueChange={(value) => handleSelectChange("customer_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pelanggan" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.customer_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Judul Penyewaan</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleSelectChange("title", e.target.value)}
                placeholder="Contoh: Sewa Kamera Wedding"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Barang yang Disewa</Label>
              <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-40 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={formData.items.some(i => i.item_id === item.id)}
                      onCheckedChange={(checked) => handleItemToggle(item.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`item-${item.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item.item_name}
                      </label>
                      {formData.items.some(i => i.item_id === item.id) && (
                        <div className="mt-1">
                          <Input
                            type="number"
                            min={1}
                            max={item.available_stock}
                            value={formData.items.find(i => i.item_id === item.id)?.quantity || 1}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            className="h-7 w-20"
                          />
                        </div>
                      )}
                    </div>
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
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleDateChange("start_date", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">Tanggal Selesai</Label>
                <div className="relative">
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleDateChange("end_date", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Buat Penyewaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
