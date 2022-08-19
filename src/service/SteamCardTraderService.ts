import axios, { Axios } from "axios";
import SteamCardTraderProcess, { CardOrderOperationContext } from "./SteamCardTraderProcess";
import { CardMarketPosition } from "../steam/pages/component/CardBuyerTable";
import Cookies from "js-cookie";
import SteamMarketApi from "../steam/api/SteamMarketApi";

interface TradeOptions {

}

class SteamCardTraderService {
  private readonly httpClient: Axios;

  constructor() {
    //TODO axios
    this.httpClient = axios;
  }


  public async createTrader(positions: Array<CardMarketPosition>, currencyId: number): Promise<SteamCardTraderProcess> {
    const api = new SteamMarketApi();
    const sessionId = this.getSessionId();

    const cardOrderOperationContexts: Array<CardOrderOperationContext> = [];

    for (const position of positions) {

      const result = await this.createOrder(sessionId, position, currencyId);
      cardOrderOperationContexts.push(
        {
          orderId: result,
          quantity: position.quantity
        }
      );

    }
    return new SteamCardTraderProcess(api, sessionId, cardOrderOperationContexts);
  }


  private async createOrder(sessionId: string, position: CardMarketPosition, currencyId: number): Promise<string> {
    const api = new SteamMarketApi();
    const maximumOverprice = 200;// TODO 200 is maximum overprice for position, move to options.

    return await api.createOrder({
      sessionId: sessionId,
      currency: currencyId,
      appId: position.appId,
      marketHashName: position.hashName,
      priceTotal: (position.price + maximumOverprice) * position.quantity,
      quantity: position.quantity
    });
  }

  private getSessionId(): string {
    const sessionId = Cookies.get("sessionid");
    if (sessionId === undefined) {
      throw new Error("Session id is not initialized");
    }
    return sessionId;
  }


}

export default SteamCardTraderService;