import LevelUpBlock from "../steam/teamplates/LevelUpBlock";
import SteamCardExchangeApi, { SteamBadgePrice } from "../steam/api/SteamCardExchangeApi";
import SteamPageLoader from "../steam/pages/SteamPageLoader";
import { BadgeData } from "../steam/pages/component/Badges";
import { CardOrderDetail } from "../steam/pages/GameCardsPage";
import currency from "currency.js";
import { CardMarketPosition } from "../steam/pages/component/CardBuyerTable";
import SteamCardTraderService from "./SteamCardTraderService";
import { Status } from "./SteamCardTraderProcess";
import { injector } from "../configuration/Injector";

class LevelUpService {
  private readonly exchangeApi: SteamCardExchangeApi = new SteamCardExchangeApi();

  private template: LevelUpBlock;

  private steamBadgePrices: Array<SteamBadgePrice> | undefined;

  private readonly steamId: string;

  constructor(template: LevelUpBlock, steamId: string) {
    this.template = template;
    this.steamId = steamId;
    this.exchangeApi.getLoad().then(result => {
      this.steamBadgePrices = result;
    });
  }

  public async loadUncompletedBadges() {

    if (this.steamBadgePrices === undefined) {
      throw new Error("Can't load steam exchange API");
    }
    const userBadges = await this.loadAllCompletedBadges();


    this.steamBadgePrices.filter(steamBadge => {
      const levelOfUserBadge = userBadges.get(steamBadge.appId);
      return levelOfUserBadge === undefined || levelOfUserBadge < 5;
    }).splice(0, 40)//TODO pagination
      .forEach(steamBadge => {
        this.template.addApp(steamBadge.appId, steamBadge.appName, (actions) => {
          actions.showProcess();
          SteamPageLoader.loadGameCard(this.steamId, steamBadge.appId).then((page) => {

            const details: Array<CardOrderDetail> = page.getGameCards().map(gameCard => {
              return {
                hashName: gameCard.hashName,
                quantity: (5 - page.getLevelBadge() - gameCard.count)
              };
            }).filter(cardOrderDetails => {
              return cardOrderDetails.quantity > 0;
            });

            console.log(details)

            actions.showProcess();

            page.getCardMarketPage(details).then(page => {
              actions.changePrice(
                currency(page.getCards().reduce((accumulator, currentValue) => {
                  return accumulator + currentValue.price * currentValue.quantity;
                }, 0) / 100
                ).format({
                  fromCents: true,
                  symbol: page.getCurrency().symbol
                })
              );
              console.log(page.getCards())
              actions.finishCalculation(page.getCards(), page.getCurrency().id);
            }).catch(err => {
              console.log(err);
              actions.error();
            });
          }).catch(err => {
            actions.error();
            console.log(err);
          });

        }, (order: Array<CardMarketPosition>, currencyId: number, actions) => {
          actions.showProcess();

          injector.resolve(SteamCardTraderService).createTrader(
            order,
            currencyId
          ).then(a => {
            const interval = setInterval(() => {
              if (a.getCurrentStatus() === Status.finished) {
                clearInterval(interval);
                actions.success();
              } else if (a.getCurrentStatus() === Status.error) {
                clearInterval(interval);
                actions.error();
              }
            }, 1000);
          }).catch(err => {
            console.log(err);
            actions.error();
          });
        });
      });
  }


  private async loadAllCompletedBadges(): Promise<Map<number, number>> {
    const map = new Map<number, number>;
    let page = await SteamPageLoader.loadUserCompletedBadges(this.steamId, 1);
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