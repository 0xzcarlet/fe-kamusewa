"use client"

import { CustomDialog } from "@/components/custom-dialog"
import { Button } from "@/components/ui/button"
import { useDialog } from "@/components/dialog-context"

export function DeleteConfirmation() {
  const { activeDialog, closeDialog, dialogData } = useDialog()
  const isOpen = activeDialog === "delete-confirmation"

  if (!isOpen || !dialogData) return null

  const { onConfirm, itemName } = dialogData

  const handleConfirm = () => {
    onConfirm()
    closeDialog()
  }

  return (
    <CustomDialog
      open={isOpen}
      onClose={closeDialog}
      title="Konfirmasi Hapus"
      description={`${itemName ? `Anda akan menghapus "${itemName}". ` : ""}Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.`}
    >
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={closeDialog}>
          Batal
        </Button>
        <Button variant="destructive" onClick={handleConfirm}>
          Hapus
        </Button>
      </div>
    </CustomDialog>
  )
}
