import axios, { Axios } from "axios";
import SteamCardTraderProcess from "./SteamCardTraderProcess";
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


  public async createTrader(positions: Array<CardMarketPosition>): SteamCardTraderProcess {
    const api = new SteamMarketApi();
    const sessionId = this.getSessionId();

    const maximumOverprice = 200;// TODO 200 is maximum overprice for position, move to options.

    positions.forEach(position => {
      api.createOrder({
        sessionId: sessionId,
        currency: 5, // TODO need to calculate
        appId: position.appId,
        marketHashName: position.hashName,
        priceTotal: (position.price + maximumOverprice) * position.quantity,
        quantity: position.quantity
      });
    });
  }


  private async createOrder(sessionId: string, position: CardMarketPosition, attempts: number) {
    const api = new SteamMarketApi();
    const maximumOverprice = 200;// TODO 200 is maximum overprice for position, move to options.
    try {
      await api.createOrder({
        sessionId: sessionId,
        currency: 5, // TODO need to calculate
        appId: position.appId,
        marketHashName: position.hashName,
        priceTotal: (position.price + maximumOverprice) * position.quantity,
        quantity: position.quantity
      });
    }catch ()
  }

  private getSessionId(): string {
    const sessionId = Cookies.get("sessionid");
    if (sessionId === undefined) {
      throw new Error("Session id is not initialized");
    }
    return sessionId;
  }


}