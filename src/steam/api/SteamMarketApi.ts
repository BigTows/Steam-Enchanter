import axios, { Axios } from "axios";

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

  constructor() {
    //TODO host, axios
    this.httpClient = axios;
  }

  /**
   * Create order at steam market.
   */
  public async createOrder(request: CreateMarkerOrderRequest): Promise<string> {
    console.log(request);

    const data = new URLSearchParams();
    data.append("sessionid", request.sessionId);
    data.append("currency", request.currency as unknown as string);
    data.append("appid", request.appId as unknown as string);
    data.append("market_hash_name", request.marketHashName);
    data.append("price_total", request.priceTotal as unknown as string);
    data.append("quantity", request.quantity as unknown as string);
    data.append("billing_state", "");
    data.append("save_my_address", "0");

    const result = await this.httpClient.post<CreateMarketOrderResponse>(`${(SteamMarketApi.STEAM)}/market/createbuyorder/`, data, {
      withCredentials: true
    });
    console.log(result.data);
    //TODO Errors?

    if (result.data.success === 1) {
      return result.data.buy_orderid;
    }
    throw new Error("Can't place order at Steam :(");
  }

  public async getOrderStatus(sessionId: string, orderId: string): Promise<OrderStatusResponse> {
    const resultRaw = await this.httpClient.get<OrderStatusResponseRaw>(`${(SteamMarketApi.STEAM)}/market/getbuyorderstatus/?sessionid=${sessionId}&buy_orderid=${orderId}`,
      {
        withCredentials: true
      }
    );

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

    const result = await this.httpClient.post(`${(SteamMarketApi.STEAM)}/market/cancelbuyorder/`, data,
      {
        withCredentials: true
      }
    );

    if (result.data.success !== 1){
      throw new Error("Can't cancel order at Steam :(");
    }
  }

}

export default SteamMarketApi;