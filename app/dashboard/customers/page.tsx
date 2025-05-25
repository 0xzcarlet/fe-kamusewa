"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Users, Mail, Phone, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CustomerForm } from "@/components/forms/customer-form"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { customerService, type Customer } from "@/lib/api"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import { DialogProvider, useDialog } from "@/components/dialog-context"

function CustomersPageContent() {
  const { openDialog, setDialogData } = useDialog()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setIsLoading(true)
    try {
      const response = await customerService.getAll()
      if (response.status === "success" && response.data) {
        setCustomers(response.data)
      } else {
        toast({
          title: "Error",
          description: response.message || "Gagal memuat data pelanggan",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data pelanggan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCustomer = () => {
    setDialogData({
      onSubmit: handleFormSubmit,
    })
    openDialog("customer-form")
  }

  const handleEditCustomer = (customer: Customer) => {
    setDialogData({
      ...customer,
      onSubmit: handleFormSubmit,
    })
    openDialog("customer-form")
  }

  const handleDeleteCustomer = (customer: Customer) => {
    setDialogData({
      itemName: customer.customer_name,
      onConfirm: async () => {
        try {
          const response = await customerService.delete(customer.id)
          if (response.status === "success") {
            setCustomers((prev) => prev.filter((c) => c.id !== customer.id))
            toast({
              title: "Pelanggan berhasil dihapus",
              description: `${customer.customer_name} telah dihapus dari daftar pelanggan.`,
            })
          } else {
            throw new Error(response.message || "Gagal menghapus pelanggan")
          }
        } catch (error) {
          console.error("Error deleting customer:", error)
          toast({
            title: "Error",
            description: "Gagal menghapus pelanggan",
            variant: "destructive",
          })
        }
      },
    })
    openDialog("delete-confirmation")
  }

  const handleFormSubmit = () => {
    // Refresh the customers list after form submission
    fetchCustomers()
  }

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      customer.customer_name.toLowerCase().includes(query) ||
      (customer.email && customer.email.toLowerCase().includes(query)) ||
      (customer.phone_number && customer.phone_number.toLowerCase().includes(query))
    )
  })

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-6 pt-20 md:pt-6 md:p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Manajemen Pelanggan</h1>
              <p className="text-muted-foreground">Kelola data pelanggan yang menyewa barang</p>
            </div>
            <Button className="gap-1" onClick={handleAddCustomer}>
              <Plus className="h-4 w-4" /> Tambah Pelanggan
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Daftar Pelanggan</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari pelanggan..."
                    className="w-full bg-background pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <CardDescription>Total {filteredCustomers.length} pelanggan tersedia</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Kontak</TableHead>
                      <TableHead>Nomor Identitas</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Tidak ada data pelanggan
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {customer.customer_name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {customer.email && (
                                <div className="flex items-center text-sm">
                                  <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                  {customer.email}
                                </div>
                              )}
                              {customer.phone_number && (
                                <div className="flex items-center text-sm">
                                  <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                  {customer.phone_number}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{customer.identity_number || "-"}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Aksi</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteCustomer(customer)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Render all dialogs */}
      <DeleteConfirmation />
      <CustomerForm />
      <Toaster />
    </div>
  )
}

export default function CustomersPage() {
  return (
    <DialogProvider>
      <CustomersPageContent />
    </DialogProvider>
  )
}
