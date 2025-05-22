import { Category } from './category'

export interface Item {
  id: number
  user_id: number
  item_name: string
  description: string
  total_stock: number
  available_stock: number
  rental_price: number
  created_at: string
  updated_at: string
  categories: Category[]
}

export interface CreateItemRequest {
  item_name: string
  description?: string
  total_stock: number
  available_stock: number
  rental_price: number
  category_ids?: number[]
}

export interface UpdateItemRequest {
  item_name?: string
  description?: string
  total_stock?: number
  available_stock?: number
  rental_price?: number
  category_ids?: number[]
} 