export interface RequestOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
  [key: string]: any;
}

export interface UploadFile {
  url: string;
  status?: string;
  message?: string;
  [key: string]: any;
}

export type LoadStatusType = "loading" | "loadmore" | "nomore";