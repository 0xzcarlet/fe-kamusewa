"use client"

import { CustomDialog } from "@/components/custom-dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

interface LogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const { logout } = useAuth()

  const handleLogout = () => {
    onOpenChange(false)
    logout()
  }

  return (
    <CustomDialog
      open={open}
      onClose={() => onOpenChange(false)}
      title="Konfirmasi Keluar"
      description="Apakah Anda yakin ingin keluar dari aplikasi? Semua sesi Anda akan berakhir."
    >
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Batal
        </Button>
        <Button onClick={handleLogout}>Keluar</Button>
      </div>
    </CustomDialog>
  )
}
