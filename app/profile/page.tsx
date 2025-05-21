"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { LogoutDialog } from "@/components/logout-dialog"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-6 pt-20 md:pt-6 md:p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Profil Pengguna</h1>
              <p className="text-muted-foreground">Kelola informasi dan pengaturan akun Anda</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-5">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Informasi Akun</CardTitle>
                <CardDescription>Detail akun dan informasi kontak Anda</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Avatar" />
                  <AvatarFallback>BS</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-medium">Budi Santoso</h3>
                  <p className="text-sm text-muted-foreground">Admin</p>
                </div>
                <div className="w-full space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>budi@kamusewa.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telepon:</span>
                    <span>081234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Perusahaan:</span>
                    <span>PT Sewa Menyewa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bergabung:</span>
                    <span>12 Januari 2023</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setShowLogoutDialog(true)}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </Button>
              </CardFooter>
            </Card>

            <div className="md:col-span-3">
              <Tabs defaultValue="profile">
                <Card>
                  <CardHeader>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="profile">Profil</TabsTrigger>
                      <TabsTrigger value="password">Password</TabsTrigger>
                      <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  <CardContent>
                    <TabsContent value="profile" className="space-y-4">
                      <form onSubmit={handleSaveProfile}>
                        <div className="grid gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">Nama Depan</Label>
                              <Input id="firstName" defaultValue="Budi" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Nama Belakang</Label>
                              <Input id="lastName" defaultValue="Santoso" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="budi@kamusewa.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Nomor Telepon</Label>
                            <Input id="phone" defaultValue="081234567890" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company">Perusahaan</Label>
                            <Input id="company" defaultValue="PT Sewa Menyewa" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Alamat</Label>
                            <Textarea id="address" defaultValue="Jl. Sudirman No. 123, Jakarta" />
                          </div>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>

                    <TabsContent value="password" className="space-y-4">
                      <form onSubmit={handleSavePassword}>
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Password Saat Ini</Label>
                            <Input id="currentPassword" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">Password Baru</Label>
                            <Input id="newPassword" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                            <Input id="confirmPassword" type="password" />
                          </div>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Menyimpan..." : "Ubah Password"}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-4">
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Notifikasi</Label>
                            <p className="text-sm text-muted-foreground">
                              Terima notifikasi melalui email untuk aktivitas penting
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Notifikasi Penyewaan Baru</Label>
                            <p className="text-sm text-muted-foreground">Dapatkan notifikasi saat ada penyewaan baru</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Notifikasi Jatuh Tempo</Label>
                            <p className="text-sm text-muted-foreground">
                              Dapatkan notifikasi untuk penyewaan yang akan jatuh tempo
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Notifikasi Denda</Label>
                            <p className="text-sm text-muted-foreground">Dapatkan notifikasi saat ada denda baru</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <Button type="button" disabled={isLoading}>
                          {isLoading ? "Menyimpan..." : "Simpan Pengaturan"}
                        </Button>
                      </div>
                    </TabsContent>
                  </CardContent>
                </Card>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <LogoutDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog} />
    </div>
  )
}
