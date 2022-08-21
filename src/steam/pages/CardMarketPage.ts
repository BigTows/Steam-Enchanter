import SteamPage, { SteamPageConfiguration } from "./SteamPage";
import CardBuyerTable, { CardMarketPosition } from "./component/CardBuyerTable";
import ComponentLoader from "./component/ComponentLoader";
import Currency from "../utils/Currency";

enum Components {
  Table = "Table",
  scriptWithWalletData = "script"
}

/**
 * Page like
 * https://steamcommunity.com/market/multibuy?appid=753&items[]=530860-Horizon&qty[]=0&items[]=530860-Melted&qty[]=0&items[]=530860-Cliff&qty[]=0&items[]=530860-Crossroads%20%28Trading%20Card%29&qty[]=0&items[]=530860-Trader%20%28Trading%20Card%29&qty[]=0&items[]=530860-Desert%20%28Trading%20Card%29&qty[]=1
 */
class CardMarketPage extends SteamPage {

  private static readonly configuration: Array<SteamPageConfiguration> = [
    {
      name: Components.Table,
      selector: "#BG_bottom > table",
      component: new ComponentLoader(CardBuyerTable)
    },
    {
      name: Components.scriptWithWalletData,
      selector: "#responsive_page_template_content > script:nth-child(2)"
    }
  ];
  private readonly currency: number;


  constructor(root: HTMLElement) {
    super(root, CardMarketPage.configuration);
    this.currency = this.findCurrencyWallet(this.getHtmlElement(Components.scriptWithWalletData));
  }


  private findCurrencyWallet(scriptElement: HTMLElement): number {
    const result = scriptElement.innerHTML.match(/wallet_currency":(\d*),/);

    if (result === null || result.length !== 2) {
      throw new Error("Can't find currency");
    }

    return parseInt(result[1]);
  }


  public getCards(): Array<CardMarketPosition> {
    return this.getComponentElement<CardBuyerTable>(Components.Table).getCards();
  }

  public getCurrency(): { id: number; symbol: string } {
    return {
      id: this.currency,
      symbol: Currency.getCurrencySymbolByWalletCurrencyNumber(this.currency)
    };
  }

}

export default CardMarketPage;