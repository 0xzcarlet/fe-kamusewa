"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Package, Calendar, BarChart3, Users, Menu, X, Star } from "lucide-react"
import { Container } from "@/components/ui/container"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-16 flex items-center border-b sticky top-0 bg-background z-10">
        <Container className="flex w-full items-center justify-between">
          <Link href="/" className="flex items-center justify-center">
            <Package className="h-6 w-6 mr-2" />
            <span className="font-bold text-xl">KamuSewa</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-4 sm:gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Fitur
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimoni
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

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </Container>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background">
          <Container className="py-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="#features"
                className="text-sm font-medium hover:underline underline-offset-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fitur
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium hover:underline underline-offset-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimoni
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium hover:underline underline-offset-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tentang Kami
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium hover:underline underline-offset-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium hover:underline underline-offset-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Daftar
              </Link>
            </nav>
          </Container>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-40 overflow-hidden">
          {/* Background with overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/placeholder.svg?height=1080&width=1920"
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <Container className="relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none text-white">
                    Manajemen Inventaris Penyewaan Anda, Kini Lebih Mudah dan Teratur.
                  </h1>
                  <p className="max-w-[600px] text-lg text-gray-200 md:text-xl">
                    Aplikasi intuitif untuk pemilik bisnis penyewaan melacak, mengelola, dan mengoptimalkan aset sewaan
                    mereka secara efisien.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button size="lg" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
                      Login ke Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                      Daftar Sekarang
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=550&width=550"
                  alt="Dashboard Preview"
                  className="rounded-xl shadow-2xl border border-gray-200/20"
                  width={550}
                  height={550}
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Core Features Section */}
        <section id="features" className="w-full py-16 md:py-24 bg-white">
          <Container>
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Semua yang Anda Butuhkan untuk Mengelola Bisnis Sewa Anda
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
                Solusi lengkap untuk mengoptimalkan operasi bisnis penyewaan Anda
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
              {/* Feature 1 */}
              <div className="flex flex-col p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700 mb-4">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Manajemen Inventaris Lengkap</h3>
                <p className="text-muted-foreground">
                  Catat semua detail aset Anda, mulai dari foto, kondisi, hingga riwayat penyewaan, semuanya di satu
                  tempat yang terorganisir.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700 mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Kalender & Penjadwalan Otomatis</h3>
                <p className="text-muted-foreground">
                  Lihat semua jadwal penyewaan dalam satu tampilan kalender yang intuitif dan hindari konflik jadwal
                  dengan sistem peringatan otomatis.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700 mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Laporan Pendapatan</h3>
                <p className="text-muted-foreground">
                  Dapatkan wawasan bisnis dengan laporan pendapatan yang komprehensif, tren penyewaan, dan analisis
                  performa aset Anda.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700 mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Manajemen Pelanggan</h3>
                <p className="text-muted-foreground">
                  Kelola data pelanggan dengan mudah, lacak riwayat penyewaan mereka, dan bangun hubungan yang lebih
                  baik dengan sistem CRM terintegrasi.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-16 md:py-24 bg-gray-50">
          <Container>
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Apa Kata Mereka Tentang KamuSewa?</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
                Pengalaman dari pemilik bisnis penyewaan yang telah menggunakan platform kami
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Testimonial 1 */}
              <div className="flex flex-col p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mt-4 text-gray-700 italic">
                  "KamuSewa telah mengubah cara saya mengelola bisnis penyewaan kamera. Sekarang saya bisa melacak semua
                  peralatan dengan mudah dan efisien."
                </p>
                <div className="mt-6 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    AS
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Andi Setiawan</p>
                    <p className="text-xs text-gray-500">Jakarta</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="flex flex-col p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mt-4 text-gray-700 italic">
                  "Laporan pendapatan sangat membantu saya memahami aset mana yang paling menguntungkan. Sangat
                  direkomendasikan untuk bisnis penyewaan alat pesta."
                </p>
                <div className="mt-6 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    DP
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Dewi Pratiwi</p>
                    <p className="text-xs text-gray-500">Surabaya</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="flex flex-col p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mt-4 text-gray-700 italic">
                  "Sistem kalender mencegah saya dari double-booking. Fitur notifikasi juga sangat membantu untuk
                  mengingatkan pengembalian yang terlambat."
                </p>
                <div className="mt-6 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    BH
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Budi Hartono</p>
                    <p className="text-xs text-gray-500">Bandung</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-16 md:py-24">
          <Container>
            <div className="grid gap-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700">
                  Tentang KamuSewa
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Solusi Terbaik untuk Bisnis Penyewaan Anda
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  KamuSewa dikembangkan untuk membantu pemilik bisnis penyewaan mengelola inventaris, pelanggan, dan
                  transaksi dengan lebih efisien.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Dashboard yang intuitif dan mudah digunakan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Laporan bisnis yang komprehensif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Dukungan pelanggan 24/7</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Dashboard Preview"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center shadow-lg"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-blue-600 text-white">
          <Container>
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Siap untuk Meningkatkan Bisnis Penyewaan Anda?
                </h2>
                <p className="max-w-[600px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Daftar sekarang dan nikmati kemudahan mengelola bisnis penyewaan dengan KamuSewa.
                </p>
              </div>
              <div className="flex gap-4 lg:justify-end">
                <Link href="/register">
                  <Button size="lg" className="gap-1.5 bg-white text-blue-600 hover:bg-blue-50">
                    Daftar Sekarang
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <footer className="py-8 w-full shrink-0 border-t bg-gray-50">
        <Container className="flex flex-col space-y-8">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4 max-w-xs">
              <div className="flex items-center">
                <Package className="h-6 w-6 mr-2 text-blue-600" />
                <span className="font-bold text-xl">KamuSewa</span>
              </div>
              <p className="text-sm text-gray-500">
                Solusi manajemen inventaris penyewaan terbaik untuk bisnis Anda. Kelola aset, pelanggan, dan transaksi
                dengan mudah.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h3 className="font-medium">Produk</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                      Fitur
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                      Harga
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                      Demo
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Perusahaan</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                      Tentang Kami
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                      Karir
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Bantuan</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                      Kontak
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                      Dokumentasi
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} KamuSewa. Hak Cipta Dilindungi.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-xs text-gray-500 hover:text-gray-900">
                Syarat & Ketentuan
              </Link>
              <Link href="#" className="text-xs text-gray-500 hover:text-gray-900">
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}
