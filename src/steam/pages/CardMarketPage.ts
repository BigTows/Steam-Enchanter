import SteamPage, { SteamPageConfiguration } from "./SteamPage";
import CardBuyerTable, { CardMarketPosition } from "./component/CardBuyerTable";
import ComponentLoader from "./component/ComponentLoader";
import Cookies from "js-cookie";

enum Components {
  Table = "Table",
}

class CardMarketPage extends SteamPage {

  private static readonly configuration: Array<SteamPageConfiguration> = [
    {
      name: Components.Table,
      selector: "#BG_bottom > table",
      component: new ComponentLoader(CardBuyerTable)
    }
  ];


  constructor(root: HTMLElement) {

    super(root, CardMarketPage.configuration);
  }


  public getCards(): Array<CardMarketPosition> {
    return this.getComponentElement<CardBuyerTable>(Components.Table).getCards();
  }

  public getSessionId(): string | undefined {
    return Cookies.get("sessionid");
  }

}

export default CardMarketPage;