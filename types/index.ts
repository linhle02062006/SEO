export type SortOption =
  | "newest"
  | "oldest"
  | "price-asc"
  | "price-desc"
  | "popular"
  | "rating"
  | "name-asc"
  | "name-desc";

export type ProductFilterState = {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
  sort?: SortOption;
  page?: number;
  limit?: number;
};

export type CartItem = {
  id: number;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  couponCode?: string | null;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export type SpecItem = { label: string; value: string };
export type FaqItem = { question: string; answer: string };

export type ApiResponse<T = unknown> = {
  ok: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
};
