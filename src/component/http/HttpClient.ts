export interface Retries<R> {
  count: number,
  needRetry: (response: R) => boolean
}

export interface HttpClientOptions<R> {
  retries?: Retries<R>
  transformer?: (rawResult: any) => R
}

interface HttpClient {

  /**
   * Send GET request to the URL
   * @param url
   * @param options
   */
  get<R = any>(url: string, options?: HttpClientOptions<R>): Promise<R>;

  post<R = any, D = any>(url: string, data?: D, options?: HttpClientOptions<R>): Promise<R>;
}


export default HttpClient;