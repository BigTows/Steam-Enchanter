import SteamPage, { SteamPageConfiguration } from "./SteamPage";
import CardBuyerTable, { CardMarketPosition } from "./component/CardBuyerTable";
import ComponentLoader from "./component/ComponentLoader";
import Cookies from "js-cookie";
import Currency from "../utils/Currency";

enum Components {
  Table = "Table",
  scriptWithWalletData = "script"
}

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
    const result = scriptElement.innerHTML.match(/wallet_currency\":(\d*),/);

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

  /**
   * TODO remove from where
   * @deprecated
   */
  public getSessionId(): string | undefined {
    return Cookies.get("sessionid");
  }

}

export default CardMarketPage;