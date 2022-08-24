import SteamCardExchangeApi, { SteamBadgePrice } from "../steam/api/SteamCardExchangeApi";
import SteamPageLoader from "../steam/pages/SteamPageLoader";
import { BadgeData } from "../steam/pages/component/Badges";
import { CardOrderDetail } from "../steam/pages/GameCardsPage";
import { CardMarketPosition } from "../steam/pages/component/CardBuyerTable";
import SteamCurrency from "../steam/utils/SteamCurrency";
import { injectable } from "tsyringe";


interface BadgeOrder {
  orderDetails: Array<CardMarketPosition>,
  currency: SteamCurrency
}

@injectable()
class LevelUpService {
  private readonly steamPageLoader: SteamPageLoader;
  private readonly exchangeApi: SteamCardExchangeApi;

  constructor(steamPageLoader: SteamPageLoader, steamCardExchangeApi: SteamCardExchangeApi) {
    this.steamPageLoader = steamPageLoader;
    this.exchangeApi = steamCardExchangeApi;
  }

  public async getUncompletedBadges(steamId: string): Promise<Array<SteamBadgePrice>> {
    const cheapestBadges = await this.exchangeApi.getLoad();
    const userBadges = await this.loadAllCompletedBadges(steamId);

    return cheapestBadges.filter(steamBadge => {
      const levelOfUserBadge = userBadges.get(steamBadge.appId);
      return levelOfUserBadge === undefined || levelOfUserBadge < 5;
    });
  }

  public async calculateOrderForBadge(steamId: string, appId: number, targetLevel: number): Promise<BadgeOrder> {
    const gameCardPage = await this.steamPageLoader.loadGameCard(steamId, appId);

    const details: Array<CardOrderDetail> = gameCardPage.getGameCards().map(gameCard => {
      return {
        hashName: gameCard.hashName,
        quantity: (targetLevel - gameCardPage.getLevelBadge() - gameCard.count)
      };
    }).filter(cardOrderDetails => {
      return cardOrderDetails.quantity > 0;
    });

    const marketPage = await this.steamPageLoader.loadCardMarketPage(
      gameCardPage.getCardMarketPageLink(details)
    );

    const currency = marketPage.getCurrency();

    currency.setCents(
      marketPage.getCards().reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price * currentValue.quantity;
      }, 0)
    );

    return {
      orderDetails: marketPage.getCards(),
      currency: currency
    };
  }


  private async loadAllCompletedBadges(steamId: string): Promise<Map<number, number>> {
    const map = new Map<number, number>;
    let page = await this.steamPageLoader.loadUserCompletedBadges(steamId, 1);
    this.badgesToMap(map, page.getBadges());
    while (page.hasNextPage()) {
      page = await this.steamPageLoader.loadUserCompletedBadges(steamId, page.getCurrentPage() + 1);
      this.badgesToMap(map, page.getBadges());
    }
    return map;
  }

  private badgesToMap(map: Map<number, number>, badges: Array<BadgeData>) {

    badges.forEach(badge => {
      map.set(badge.appId, badge.level);
    });
  }


}

export default LevelUpService;