type Environment = 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';

export enum HttpRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
}

export enum Platform {
  NEST_JS = 'NEST_JS',
  NODE_JS = 'NODE_JS',
  JAVA = 'JAVA',
  PYTHON = 'PYTHON',
  REACT = 'REACT',
  NEXT_JS = 'NEXT_JS',
  REACT_NATIVE = 'REACT_NATIVE',
  EXPO = 'EXPO',
}

type HttpContext = {
  url?: string;
  method?: HttpRequestMethod;
  statusCode?: number;
  status?: string;
  clientIp?: string;
};

export type Exception = {
  environment?: Environment;
  platform?: Platform;
  name: string;
  message: string;
  httpContext?: HttpContext;
};

export interface Plugin {
  handle(exception: Exception): void | Promise<void>;
}

export interface Config {
  serviceUrl: string;
  apiKey: string;
  environment: Environment;
  plugins?: Plugin[];
  // sampleRate?: number;
}
