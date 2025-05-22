export interface Customer {
  id: number
  user_id: number
  customer_name: string
  email: string
  phone_number: string
  identity_number: string
  created_at: string
  updated_at: string
}

export interface CreateCustomerRequest {
  customer_name: string
  email?: string
  phone_number?: string
  identity_number?: string
}

export interface UpdateCustomerRequest {
  customer_name?: string
  email?: string
  phone_number?: string
  identity_number?: string
} 