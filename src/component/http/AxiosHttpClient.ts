import HttpClient, { HttpClientOptions } from "./HttpClient";
import { Axios, AxiosRequestConfig } from "axios";

class AxiosHttpClient implements HttpClient {

  private readonly axiosInstance;

  constructor() {
    this.axiosInstance = new Axios({
      withCredentials: true,
      transformResponse: [function transformResponse(data, headers) {
        if (headers?.["content-type"].includes("text/html")) {
          const root = document.createElement("html");
          root.innerHTML = data;
          return root;
        } else {
          return JSON.parse(data);
        }
      }]
    });
  }


  async get<R = any>(url: string, options?: HttpClientOptions<R>): Promise<R> {
    return this.executeRequest({
      url: url,
      method: "GET"
    }, options);
  }

  post<R = any, D = any>(url: string, data?: D, options?: HttpClientOptions<R>): Promise<R> {
    return this.executeRequest<R>({
      url: url,
      method: "POST",
      data: data
    }, options);
  }


  private async executeRequest<R>(configuration: AxiosRequestConfig, options?: HttpClientOptions<R>): Promise<R> {
    const result = await this.axiosInstance.request<R>(configuration);
    let resultData = result.data;


    try {
      if (options?.transformer) {
        resultData = options.transformer(resultData);
      }
    } catch (err) {
      return this.processRetries<R>(configuration, options);
    }

    if (options?.retries !== undefined && options.retries.needRetry(resultData)) {
      return this.processRetries<R>(configuration, options);
    }

    return await new Promise<R>((resolve) => {
      return resolve(resultData);
    });
  }

  private async processRetries<R>(configuration: AxiosRequestConfig, options?: HttpClientOptions<R>): Promise<R> {
    if (options?.retries === undefined) {
      throw new Error("Can't process request");
    }

    if (options.retries.count > 0) {
      options.retries.count -= 1;
      console.log(`Request ${configuration.url}, was not successfully, retry ${options.retries.count}`);
      await new Promise(s => setTimeout(s, 1500));
      return await this.executeRequest(configuration, options);
    }
    throw new Error("Retries was end.");
  }

}

export default AxiosHttpClient;