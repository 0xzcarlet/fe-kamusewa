"use client"

import { useRouter } from "next/navigation"
import { CustomDialog } from "@/components/custom-dialog"
import { Button } from "@/components/ui/button"
import { useDialog } from "@/components/dialog-context"
import { useAuth } from "@/lib/auth-context"

export function LogoutDialog() {
  const router = useRouter()
  const { activeDialog, closeDialog } = useDialog()
  const { logout } = useAuth()
  const isOpen = activeDialog === "logout"

  if (!isOpen) return null

  const handleLogout = () => {
    closeDialog()
    // Call the logout function from auth context
    setTimeout(() => {
      logout()
      router.push("/login")
    }, 300)
  }

  return (
    <CustomDialog
      open={isOpen}
      onClose={closeDialog}
      title="Konfirmasi Keluar"
      description="Apakah Anda yakin ingin keluar dari aplikasi? Semua sesi Anda akan berakhir."
    >
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={closeDialog}>
          Batal
        </Button>
        <Button onClick={handleLogout}>Keluar</Button>
      </div>
    </CustomDialog>
  )
}
