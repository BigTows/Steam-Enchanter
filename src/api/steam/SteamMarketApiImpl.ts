import HttpClient from "../../component/http/HttpClient";
import { inject, injectable } from "tsyringe";
import { Tokens } from "../../configuration/Injector";
import SteamMarketApi, { CreateMarkerOrderRequest, OrderStatusResponse } from "./SteamMarketApi";


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

@injectable()
class SteamMarketApiImpl implements SteamMarketApi {
  private readonly steamHost: string;
  private readonly httpClient: HttpClient;

  private static readonly COUNT_RETRIES = 6;

  private static readonly STEAM_RETRIES_CODES = [
    10,//The game's servers are currently too busy. Your pu…unds have been exchanged. Please try again later
    40,//Tod many request
    107//Извините! Серверы Steam не ответили на запрос о ва…полнен. Если это не так, повторите попытку позже.
  ];

  constructor(@inject(Tokens.STEAM_API) host: string, @inject(Tokens.HTTP_CLIENT) httpClient: HttpClient) {
    this.steamHost = host;
    this.httpClient = httpClient;
  }

  /**
   * Create order at steam market.
   */
  public async createOrder(request: CreateMarkerOrderRequest): Promise<string> {
    const data = new URLSearchParams();
    data.append("sessionid", request.sessionId);
    data.append("currency", request.currency as unknown as string);
    data.append("appid", request.appId as unknown as string);
    data.append("market_hash_name", request.marketHashName);
    data.append("price_total", request.priceTotal as unknown as string);
    data.append("quantity", request.quantity as unknown as string);
    data.append("billing_state", "");
    data.append("save_my_address", "0");

    const result = await this.httpClient.post<CreateMarketOrderResponse>(`${this.steamHost}/market/createbuyorder/`, data, {
      retries: {
        count: SteamMarketApiImpl.COUNT_RETRIES,
        needRetry: (result) => {
          return SteamMarketApiImpl.STEAM_RETRIES_CODES.includes(result.success);
        }
      }
    });

    if (result.success === 1) {
      return result.buy_orderid;
    }
    throw new Error("Can't place order at Steam :(");
  }


  public async getOrderStatus(sessionId: string, orderId: string): Promise<OrderStatusResponse> {
    const resultRaw = await this.httpClient.get<OrderStatusResponseRaw>(`${this.steamHost}/market/getbuyorderstatus/?sessionid=${sessionId}&buy_orderid=${orderId}`);


    if (resultRaw.success !== 1) {
      throw new Error("Can't get order status at Steam :(");
    }

    return {
      success: resultRaw.success === 1,
      active: resultRaw.active === 1,
      purchased: resultRaw.purchased,
      quantity: parseInt(resultRaw.quantity),
      quantityRemaining: parseInt(resultRaw.quantity_remaining)
    };
  }

  public async cancelOrder(sessionId: string, orderId: string): Promise<void> {

    const data = new URLSearchParams();
    data.append("sessionid", sessionId);
    data.append("buy_orderid", orderId);

    const result = await this.httpClient.post(`${this.steamHost}/market/cancelbuyorder/`, data);

    if (result.success !== 1) {
      throw new Error("Can't cancel order at Steam :(");
    }
  }

}

export default SteamMarketApiImpl;