export interface RentalItem {
  item_id: number
  quantity: number
  subtotal: number
  item_name: string
  rental_price: number
}

export interface Rental {
  id: number
  user_id: number
  customer_id: number
  customer_name: string
  rental_number: string
  title: string
  start_date: string
  end_date: string
  total_cost: number
  status: number // 1: Active, 2: Completed, 3: Overdue
  created_at: string
  updated_at: string
  rental_items: RentalItem[]
}

export interface CreateRentalRequest {
  customer_id: number
  start_date: string
  end_date: string
  title: string
  items: {
    item_id: number
    quantity: number
  }[]
}

export interface UpdateRentalRequest {
  end_date?: string
  items?: {
    item_id: number
    quantity: number
  }[]
}

export interface UpdateRentalStatusRequest {
  status: number // 1: Active, 2: Completed, 3: Overdue
} 