export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export interface ApiError {
  status: number;
  message: string;
  detail?: any;
}
