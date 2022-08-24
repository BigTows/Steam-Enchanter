import SteamCardTraderProcess, { CardOrderOperationContext } from "./SteamCardTraderProcess";
import { CardMarketPosition } from "../steam/pages/component/CardBuyerTable";
import Cookies from "js-cookie";
import { inject, injectable } from "tsyringe";
import SteamMarketApi from "../api/steam/SteamMarketApi";
import { Tokens } from "../configuration/Injector";

interface TradeOptions {

}

@injectable()
class SteamCardTraderService {
  private readonly steamMarketApi: SteamMarketApi;

  constructor(@inject(Tokens.STEAM_MARKET_API) steamMarketApi: SteamMarketApi) {
    this.steamMarketApi = steamMarketApi;
  }


  public async createTrader(positions: Array<CardMarketPosition>, currencyId: number): Promise<SteamCardTraderProcess> {
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
    return new SteamCardTraderProcess(this.steamMarketApi, sessionId, cardOrderOperationContexts);
  }


  private async createOrder(sessionId: string, position: CardMarketPosition, currencyId: number): Promise<string> {
    const maximumOverprice = 200;// TODO 200 is maximum overprice for position, move to options.

    return await this.steamMarketApi.createOrder({
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