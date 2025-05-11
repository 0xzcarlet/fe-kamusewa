import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Package, Search, ShieldCheck } from "lucide-react"
import { Container } from "@/components/ui/container"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-16 flex items-center border-b">
        <Container className="flex w-full items-center">
          <Link href="/" className="flex items-center justify-center">
            <Package className="h-6 w-6 mr-2" />
            <span className="font-bold text-xl">KamuSewa</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Fitur
            </Link>
            <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
              Tentang Kami
            </Link>
            <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
              Masuk
            </Link>
            <Link href="/register" className="text-sm font-medium hover:underline underline-offset-4">
              Daftar
            </Link>
          </nav>
        </Container>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <Container>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Manajemen Penyewaan Barang yang Efisien
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    KamuSewa membantu Anda mengelola bisnis penyewaan barang dengan mudah, cepat, dan efisien.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1.5">
                      Mulai Sekarang
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Masuk ke Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=550&width=550"
                  alt="Dashboard Preview"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  width={550}
                  height={550}
                />
              </div>
            </div>
          </Container>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <Container>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Fitur Utama
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Solusi Lengkap untuk Bisnis Penyewaan
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  KamuSewa menyediakan semua yang Anda butuhkan untuk mengelola bisnis penyewaan barang dengan efisien.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Package className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Manajemen Inventaris</h3>
                  <p className="text-muted-foreground">
                    Kelola semua barang yang tersedia untuk disewa dengan mudah dan terorganisir.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Search className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Pelacakan Penyewaan</h3>
                  <p className="text-muted-foreground">
                    Lacak semua penyewaan aktif, riwayat, dan jadwal pengembalian dengan satu dashboard.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Keamanan Data</h3>
                  <p className="text-muted-foreground">
                    Data bisnis dan pelanggan Anda aman dengan sistem keamanan tingkat tinggi.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <Container>
            <div className="grid gap-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Tentang KamuSewa</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Solusi Terbaik untuk Bisnis Penyewaan Anda
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  KamuSewa dikembangkan untuk membantu pemilik bisnis penyewaan mengelola inventaris, pelanggan, dan
                  transaksi dengan lebih efisien.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Dashboard yang intuitif dan mudah digunakan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Laporan bisnis yang komprehensif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Dukungan pelanggan 24/7</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Dashboard Preview"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </Container>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <Container>
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Siap untuk Meningkatkan Bisnis Penyewaan Anda?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Daftar sekarang dan nikmati kemudahan mengelola bisnis penyewaan dengan KamuSewa.
                </p>
              </div>
              <div className="flex gap-4 lg:justify-end">
                <Link href="/register">
                  <Button size="lg" className="gap-1.5">
                    Daftar Sekarang
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Masuk
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <footer className="py-6 w-full shrink-0 border-t">
        <Container className="flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} KamuSewa. Hak Cipta Dilindungi.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link href="#" className="text-xs hover:underline underline-offset-4">
              Syarat & Ketentuan
            </Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4">
              Kebijakan Privasi
            </Link>
          </nav>
        </Container>
      </footer>
    </div>
  )
}
