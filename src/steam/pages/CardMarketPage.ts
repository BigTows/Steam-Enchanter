import SteamPage, { SteamPageConfiguration } from "./SteamPage";
import CardBuyerTable, { Card } from "./component/CardBuyerTable";
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
    // api.createOrder({
    //   sessionId: this.getSessionId() as string,
    //   currency: 5,
    //   appId: cards[0].appId,
    //   marketHashName: cards[0].hashName,
    //   priceTotal: cards[0].price * 1,
    //   quantity: 1
    // }).then((result) => {
    //   api.getOrderStatus(this.getSessionId() as string, result);
    //   api.cancelOrder(this.getSessionId() as string, result);
    // });


  }


  public getCards(): Array<Card> {
    return this.getComponentElement<CardBuyerTable>(Components.Table).getCards();
  }

  public getSessionId(): string | undefined {
    return Cookies.get("sessionid");
  }

}

export default CardMarketPage;