import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, ShoppingBag, Calendar, FolderTree, AlertCircle, Clock } from "lucide-react"
import { ResponsiveNavbar } from "@/components/responsive-navbar"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <ResponsiveNavbar />
      <main className="flex-1 p-6 md:p-8">
        <div className="grid gap-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Selamat datang di dashboard KamuSewa</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Barang</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">120</div>
                <p className="text-xs text-muted-foreground">+5 barang baru bulan ini</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Penyewaan Aktif</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">12 jatuh tempo minggu ini</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pelanggan</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">+3 pelanggan baru bulan ini</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Denda Tertunggak</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 2.500.000</div>
                <p className="text-xs text-muted-foreground">8 pelanggan dengan denda</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Penyewaan Terbaru</CardTitle>
                <CardDescription>Daftar penyewaan yang baru dibuat dalam 7 hari terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                        <Package className="h-6 w-6" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">Penyewaan #{1000 + i}</p>
                        <p className="text-sm text-muted-foreground">
                          {i % 2 === 0 ? "Kamera Sony A7III" : "Sound System 500W"}
                        </p>
                      </div>
                      <div className="text-sm text-right">
                        <p>Rp {(1 + i) * 500}.000</p>
                        <p className="text-muted-foreground">
                          {new Date(Date.now() - i * 86400000).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Kategori Barang</CardTitle>
                <CardDescription>Jumlah barang berdasarkan kategori</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Kamera & Fotografi",
                    "Audio & Sound System",
                    "Proyektor & Display",
                    "Komputer & Laptop",
                    "Drone & Peralatan Aerial",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                        <FolderTree className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item}</p>
                      </div>
                      <div className="text-sm text-right">
                        <p>{30 - i * 4} barang</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Denda Terbaru</CardTitle>
                <CardDescription>Denda yang belum dibayar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">Denda #{2000 + i}</p>
                        <p className="text-sm text-muted-foreground">
                          Keterlambatan {i + 1} hari - Penyewaan #{1000 + i}
                        </p>
                      </div>
                      <div className="text-sm text-right">
                        <p className="text-destructive">Rp {(i + 1) * 100}.000</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Penyewaan Mendekati Jatuh Tempo</CardTitle>
                <CardDescription>Penyewaan yang akan jatuh tempo dalam 3 hari ke depan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                        <Clock className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">Penyewaan #{1010 + i}</p>
                        <p className="text-sm text-muted-foreground">
                          {["Proyektor Epson", "Laptop MacBook Pro", "Drone DJI Mavic", "Kamera Canon EOS R5"][i]}
                        </p>
                      </div>
                      <div className="text-sm text-right">
                        <p>Jatuh tempo dalam {i + 1} hari</p>
                        <p className="text-muted-foreground">
                          {new Date(Date.now() + (i + 1) * 86400000).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
