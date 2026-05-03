/**
 * Campaign model — mirrors the backend Campaign resource.
 */
export interface Campaign {
  id: string;
  name: string;
  status: 0 | 1;
  landingUrl: string;
  coverImageUrl: string;
  createdAt: string;
}

/**
 * Creative model — mirrors the backend Creative resource.
 */
export interface Creative {
  id: string;
  campaignId: string;
  assetUrl: string;
  createdAt: string;
}

/**
 * Pagination meta returned by the API.
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  last_page: number;
}

/**
 * Paginated API response wrapper.
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * API error response format.
 */
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Campaign list filter parameters.
 */
export interface CampaignFilters {
  q?: string;
  status?: 0 | 1 | '';
  page?: number;
  limit?: number;
}
