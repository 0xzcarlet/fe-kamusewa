"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomDialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export function CustomDialog({ open, onClose, children, title, description, className }: CustomDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Handle visibility with animation timing
  useEffect(() => {
    if (open) {
      // Set visible immediately when opening
      setIsVisible(true)
    } else {
      // Delay hiding to allow for exit animation
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose()
      }
    }

    if (open) {
      window.addEventListener("keydown", handleKeyDown)
      // Prevent scrolling when dialog is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (!open) {
        // Small delay to ensure animations complete before enabling scroll
        setTimeout(() => {
          // Only enable scrolling if no other dialogs are open
          if (!document.querySelector('[role="dialog"]')) {
            document.body.style.overflow = ""
          }
        }, 200)
      }
    }
  }, [open, onClose])

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        // Check if the click is on a Select component or its children
        const target = e.target as HTMLElement
        const isSelectComponent = target.closest('[role="listbox"]') || target.closest('[role="option"]')
        
        if (!isSelectComponent) {
          onClose()
        }
      }
    }

    if (open) {
      // Use setTimeout to avoid immediate closing when opening
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside)
      }, 100)
      return () => {
        clearTimeout(timer)
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
    return undefined
  }, [open, onClose])

  // Cleanup function
  useEffect(() => {
    return () => {
      // Reset body styles when component unmounts
      document.body.style.overflow = ""
      document.body.style.pointerEvents = ""
    }
  }, [])

  if (!open && !isVisible) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200",
        open ? "opacity-100" : "opacity-0",
        !isVisible && "hidden",
      )}
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200" />
      <div
        ref={dialogRef}
        className={cn(
          "relative w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg transition-all duration-200",
          open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4",
          className,
        )}
      >
        {title && <h2 className="text-lg font-semibold leading-none tracking-tight mb-2">{title}</h2>}
        {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}

        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {children}
      </div>
    </div>
  )
}
