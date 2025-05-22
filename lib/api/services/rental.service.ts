import { apiRequest } from "../utils/api-request"
import { Rental, CreateRentalRequest, UpdateRentalRequest, UpdateRentalStatusRequest } from "../types/rental"
import { ApiResponse } from "../types/common"

export class RentalService {
  async getAll(): Promise<ApiResponse<Rental[]>> {
    return apiRequest<Rental[]>("/rentals")
  }

  async getById(id: number): Promise<ApiResponse<Rental>> {
    return apiRequest<Rental>(`/rentals/${id}`)
  }

  async create(data: CreateRentalRequest): Promise<ApiResponse<Rental>> {
    return apiRequest<Rental>("/rentals", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async update(id: number, data: UpdateRentalRequest): Promise<ApiResponse<Rental>> {
    return apiRequest<Rental>(`/rentals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async updateStatus(id: number, data: UpdateRentalStatusRequest): Promise<ApiResponse<Rental>> {
    return apiRequest<Rental>(`/rentals/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/rentals/${id}`, {
      method: "DELETE",
    })
  }
}

export const rentalService = new RentalService() 