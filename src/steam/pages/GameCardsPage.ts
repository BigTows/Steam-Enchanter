/**
 * This is OOP retrospective of page Steam `Steam Community :: Steam Badges :: <APP_NAME>.
 * @link https://steamcommunity.com/id/<USER_NAME>/gamecards/<APP_ID>/
 */

import SteamPage, { SteamPageConfiguration } from "./SteamPage";
import SteamPageLoader from "./SteamPageLoader";
import CardMarketPage from "./CardMarketPage";
import ComponentLoader from "./component/ComponentLoader";
import GameCardExplore, { GameCard } from "./component/GameCardExplore";
import CardBadge from "./component/CardBadge";

export interface CardOrderDetail {
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
  cards = "cards",
  badge = "badge"
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
    },
    {
      name: Elements.badge,
      selector: "#responsive_page_template_content > div.pagecontent > div.maincontent > div > div > div.badge_content.gamecard_details > div.badge_current > div",
      component: new ComponentLoader(CardBadge)
    }
  ];
  private readonly gameAppId: number;

  private readonly gameCardMetaList: Array<GameCardMeta>;

  constructor(root: HTMLElement, appId: number) {
    super(root, GameCardsPage.configuration);
    this.gameAppId = appId;
    this.gameCardMetaList = this.loadGameCardMeta(root);
  }


  private loadGameCardMeta(dom: HTMLElement): Array<GameCardMeta> {
    const badgeCardStatus = this.getComponentElement<GameCardExplore>(Elements.cards).getGameCards();

    const hashes = this.findHashesFromLink(dom.querySelector("div.badge_cards_to_collect > div.gamecards_inventorylink > a") as HTMLLinkElement);


    const countEquals = this.userHashSameCountOfCards(badgeCardStatus);

    return badgeCardStatus.map((ownedCard, index) => {
      const approximateHash = `${this.gameAppId}-${ownedCard.name}`;
      let hashName;
      if (countEquals) {
        hashName = hashes[index] ?? approximateHash;
      } else {
        hashName = hashes.find((hash) => {
          return hash.includes(approximateHash, 0);
        }) ?? approximateHash;
      }
      return <GameCardMeta>{
        name: ownedCard.name,
        hashName: hashName,
        count: ownedCard.count
      };
    });
  }

  private userHashSameCountOfCards(badgeCardStatus: Array<GameCard>): boolean {
    const sorted = badgeCardStatus.sort((left: GameCard, right: GameCard) => {
      return left.count - right.count;
    });
    return sorted[0].count === sorted[sorted.length - 1].count;
  }

  /**
   * Try to find link with real hash name of cards.
   * This need because sometimes `Steam` use postfix `(Trading Card)` for some cards. (I don't understand that thing ;/)
   * @private
   */
  private findHashesFromLink(linkElement: HTMLLinkElement | null): Array<string> {
    if (linkElement === null) {
      return [];
    }
    const link = new URL(linkElement.href);
    return link.searchParams.getAll("items[]");
  }

  public async getCardMarketPage(details: Array<CardOrderDetail>): Promise<CardMarketPage> {

    const params = new URLSearchParams();

    params.append("appid", GameCardsPage.STEAM_CARD_APP_ID);

    details.forEach((detail) => {
      params.append("items[]", detail.hashName);
      params.append("qty[]", `${detail.quantity}`);
    });

    return await SteamPageLoader.loadCardMarketPage(
      `https://steamcommunity.com/market/multibuy?${params.toString()}`
    );
  }


  public getGameCards(): Array<GameCardMeta> {
    return this.gameCardMetaList;
  }

  public getLevelBadge(): number {
    return this.getComponentElement<CardBadge>(Elements.badge).getLevel();
  }
}

export default GameCardsPage;