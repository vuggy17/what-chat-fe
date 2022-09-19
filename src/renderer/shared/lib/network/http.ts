import axios, { Axios, AxiosError } from "axios";
import { BASEURL } from "../../common/contants";
import { IHttp } from "./type";
// import "./interceptor";
axios.defaults.withCredentials = true;
class AppHttp implements IHttp {
  async get<T>(endpoint: string, query?: any): Promise<any> {
    return axios
      .get<T>(`${BASEURL}${endpoint}`, { params: query })
      .catch((error: AxiosError) => this.handleError(error));
  }
  async patch<T>(endpoint: string, data: any): Promise<any> {
    return axios
      .patch<T>(`${BASEURL}${endpoint}`, { data })
      .catch((error: AxiosError) => this.handleError(error));
  }
  async post<T>(endpoint: string, data: any): Promise<any> {
    return axios
      .post<T>(`${BASEURL}${endpoint}`, data)
      .catch((error: AxiosError) => this.handleError(error));
  }
  async delete<T>(endpoint: string, query?: any): Promise<any> {
    return axios
      .delete<T>(`${BASEURL}${endpoint}`, {
        params: query,
        withCredentials: true,
      })
      .catch((error: AxiosError) => this.handleError(error));
  }

  handleError(error: AxiosError) {
    console.log("🙈 Error happended, code: ", error.code, error.message);
    const currErr = error;

    if (currErr.response?.status)
      switch (currErr.response.status) {
        case 401:
          currErr.message = HTTP_ERROR[401];
          break;
        case 404:
          currErr.message = HTTP_ERROR[404];
          break;
        case 403:
          currErr.message = HTTP_ERROR[403];
          break;

        default:
          currErr.message = HTTP_ERROR[500];
          break;
      }
    console.log(currErr.message);

    return currErr;
  }

  async checkConnnection(): Promise<boolean> {
    const condition = navigator.onLine ? "online" : "offline";

    if (condition === "online") {
      console.log("ONLINE", condition);
      return fetch("https://www.google.com/", {
        // Check for internet connectivity
        mode: "no-cors",
      })
        .then(() => {
          console.log("CONNECTED TO INTERNET");
          return true;
        })
        .catch(() => {
          console.log("INTERNET CONNECTIVITY ISSUE");
          return false;
        });
    } else {
      return new Promise((resolve, rej) => {
        console.log("OFFLINE");
        resolve(false);
      });
    }
  }
}

const HTTP_ERROR = {
  401: "Wrong username or password",
  403: "User existed",
  404: "Not found",
  500: "Service unavailable",
};

export const checkError = (response: any) => response instanceof AxiosError;

export default AppHttp;
