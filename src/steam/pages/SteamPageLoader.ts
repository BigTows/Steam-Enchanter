import GameCardsPage from "./GameCardsPage";
import axios from "axios";
import CardMarketPage from "./CardMarketPage";
import UserCompletedBadgesPage from "./UserCompletedBadgesPage";

class SteamPageLoader {


  public static async loadGameCard(steamId: string, appId: number): Promise<GameCardsPage> {
    const html = await SteamPageLoader.loadPage(`https://steamcommunity.com/profiles/${steamId}/gamecards/${appId}`);
    return new GameCardsPage(html, appId);
  }


  public static async loadCardMarketPage(link: string): Promise<CardMarketPage> {
    return new CardMarketPage(
      await SteamPageLoader.loadPage(link)
    );
  }

  public static async loadUserCompletedBadges(steamId: string, page: number): Promise<UserCompletedBadgesPage> {

    return new UserCompletedBadgesPage(
      await SteamPageLoader.loadPage(`https://steamcommunity.com/profiles/${steamId}/badges/?sort=c&p=${page}`),
      steamId, page
    );

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