export type RequestLike = {
  url?: string;
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  socket?: {
    remoteAddress?: string;
  };
};

export type ResponseLike = {
  statusCode?: number;
  statusMessage?: string;
};
