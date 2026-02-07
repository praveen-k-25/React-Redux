import type { AxiosError } from "axios";

export default function handleAxiosError(error: AxiosError) {
  if (error.code === "ERR_CANCELED") {
    return { cancelled: true };
  }
  console.log(error.code);
}
