export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  skipCache?: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  detail?: any;
}
