import { apiRequest } from "../utils/api-request"
import { Item, CreateItemRequest, UpdateItemRequest } from "../types/item"
import { ApiResponse } from "../types/common"

export class ItemService {
  async getAll(): Promise<ApiResponse<Item[]>> {
    return apiRequest<Item[]>("/items")
  }

  async getById(id: number): Promise<ApiResponse<Item>> {
    return apiRequest<Item>(`/items/${id}`)
  }

  async create(data: CreateItemRequest): Promise<ApiResponse<Item>> {
    return apiRequest<Item>("/items", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async update(id: number, data: UpdateItemRequest): Promise<ApiResponse<Item>> {
    return apiRequest<Item>(`/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/items/${id}`, {
      method: "DELETE",
    })
  }
}

export const itemService = new ItemService() 