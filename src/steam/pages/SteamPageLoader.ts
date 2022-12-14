import GameCardsPage from "./GameCardsPage";
import CardMarketPage from "./CardMarketPage";
import UserCompletedBadgesPage from "./UserCompletedBadgesPage";
import { inject, injectable } from "tsyringe";
import HttpClient from "../../component/http/HttpClient";
import { Tokens } from "../../configuration/Injector";

@injectable()
class SteamPageLoader {
  private readonly host: string;
  private readonly httpClient: HttpClient;


  constructor(@inject(Tokens.STEAM_API) host: string, @inject(Tokens.HTTP_CLIENT) httpClient: HttpClient) {
    this.host = host;
    this.httpClient = httpClient;
  }

  public async loadGameCard(steamId: string, appId: number): Promise<GameCardsPage> {
    console.log(`${this.host}/profiles/${steamId}/gamecards/${appId}`)
    return await this.httpClient.get<GameCardsPage>(`${this.host}/profiles/${steamId}/gamecards/${appId}`, {
      retries: {
        count: 4,
        needRetry: () => {
          return false;
        }
      },
      transformer: (response: HTMLElement) => {
        return new GameCardsPage(response, appId);
      }
    });
  }


  public async loadCardMarketPage(link: string): Promise<CardMarketPage> {

    return await this.httpClient.get<CardMarketPage>(link, {
      retries: {
        count: 6,
        needRetry: () => {
          return false;
        }
      },
      transformer: (response: HTMLElement) => {
        return new CardMarketPage(response);
      }
    });
  }

  public async loadUserCompletedBadges(steamId: string, page: number): Promise<UserCompletedBadgesPage> {

    return await this.httpClient.get<UserCompletedBadgesPage>(
      `${this.host}/profiles/${steamId}/badges/?sort=c&p=${page}`, {
        retries: {
          count: 4,
          needRetry: () => {
            return false;
          }
        },
        transformer: (response: HTMLElement) => {
          return new UserCompletedBadgesPage(response, steamId, page);
        }
      });
  }
}

export default SteamPageLoader;