/**
 * This is OOP retrospective of page Steam `Steam Community :: Steam Badges :: <APP_NAME>
 */

import SteamPage, { SteamPageConfiguration } from "./SteamPage";
import SteamPageLoader from "./SteamPageLoader";
import CardMarketPage from "./CardMarketPage";
import ComponentLoader from "./component/ComponentLoader";
import GameCardExplore from "./component/GameCardExplore";

export interface CardOrderDetails {
  /**
   * Hash name of card
   */
  hashName: string,

  /**
   * Quantity need's to buy
   */
  quantity: number
}

enum Elements {
  cards = "cards"
}

interface GameCardMeta {
  name: string,
  hashName: string,
  count: number
}

class GameCardsPage extends SteamPage {

  private static STEAM_CARD_APP_ID: string = "753";

  private static readonly configuration: Array<SteamPageConfiguration> = [
    {
      name: Elements.cards,
      selector: "#responsive_page_template_content > div.pagecontent > div.maincontent > div.badge_row.depressed.badge_gamecard_page > div > div:nth-child(6) > div.badge_card_set_cards",
      component: new ComponentLoader(GameCardExplore)
    }
  ];
  private readonly gameAppId: number;

  constructor(root: HTMLElement, appId: number) {
    super(root, GameCardsPage.configuration);
    this.gameAppId = appId;
  }

  public async getCardMarketPage(details: Array<CardOrderDetails>): Promise<CardMarketPage> {

    const params = new URLSearchParams();

    params.append("appid", GameCardsPage.STEAM_CARD_APP_ID);

    this.getGameCards().forEach((gameCard) => {
      params.append("items[]", gameCard.hashName);
      params.append("qty[]", this.findQuantity(gameCard.hashName, details));
    });

    return await SteamPageLoader.loadCardMarketPage(
      `https://steamcommunity.com/market/multibuy?${params.toString()}`
    );
  }

  private findQuantity(cardHashName: string, details: Array<CardOrderDetails>): string {

    const result = details.find((detail) => {
      return detail.hashName === cardHashName;
    });
    if (result === undefined) {
      return "0";
    }
    return result.quantity + "";
  }


  public getGameCards(): Array<GameCardMeta> {
    const ownedCards = this.getComponentElement<GameCardExplore>(Elements.cards).getGameCards();
    return ownedCards.map((ownedCard) => {
      return <GameCardMeta>{
        name: ownedCard.name,
        hashName: `${this.gameAppId}-${ownedCard.name}`,
        count: ownedCard.count
      };
    });
  }
}

export default GameCardsPage;