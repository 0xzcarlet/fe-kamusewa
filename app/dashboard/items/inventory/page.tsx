import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Package, AlertTriangle, CheckCircle, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function ItemInventoryPage() {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Inventaris Barang</h1>
              <p className="text-muted-foreground">Pantau stok dan status barang</p>
            </div>
            <Button className="gap-1">
              <Package className="h-4 w-4" /> Tambah Stok
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Barang</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">120</div>
                <p className="text-xs text-muted-foreground">8 kategori berbeda</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Barang Tersedia</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">95</div>
                <p className="text-xs text-muted-foreground">79% dari total barang</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Barang Disewa</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">20</div>
                <p className="text-xs text-muted-foreground">17% dari total barang</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Stok Menipis</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Perlu penambahan stok</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Barang dengan Stok Menipis</CardTitle>
              <CardDescription>Barang yang perlu ditambah stoknya segera</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Stok Tersisa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Harga Sewa/Hari</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Kamera Sony A7III</TableCell>
                    <TableCell>Kamera & Fotografi</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Stok Menipis</Badge>
                    </TableCell>
                    <TableCell>Rp 250.000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Laptop MacBook Pro</TableCell>
                    <TableCell>Komputer & Laptop</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Stok Menipis</Badge>
                    </TableCell>
                    <TableCell>Rp 350.000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Drone DJI Mavic</TableCell>
                    <TableCell>Drone & Peralatan Aerial</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Stok Menipis</Badge>
                    </TableCell>
                    <TableCell>Rp 450.000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sound System 500W</TableCell>
                    <TableCell>Audio & Sound System</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Stok Menipis</Badge>
                    </TableCell>
                    <TableCell>Rp 500.000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Lensa Canon 24-70mm</TableCell>
                    <TableCell>Lensa</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Stok Menipis</Badge>
                    </TableCell>
                    <TableCell>Rp 150.000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
