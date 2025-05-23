"use client"

import { CustomDialog } from "@/components/custom-dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Edit, ShoppingBag } from "lucide-react"
import { useDialog } from "@/components/dialog-context"
import { useEffect, useState } from "react"
import type { Item } from "@/lib/api"

export function ItemDetail() {
  const { activeDialog, closeDialog, dialogData: item, openDialog, setDialogData } = useDialog()
  const isOpen = activeDialog === "item-detail"
  const [itemData, setItemData] = useState<Item | null>(null)

  useEffect(() => {
    if (item) {
      setItemData(item as Item)
    }
  }, [item])

  if (!isOpen || !itemData) return null

  const handleEdit = () => {
    closeDialog()
    // Wait for the current dialog to close before opening the edit dialog
    setTimeout(() => {
      setDialogData(itemData)
      openDialog("item-form")
    }, 300)
  }

  // Helper function to get category name
  const getCategoryName = () => {
    if (itemData.category_ids && itemData.category_ids.length > 0) {
      return itemData.category_ids[0].name
    }
    return "Uncategorized"
  }

  return (
    <CustomDialog
      open={isOpen}
      onClose={closeDialog}
      title="Detail Barang"
      description="Informasi lengkap tentang barang"
      className="sm:max-w-[550px]"
    >
      <div className="grid gap-6">
        <div className="w-full h-48 rounded-md bg-muted flex items-center justify-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        </div>

        <div>
          <h3 className="text-xl font-semibold">{itemData.item_name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{getCategoryName()}</Badge>
            <Badge variant={itemData.available_stock > 0 ? "success" : "secondary"}>
              {itemData.available_stock > 0 ? "Tersedia" : "Tidak Tersedia"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Harga Sewa/Hari</p>
            <p className="text-lg font-medium">Rp {itemData.rental_price.toLocaleString("id-ID")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Stok Tersedia</p>
            <p className="text-lg font-medium">
              {itemData.available_stock} / {itemData.total_stock} unit
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Deskripsi</p>
          <p className="text-sm">{itemData.description || "Tidak ada deskripsi"}</p>
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeDialog}>
            Tutup
          </Button>
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Barang
          </Button>
        </div>
      </div>
    </CustomDialog>
  )
}
