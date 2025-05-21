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
import { toast } from "@/components/ui/use-toast"
import {
  customerService,
  itemService,
  rentalService,
  type Customer,
  type Item,
  type Rental,
  type CreateRentalRequest,
} from "@/lib/api-service"
import { Loader2 } from "lucide-react"

interface RentalFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Rental
  onSubmit: (data: Rental) => void
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
    title: "",
    customer_id: "",
    items: [],
    start_date: formatDateToYYYYMMDD(new Date()),
    end_date: formatDateToYYYYMMDD(new Date(Date.now() + 86400000)), // Tomorrow
  })

  const [isLoading, setIsLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [availableItems, setAvailableItems] = useState<Item[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)

  // Fetch customers and items when the form opens
  useEffect(() => {
    if (open) {
      fetchCustomersAndItems()
    }
  }, [open])

  // Reset form data when initialData changes or dialog opens
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          title: initialData.title || "",
          customer_id: initialData.customer_id.toString() || "",
          items:
            initialData.rental_items.map((item) => ({
              item_id: item.item_id,
              quantity: item.quantity,
            })) || [],
          start_date: initialData.start_date
            ? formatDateToYYYYMMDD(new Date(initialData.start_date))
            : formatDateToYYYYMMDD(new Date()),
          end_date: initialData.end_date
            ? formatDateToYYYYMMDD(new Date(initialData.end_date))
            : formatDateToYYYYMMDD(new Date(Date.now() + 86400000)),
        })
      } else {
        // Reset form for new rental
        setFormData({
          title: "",
          customer_id: "",
          items: [],
          start_date: formatDateToYYYYMMDD(new Date()),
          end_date: formatDateToYYYYMMDD(new Date(Date.now() + 86400000)),
        })
      }
    }
  }, [initialData, open])

  const fetchCustomersAndItems = async () => {
    setIsLoadingData(true)
    try {
      // Fetch customers
      const customersResponse = await customerService.getAll()
      if (customersResponse.status === "success" && customersResponse.data) {
        setCustomers(customersResponse.data)
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat data pelanggan",
          variant: "destructive",
        })
      }

      // Fetch items
      const itemsResponse = await itemService.getAll()
      if (itemsResponse.status === "success" && itemsResponse.data) {
        // Only show items with available stock
        setAvailableItems(itemsResponse.data.filter((item) => item.available_stock > 0))
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat data barang",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data",
        variant: "destructive",
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  // Return null when not open to ensure proper cleanup
  if (!open) return null

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemToggle = (itemId: number, checked: boolean) => {
    if (checked) {
      // Add item to the list
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, { item_id: itemId, quantity: 1 }],
      }))
    } else {
      // Remove item from the list
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.item_id !== itemId),
      }))
    }
  }

  const handleItemQuantityChange = (itemId: number, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.item_id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item)),
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

    if (formData.items.length === 0) {
      toast({
        title: "Error",
        description: "Pilih minimal satu barang untuk disewa",
        variant: "destructive",
      })
      return
    }

    if (!formData.customer_id) {
      toast({
        title: "Error",
        description: "Pilih pelanggan terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (initialData?.id) {
        // Update existing rental
        const response = await rentalService.update(initialData.id, {
          end_date: formData.end_date,
          items: formData.items,
        })

        if (response.status === "success" && response.data) {
          toast({
            title: "Penyewaan berhasil diperbarui",
            description: `Penyewaan ${formData.title} telah diperbarui.`,
          })
          onSubmit(response.data)
          onOpenChange(false)
        } else {
          throw new Error(response.message || "Gagal memperbarui penyewaan")
        }
      } else {
        // Create new rental
        const rentalData: CreateRentalRequest = {
          customer_id: Number.parseInt(formData.customer_id),
          title: formData.title,
          start_date: formData.start_date,
          end_date: formData.end_date,
          items: formData.items,
        }

        const response = await rentalService.create(rentalData)

        if (response.status === "success" && response.data) {
          toast({
            title: "Penyewaan berhasil dibuat",
            description: `Penyewaan ${formData.title} telah dibuat.`,
          })
          onSubmit(response.data)
          onOpenChange(false)
        } else {
          throw new Error(response.message || "Gagal membuat penyewaan")
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan penyewaan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isEditing = !!initialData?.id

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
          {isLoadingData ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Memuat data...</p>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Judul Penyewaan</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) => handleSelectChange("title", e.target.value)}
                  placeholder="Masukkan judul penyewaan"
                  required
                  disabled={isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customer_id">Pelanggan</Label>
                <Select
                  value={formData.customer_id}
                  onValueChange={(value) => handleSelectChange("customer_id", value)}
                  disabled={isEditing}
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
                <Label>Barang yang Disewa</Label>
                <div className="grid grid-cols-1 gap-2 border rounded-md p-3 max-h-40 overflow-y-auto">
                  {availableItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Tidak ada barang tersedia</p>
                  ) : (
                    availableItems.map((item) => {
                      const selectedItem = formData.items.find((i) => i.item_id === item.id)
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between space-x-2 p-2 border-b last:border-0"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`item-${item.id}`}
                              checked={!!selectedItem}
                              onCheckedChange={(checked) => handleItemToggle(item.id, checked as boolean)}
                              disabled={isEditing}
                            />
                            <label
                              htmlFor={`item-${item.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {item.item_name} - Rp {item.rental_price.toLocaleString("id-ID")}/hari
                            </label>
                          </div>
                          {selectedItem && (
                            <div className="flex items-center space-x-2">
                              <Label htmlFor={`quantity-${item.id}`} className="text-xs">
                                Jumlah:
                              </Label>
                              <Input
                                id={`quantity-${item.id}`}
                                type="number"
                                value={selectedItem.quantity}
                                onChange={(e) =>
                                  handleItemQuantityChange(item.id, Number.parseInt(e.target.value) || 1)
                                }
                                min={1}
                                max={item.available_stock}
                                className="w-16 h-8 text-xs"
                                disabled={isEditing}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Tanggal Mulai</Label>
                  <div className="relative">
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleDateChange("start_date", e.target.value)}
                      className="w-full"
                      disabled={isEditing}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end_date">Tanggal Selesai</Label>
                  <div className="relative">
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleDateChange("end_date", e.target.value)}
                      className="w-full"
                      min={formData.start_date}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading || isLoadingData}>
              {isLoading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Penyewaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
