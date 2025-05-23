"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type DialogType = "item-detail" | "item-form" | "delete-confirmation" | "logout" | null

interface DialogContextType {
  activeDialog: DialogType
  openDialog: (dialog: DialogType) => void
  closeDialog: () => void
  dialogData: any
  setDialogData: (data: any) => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [dialogData, setDialogData] = useState<any>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Force cleanup of any lingering elements when dialog changes
  useEffect(() => {
    const cleanup = () => {
      // Only cleanup if no dialog is active
      if (!activeDialog) {
        // Remove any lingering portal elements
        const portals = document.querySelectorAll("[data-radix-portal]")
        portals.forEach((portal) => {
          if (!portal.contains(document.activeElement)) {
            portal.remove()
          }
        })

        // Remove any lingering overlay elements
        const overlays = document.querySelectorAll("[role='dialog']")
        overlays.forEach((overlay) => {
          if (!overlay.contains(document.activeElement)) {
            overlay.remove()
          }
        })

        // Remove any lingering backdrop elements
        const backdrops = document.querySelectorAll(".fixed.inset-0.bg-black")
        backdrops.forEach((backdrop) => {
          if (!backdrop.contains(document.activeElement)) {
            backdrop.remove()
          }
        })

        // Reset body styles that might have been set by dialogs
        document.body.style.pointerEvents = ""
        document.body.style.overflow = ""
      }
    }

    // Clean up when dialog changes
    if (!activeDialog) {
      // Delay cleanup to allow for animations
      setTimeout(cleanup, 300)
    }

    // Clean up on unmount
    return cleanup
  }, [activeDialog])

  const openDialog = (dialog: DialogType) => {
    // Prevent opening during transition
    if (isTransitioning) return

    // Close any existing dialog first
    if (activeDialog) {
      setIsTransitioning(true)
      setActiveDialog(null)

      // Wait for animation to complete
      setTimeout(() => {
        setActiveDialog(dialog)
        setIsTransitioning(false)
      }, 300)
    } else {
      setActiveDialog(dialog)
    }
  }

  const closeDialog = () => {
    // Prevent closing during transition
    if (isTransitioning) return

    setIsTransitioning(true)
    setActiveDialog(null)

    // Clear dialog data after a delay to ensure animations complete
    setTimeout(() => {
      setDialogData(null)
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <DialogContext.Provider value={{ activeDialog, openDialog, closeDialog, dialogData, setDialogData }}>
      {children}
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const context = useContext(DialogContext)
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider")
  }
  return context
}
