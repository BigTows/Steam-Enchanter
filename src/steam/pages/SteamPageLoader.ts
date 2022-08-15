import GameCardsPage from "./GameCardsPage";
import axios from "axios";
import CardMarketPage from "./CardMarketPage";
import UserCompletedBadgesPage from "./UserCompletedBadgesPage";

class SteamPageLoader {


  public static async loadGameCard(steamId: string, appId: number): Promise<GameCardsPage> {

    return SteamPageLoader.loadWithRetries(async () => {
      return new GameCardsPage(
        await SteamPageLoader.loadPage(`https://steamcommunity.com/profiles/${steamId}/gamecards/${appId}`), appId);
    }, 4);
  }


  public static async loadCardMarketPage(link: string): Promise<CardMarketPage> {
    return SteamPageLoader.loadWithRetries(async () => {
      return new CardMarketPage(
        await SteamPageLoader.loadPage(link)
      );
    }, 4);
  }

  public static async loadUserCompletedBadges(steamId: string, page: number): Promise<UserCompletedBadgesPage> {

    return SteamPageLoader.loadWithRetries(async () => {
      return new UserCompletedBadgesPage(
        await SteamPageLoader.loadPage(`https://steamcommunity.com/profiles/${steamId}/badges/?sort=c&p=${page}`),
        steamId, page
      );
    }, 4);


  }

  private static async loadWithRetries<T>(builder: (() => Promise<T>), retries: number) {
    while (retries > 0) {
      try {
        return await builder();
      } catch (err) {
        retries--;
      }
    }
    throw new Error("Can't load page :(");
  }


  private static async loadPage(url: string): Promise<HTMLElement> {
    console.log("LOAD page: ", url);
    const result = await axios.get(url, { withCredentials: true });

    const root = document.createElement("html");
    root.innerHTML = result.data;
    return root;
  }
}

export default SteamPageLoader;