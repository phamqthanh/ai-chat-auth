import { configs } from "@/configs";
import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: configs.API_DOMAIN,
});
axiosInstance.interceptors.response.use((res) => {
  return res.data;
});
export class BaseModel {
  static get SINGULAR() {
    return this.name.toUpperCase();
  }
  get SINGULAR() {
    return this.constructor.name.toUpperCase();
  }
  static get PLURAL() {
    return this.SINGULAR + "S";
  }
  get PLURAL() {
    return this.SINGULAR + "S";
  }
}
type GetOverWrite = <R = any, D = any>(
  url: string,
  config?: AxiosRequestConfig<D> | undefined
) => Promise<Response.Format<R>>;
type PostOverWrite = <R = any, D = any>(
  url: string,
  data?: D | undefined,
  config?: AxiosRequestConfig<D> | undefined
) => Promise<Response.Format<R>>;
const get = axiosInstance.get as GetOverWrite;
const del = axiosInstance.delete as GetOverWrite;

const post = axiosInstance.post as PostOverWrite;
const put = axiosInstance.put as PostOverWrite;
const postForm = axiosInstance.postForm as PostOverWrite;
export { axiosInstance, del, get, post, put, postForm };
