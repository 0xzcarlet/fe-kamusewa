"use client"

import type React from "react"

import { useEffect } from "react"
import "./globals.css"
import { DialogProvider } from "@/components/dialog-context"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Global cleanup function to remove any lingering portals
  useEffect(() => {
    const cleanupPortals = () => {
      // Remove any lingering portal elements
      const portals = document.querySelectorAll("[data-radix-portal]")
      portals.forEach((portal) => {
        portal.remove()
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
        backdrop.remove()
      })

      // Reset body styles that might have been set by dialogs
      document.body.style.pointerEvents = ""
      document.body.style.overflow = ""
    }

    // Clean up on page load
    cleanupPortals()

    // Add a MutationObserver to detect and clean up orphaned dialogs
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
          // Check if any dialogs are orphaned after DOM changes
          const orphanedDialogs = document.querySelectorAll('[role="dialog"]:not(:has(*))')
          orphanedDialogs.forEach((dialog) => dialog.remove())
        }
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    // Clean up on page unload
    window.addEventListener("beforeunload", cleanupPortals)
    return () => {
      window.removeEventListener("beforeunload", cleanupPortals)
      observer.disconnect()
      cleanupPortals()
    }
  }, [])

  return (
    <html lang="en">
      <body>
        <DialogProvider>{children}</DialogProvider>
      </body>
    </html>
  )
}
