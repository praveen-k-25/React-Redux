import api from "./axios.instance";

interface requestConfigType {
  method: "get" | "post" | "put" | "delete";
  url: string;
  data: object | null;
  formData: boolean;
}

async function apiRequest<T>(requestConfig: requestConfigType): Promise<T> {
  const config = {
    headers: {
      "Content-Type": requestConfig.formData
        ? "multipart/form-data"
        : "application/json",
    },
    method: requestConfig.method,
    url: requestConfig.url,
    data: requestConfig.data,
  };
  const response = await api(config);
  return response as T;
}

export async function authentication(data: any): Promise<any> {
  return await apiRequest<any>({
    method: "post",
    url: "/user/login",
    data,
    formData: false,
  });
}
