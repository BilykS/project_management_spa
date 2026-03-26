import apiClient from './client'

export function createApiResource<T, CreateDto, UpdateDto>(endpoint: string) {
  return {
    getById(id: number): Promise<{ data: T }> {
      return apiClient.get<T>(`${endpoint}/${id}`)
    },
    create(dto: CreateDto): Promise<{ data: T }> {
      return apiClient.post<T>(endpoint, dto)
    },
    update(id: number, dto: UpdateDto): Promise<{ data: T }> {
      return apiClient.put<T>(`${endpoint}/${id}`, dto)
    },
    remove(id: number): Promise<void> {
      return apiClient.delete(`${endpoint}/${id}`)
    },
  }
}
