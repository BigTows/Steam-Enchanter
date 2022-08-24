export class Tokens {
  public static readonly STEAM_API = "steamAPI";
  public static readonly HTTP_CLIENT = "httpClient";
  public static readonly STEAM_MARKET_API = "steamMarketApi";
}

import AxiosHttpClient from "../component/http/AxiosHttpClient";
import HttpClient from "../component/http/HttpClient";
import { container } from "tsyringe";
import SteamMarketApi from "../api/steam/SteamMarketApi";
import SteamMarketApiImpl from "../api/steam/SteamMarketApiImpl";

container.register<HttpClient>(Tokens.HTTP_CLIENT, {
  useClass: AxiosHttpClient
});
container.register(Tokens.STEAM_API, {
  useValue: "https://steamcommunity.com"
});

container.register<SteamMarketApi>(Tokens.STEAM_MARKET_API, {
  useClass: SteamMarketApiImpl
});

export const injector = container;