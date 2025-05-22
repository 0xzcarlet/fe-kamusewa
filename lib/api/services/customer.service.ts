import { apiRequest } from "../utils/api-request"
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from "../types/customer"
import { ApiResponse } from "../types/common"

export class CustomerService {
  async getAll(): Promise<ApiResponse<Customer[]>> {
    return apiRequest<Customer[]>("/customers")
  }

  async getById(id: number): Promise<ApiResponse<Customer>> {
    return apiRequest<Customer>(`/customers/${id}`)
  }

  async create(data: CreateCustomerRequest): Promise<ApiResponse<Customer>> {
    return apiRequest<Customer>("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async update(id: number, data: UpdateCustomerRequest): Promise<ApiResponse<Customer>> {
    return apiRequest<Customer>(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/customers/${id}`, {
      method: "DELETE",
    })
  }
}

export const customerService = new CustomerService() 