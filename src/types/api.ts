export interface ApiErrorResponse {
  error: string
  details?: unknown
}

export interface ApiSuccessResponse<T> {
  data: T
}
