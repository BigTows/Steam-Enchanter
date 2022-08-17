import { Axios } from "axios";

export interface CreateMarkerOrderRequest {
  sessionId: string,
  currency: number,
  appId: number,
  marketHashName: string,
  priceTotal: number,
  quantity: number,
}

interface CreateMarketOrderResponse {
  success: number,
  buy_orderid: string
}

interface OrderStatusResponseRaw {
  success: number,
  active: number,
  purchased: number,
  quantity: string,
  quantity_remaining: string
}

interface OrderStatusResponse {
  success: boolean,
  active: boolean,
  purchased: number,
  quantity: number,
  quantityRemaining: number
}

class SteamMarketApi {
  private httpClient: Axios;
  private static STEAM: string = "https://steamcommunity.com";

  private static readonly COUNT_RETRIES = 6;

  private static readonly STEAM_RETRIES_CODES = [
    40,//Tod many request
    42,//Tod many request
    107//Извините! Серверы Steam не ответили на запрос о ва…полнен. Если это не так, повторите попытку позже.
  ];

  constructor() {
    //TODO host, axios
    this.httpClient = new Axios({
      withCredentials: true,
      transformResponse: [function transformResponse(data, headers) {
        // Optionally you can check the response headers['content-type'] for application/json or text/json
        return JSON.parse(data);
      }]
    });
  }

  /**
   * Create order at steam market.
   */
  public async createOrder(request: CreateMarkerOrderRequest): Promise<string> {
    console.log(request);
    return this.executeCreateOrderWithRetries(request, SteamMarketApi.COUNT_RETRIES);
  }

  private async executeCreateOrderWithRetries(request: CreateMarkerOrderRequest, retries: number): Promise<string> {
    const data = new URLSearchParams();
    data.append("sessionid", request.sessionId);
    data.append("currency", request.currency as unknown as string);
    data.append("appid", request.appId as unknown as string);
    data.append("market_hash_name", request.marketHashName);
    data.append("price_total", request.priceTotal as unknown as string);
    data.append("quantity", request.quantity as unknown as string);
    data.append("billing_state", "");
    data.append("save_my_address", "0");

    const result = await this.httpClient.post<CreateMarketOrderResponse>(`${(SteamMarketApi.STEAM)}/market/createbuyorder/`, data);
    console.log(result.data);
    //TODO Errors?

    if (result.data.success === 1) {
      return result.data.buy_orderid;
    } else if (SteamMarketApi.STEAM_RETRIES_CODES.includes(result.data.success) && retries > 1) {
      await new Promise(s => setTimeout(s, 1500));
      return await this.executeCreateOrderWithRetries(request, retries - 1)
    }
    throw new Error("Can't place order at Steam :(");
  }


  public async getOrderStatus(sessionId: string, orderId: string): Promise<OrderStatusResponse> {
    const resultRaw = await this.httpClient.get<OrderStatusResponseRaw>(`${(SteamMarketApi.STEAM)}/market/getbuyorderstatus/?sessionid=${sessionId}&buy_orderid=${orderId}`);

    const result: OrderStatusResponse = {
      success: resultRaw.data.success === 1,
      active: resultRaw.data.active === 1,
      purchased: resultRaw.data.purchased,
      quantity: parseInt(resultRaw.data.quantity),
      quantityRemaining: parseInt(resultRaw.data.quantity_remaining)
    };
    console.log(resultRaw.data);

    console.log(result);
    //TODO Errors?


    if (result.success) {
      return result;
    }
    throw new Error("Can't get order status at Steam :(");

  }

  public async cancelOrder(sessionId: string, orderId: string) {

    const data = new URLSearchParams();
    data.append("sessionid", sessionId);
    data.append("buy_orderid", orderId);

    const result = await this.httpClient.post(`${(SteamMarketApi.STEAM)}/market/cancelbuyorder/`, data);

    if (result.data.success !== 1) {
      throw new Error("Can't cancel order at Steam :(");
    }
  }

}

export default SteamMarketApi;