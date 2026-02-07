import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { attachAbortController, clearAbortController } from "./request.manager";
import handleAxiosError from "./error.handler";

interface AbortAxiosResponse extends InternalAxiosRequestConfig {
  _cancelToken: string;
}

const api = axios.create({
  baseURL: "https://1d2103g4-4000.inc1.devtunnels.ms",
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // attach abort controller
    attachAbortController(config);

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    clearAbortController(response.config as AbortAxiosResponse);
    return response;
  },
  (error: AxiosError) => {
    if (error.code === "ERR_CANCELED") return Promise.reject(error);
    clearAbortController(error.config as AbortAxiosResponse);
    return Promise.reject(handleAxiosError(error));
  },
);

export default api;
