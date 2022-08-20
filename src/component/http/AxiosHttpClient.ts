import HttpClient, { HttpClientOptions, Retries } from "./HttpClient";
import { Axios, AxiosRequestConfig } from "axios";

class AxiosHttpClient implements HttpClient {

  private readonly axiosInstance;

  constructor() {
    this.axiosInstance = new Axios({
      withCredentials: true,
      transformResponse: [function transformResponse(data, headers) {
        // Optionally you can check the response headers['content-type'] for application/json or text/json
        return JSON.parse(data);
      }]
    });
  }


  async get<R = any>(url: string, options?: HttpClientOptions<R>): Promise<R> {
    return this.executeRequest({
      url: url,
      method: "GET"
    }, options?.retries);
  }

  post<R = any, D = any>(url: string, data?: D, options?: HttpClientOptions<R>): Promise<R> {
    return this.executeRequest<R>({
      url: url,
      method: "POST",
      data: data
    }, options?.retries);
  }


  private async executeRequest<R>(configuration: AxiosRequestConfig, retries?: Retries<any>): Promise<R> {
    const result = await this.axiosInstance.request<R>(configuration);
    const resultData = result.data;

    if (retries !== undefined && retries.count > 0 && retries.needRetry(resultData)) {
      retries.count -= 1;
      console.log(`Request ${configuration.url}, was not successfully, retry ${retries.count}`)
      await new Promise(s => setTimeout(s, 1500));
      return await this.executeRequest(configuration, retries);
    }

    return await new Promise<R>((resolve) => {
      return resolve(resultData);
    });
  }

}

export default AxiosHttpClient