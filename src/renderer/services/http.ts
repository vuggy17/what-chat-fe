import { message } from 'antd';
/* eslint-disable prefer-destructuring */
import axios, { Axios, AxiosError } from 'axios';
import IDataSource from 'renderer/repository/type';
import { BASEURL, HTTP_ERROR } from 'renderer/shared/constants';

// import "./interceptor";
axios.defaults.withCredentials = true;
class AppHttp implements IDataSource {
  async get<T>(endpoint: any, query?: any): Promise<any> {
    return axios
      .get<T>(`${BASEURL}${endpoint}`, { params: query })
      .catch((error: AxiosError) => this.handleError(error));
  }

  async update<T>(endpoint: string, data: any): Promise<any> {
    return axios
      .patch<T>(`${BASEURL}${endpoint}`, { data })
      .catch((error: AxiosError) => this.handleError(error));
  }

  /**
   * Wrapper for axios.post
   * @param endpoint
   * @param data
   * @returns
   */
  async save<T>(endpoint: string, data: any): Promise<any> {
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
    console.log('🙈 Error happended, code: ', error.code, error.message);
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
    message.error(currErr.message);
    return currErr;
  }

  async checkConnnection(): Promise<boolean> {
    const condition = navigator.onLine ? 'online' : 'offline';

    if (condition === 'online') {
      console.log('ONLINE', condition);
      return fetch('https://www.google.com/', {
        // Check for internet connectivity
        mode: 'no-cors',
      })
        .then(() => {
          console.log('CONNECTED TO INTERNET');
          return true;
        })
        .catch(() => {
          console.log('INTERNET CONNECTIVITY ISSUE');
          return false;
        });
    }
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  }
}

export const checkError = (response: any) => response instanceof AxiosError;

const HttpClient = new AppHttp();

export default HttpClient;
