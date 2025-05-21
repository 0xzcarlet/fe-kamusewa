// In-memory data store

// Categories
export interface Category {
  id: number
  name: string
  description: string
  created_at?: string
  updated_at?: string
}

// Items
export interface Item {
  id: number
  name: string
  category_id: number
  price: number
  stock: number
  status: string
  description: string
  image_url: string
  created_at?: string
  updated_at?: string
}

// Initial data
const categories: Category[] = [
  {
    id: 1,
    name: "Kamera & Fotografi",
    description: "Peralatan fotografi profesional",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Audio & Sound System",
    description: "Peralatan audio dan sound system",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Proyektor & Display",
    description: "Peralatan proyektor dan display",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Komputer & Laptop",
    description: "Peralatan komputer dan laptop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Drone & Peralatan Aerial",
    description: "Peralatan drone dan aerial",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Lighting",
    description: "Peralatan lighting",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: "Tripod & Support",
    description: "Peralatan tripod dan support",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    name: "Lensa",
    description: "Berbagai jenis lensa kamera",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const items: Item[] = [
  {
    id: 1,
    name: "Kamera Sony A7III",
    category_id: 1,
    price: 250000,
    stock: 5,
    status: "Tersedia",
    description: "Kamera mirrorless full-frame dengan kualitas gambar yang sangat baik",
    image_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Sound System 500W",
    category_id: 2,
    price: 500000,
    stock: 3,
    status: "Tersedia",
    description: "Sound system lengkap dengan speaker, mixer, dan mikrofon",
    image_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Proyektor Epson",
    category_id: 3,
    price: 200000,
    stock: 4,
    status: "Tersedia",
    description: "Proyektor HD dengan brightness tinggi",
    image_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Laptop MacBook Pro",
    category_id: 4,
    price: 350000,
    stock: 2,
    status: "Disewa",
    description: "Laptop MacBook Pro 16 inch dengan spesifikasi tinggi",
    image_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    name: "Drone DJI Mavic",
    category_id: 5,
    price: 450000,
    stock: 2,
    status: "Tersedia",
    description: "Drone dengan kamera 4K dan stabilisasi gambar",
    image_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 6,
    name: "Lensa Canon 24-70mm",
    category_id: 8,
    price: 150000,
    stock: 3,
    status: "Disewa",
    description: "Lensa zoom standar dengan aperture f/2.8",
    image_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 7,
    name: "Tripod Manfrotto",
    category_id: 7,
    price: 75000,
    stock: 8,
    status: "Tersedia",
    description: "Tripod profesional dengan kepala fluid untuk video",
    image_url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 8,
    name: "LED Light Panel",
    category_id: 6,
    price: 100000,
    stock: 6,
    status: "Tersedia",
    description: "Panel lampu LED dengan temperatur warna yang dapat diatur",
    image_url: "/placeholder.svg?height=100&width=100",
  },
]

// Helper functions for categories
export const getCategories = () => {
  return [...categories]
}

export const getCategory = (id: number) => {
  return categories.find((category) => category.id === id)
}

export const createCategory = (category: Omit<Category, "id" | "created_at" | "updated_at">) => {
  const newCategory: Category = {
    id: categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1,
    ...category,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  categories.push(newCategory)
  return newCategory
}

export const updateCategory = (id: number, category: Partial<Category>) => {
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) return null

  categories[index] = {
    ...categories[index],
    ...category,
    updated_at: new Date().toISOString(),
  }

  return categories[index]
}

export const deleteCategory = (id: number) => {
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) return false

  categories.splice(index, 1)
  return true
}

// Helper functions for items
export const getItems = (search?: string, categoryId?: number) => {
  let filteredItems = [...items]

  if (search) {
    const searchLower = search.toLowerCase()
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower)),
    )
  }

  if (categoryId) {
    filteredItems = filteredItems.filter((item) => item.category_id === categoryId)
  }

  return filteredItems.map((item) => {
    const category = getCategory(item.category_id)
    return {
      ...item,
      category: category?.name || "Uncategorized",
    }
  })
}

export const getItem = (id: number) => {
  const item = items.find((item) => item.id === id)
  if (!item) return null

  const category = getCategory(item.category_id)
  return {
    ...item,
    category: category?.name || "Uncategorized",
  }
}

export const createItem = (item: Omit<Item, "id" | "created_at" | "updated_at">) => {
  const newItem: Item = {
    id: items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1,
    ...item,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  items.push(newItem)
  return newItem
}

export const updateItem = (id: number, item: Partial<Item>) => {
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return null

  items[index] = {
    ...items[index],
    ...item,
    updated_at: new Date().toISOString(),
  }

  return items[index]
}

export const deleteItem = (id: number) => {
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return false

  items.splice(index, 1)
  return true
}
