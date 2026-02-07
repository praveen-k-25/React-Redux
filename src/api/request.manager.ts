import type { InternalAxiosRequestConfig } from "axios";

interface AbortAxiosResponse extends InternalAxiosRequestConfig {
  _cancelToken: string;
}

const controllers = new Map<string, AbortController>();

function createRequestKey<T>(config: InternalAxiosRequestConfig): T {
  const { url, method, data } = config;
  return JSON.stringify({ url, method, data }) as T;
}

export function attachAbortController(config: InternalAxiosRequestConfig) {
  const key = createRequestKey<string>(config);

  if (controllers.has(key)) {
    controllers.get(key)?.abort();
  }

  const controller = new AbortController();
  controllers.set(key, controller);

  config.signal = controller.signal;
  (config as any)._cancelToken = key;
}

export function clearAbortController(config: InternalAxiosRequestConfig) {
  const key = (config as AbortAxiosResponse)?._cancelToken as string;
  if (key) {
    controllers.delete(key);
  }
}
