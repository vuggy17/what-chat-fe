// import { getCookie, setCookie } from "@utils/cookie";
// import axios, {
//   AxiosError,
//   AxiosInstance,
//   AxiosRequestConfig,
//   AxiosResponse,
// } from "axios";

// const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
//   if (!config?.url?.match("login") && !config?.url?.match("register")) {
//     config.headers = {
//       Authorization: "Bearer " + getCookie("token"),
//     };
//   }
//   return config;
// };

// const onRequestError = (error: AxiosError): Promise<AxiosError> => {
//   console.error(`[request error] [${JSON.stringify(error)}]`);
//   return Promise.reject(error);
// };

// const onResponse = (response: AxiosResponse): AxiosResponse => {
//   if (
//     response.config?.url?.match("login") ||
//     response.config?.url?.match("register")
//   ) {
//     console.log("login route match", response);
//     setCookie("token", response.data.token);
//   }
//   return response;
// };

// const onResponseError = (error: AxiosError): Promise<AxiosError> => {
//   console.error(`[response error] [${JSON.stringify(error)}]`);
//   return Promise.reject(error);
// };

// export function setupInterceptorsTo(
//   axiosInstance: AxiosInstance,
// ): AxiosInstance {
//   axiosInstance.interceptors.request.use(onRequest, onRequestError);
//   axiosInstance.interceptors.response.use(onResponse, onResponseError);
//   return axiosInstance;
// }

// setupInterceptorsTo(axios);
