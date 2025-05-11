"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Edit, ShoppingBag } from "lucide-react"

interface ItemDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: {
    id: number
    name: string
    category: string
    price: number
    stock: number
    description: string
    status: string
    image?: string
  } | null
  onEdit: () => void
}

export function ItemDetail({ open, onOpenChange, item, onEdit }: ItemDetailProps) {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Detail Barang
          </DialogTitle>
          <DialogDescription>Informasi lengkap tentang barang</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          {item.image ? (
            <div className="w-full h-64 rounded-md overflow-hidden border">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-48 rounded-md bg-muted flex items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{item.category}</Badge>
              <Badge variant={item.status === "Tersedia" ? "success" : "secondary"}>{item.status}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Harga Sewa/Hari</p>
              <p className="text-lg font-medium">Rp {item.price.toLocaleString("id-ID")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stok Tersedia</p>
              <p className="text-lg font-medium">{item.stock} unit</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Deskripsi</p>
            <p className="text-sm">{item.description || "Tidak ada deskripsi"}</p>
          </div>

          <Separator />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Barang
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
