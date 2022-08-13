import SteamPage, { SteamPageConfiguration } from "./SteamPage";
import CardBuyerTable from "./component/CardBuyerTable";
import ComponentLoader from "./component/ComponentLoader";
import Cookies from "js-cookie";
import SteamMarketApi from "../api/SteamMarketApi";

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

    const cards = this.getComponentElement<CardBuyerTable>(Components.Table).getCards();
    const api = new SteamMarketApi();
    // api.createOrder({
    //   sessionId: this.getSessionId() as string,
    //   currency: 5,
    //   appId: cards[0].appId,
    //   marketHashName: cards[0].hashName,
    //   priceTotal: 170,
    //   quantity: 10
    // });

    api.getOrderStatus(this.getSessionId() as string, "5332634257")
    api.cancelOrder(this.getSessionId() as string, "5332634257")



  }

  public getSessionId(): string | undefined {
    return Cookies.get("sessionid");
  }

}

export default CardMarketPage;