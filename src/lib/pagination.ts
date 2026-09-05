export const DEFAULT_PAGE_SIZE = 100
export const MAX_PAGE_SIZE = 250

export interface PaginationOptions {
  page: number
  limit: number
  skip: number
  queryLimit: number
}

function positiveInteger(value: string | null, fallback: number) {
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function parsePagination(searchParams: URLSearchParams): PaginationOptions {
  const page = positiveInteger(searchParams.get('page'), 1)
  const limit = Math.min(
    positiveInteger(searchParams.get('limit'), DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE
  )

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    queryLimit: limit + 1,
  }
}

export function paginateResults<T>(results: T[], options: PaginationOptions) {
  return {
    items: results.slice(0, options.limit),
    pagination: {
      page: options.page,
      limit: options.limit,
      hasMore: results.length > options.limit,
    },
  }
}
