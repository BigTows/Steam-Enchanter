import SteamCardExchangeApi, { SteamBadgePrice } from "../steam/api/SteamCardExchangeApi";
import SteamPageLoader from "../steam/pages/SteamPageLoader";
import { BadgeData } from "../steam/pages/component/Badges";
import { CardOrderDetail } from "../steam/pages/GameCardsPage";
import { CardMarketPosition } from "../steam/pages/component/CardBuyerTable";
import SteamCurrency from "../steam/utils/SteamCurrency";


interface BadgeOrder {
  orderDetails: Array<CardMarketPosition>,
  currency: SteamCurrency
}

class LevelUpService {
  private readonly exchangeApi: SteamCardExchangeApi = new SteamCardExchangeApi();

  public async getUncompletedBadges(steamId: string): Promise<Array<SteamBadgePrice>> {
    const cheapestBadges = await this.exchangeApi.getLoad();
    const userBadges = await this.loadAllCompletedBadges(steamId);

    return cheapestBadges.filter(steamBadge => {
      const levelOfUserBadge = userBadges.get(steamBadge.appId);
      return levelOfUserBadge === undefined || levelOfUserBadge < 5;
    });
  }

  public async calculateOrderForBadge(steamId: string, appId: number, targetLevel: number): Promise<BadgeOrder> {
    const gameCardPage = await SteamPageLoader.loadGameCard(steamId, appId);

    const details: Array<CardOrderDetail> = gameCardPage.getGameCards().map(gameCard => {
      return {
        hashName: gameCard.hashName,
        quantity: (targetLevel - gameCardPage.getLevelBadge() - gameCard.count)
      };
    }).filter(cardOrderDetails => {
      return cardOrderDetails.quantity > 0;
    });

    const marketPage = await gameCardPage.getCardMarketPage(details);

    const currency = marketPage.getCurrency();

    currency.setCents(
      marketPage.getCards().reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price * currentValue.quantity;
      }, 0)
    )

    return {
      orderDetails: marketPage.getCards(),
      currency: currency
    };
  }


  private async loadAllCompletedBadges(steamId: string): Promise<Map<number, number>> {
    const map = new Map<number, number>;
    let page = await SteamPageLoader.loadUserCompletedBadges(steamId, 1);
    this.badgesToMap(map, page.getBadges());
    while (page.hasNextPage()) {
      page = await page.nextPage();
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