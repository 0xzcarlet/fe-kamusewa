"use client"

import { CustomDialog } from "@/components/custom-dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Edit, ShoppingBag } from "lucide-react"
import { useDialog } from "@/components/dialog-context"
import { useEffect, useState } from "react"

export function ItemDetail() {
  const { activeDialog, closeDialog, dialogData: item, openDialog, setDialogData } = useDialog()
  const isOpen = activeDialog === "item-detail"
  const [itemData, setItemData] = useState(item)

  useEffect(() => {
    setItemData(item)
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

  return (
    <CustomDialog
      open={isOpen}
      onClose={closeDialog}
      title="Detail Barang"
      description="Informasi lengkap tentang barang"
      className="sm:max-w-[550px]"
    >
      <div className="grid gap-6">
        {itemData.image_url ? (
          <div className="w-full h-64 rounded-md overflow-hidden border">
            <img
              src={itemData.image_url || "/placeholder.svg"}
              alt={itemData.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-48 rounded-md bg-muted flex items-center justify-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          </div>
        )}

        <div>
          <h3 className="text-xl font-semibold">{itemData.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{itemData.category}</Badge>
            <Badge variant={itemData.status === "Tersedia" ? "success" : "secondary"}>{itemData.status}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Harga Sewa/Hari</p>
            <p className="text-lg font-medium">Rp {itemData.price.toLocaleString("id-ID")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Stok Tersedia</p>
            <p className="text-lg font-medium">{itemData.stock} unit</p>
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
