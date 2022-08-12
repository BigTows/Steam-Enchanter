import SteamPage, { SteamPageConfiguration } from "./SteamPage";
import Table, { RowConfiguration } from "./elements/Table";

class CardMarketPage extends SteamPage {

  private static readonly configuration: Array<SteamPageConfiguration> = [
    {
      name: "test",
      selector: "#BG_bottom > table",
      component: undefined
    }
  ];


  constructor(root: HTMLElement) {

    const config: Array<RowConfiguration | undefined> = [
      {
        name: "test",
        executor: (td) => {
          return td.getElementsByTagName("input")[0].value;
        }
      },
      {
        name: "market_hash_name",
        executor: (td) => {
          const paths = decodeURI(td.getElementsByTagName("a")[0].href).split("/");
          return paths[paths.length - 1];
        }
      },
      {
        name: "price",
        executor: (td) => {
          return td.getElementsByTagName("input")[0].value;
        }
      }
    ];
    //TODO {"success":1,"buy_orderid":""} POST
    // https://steamcommunity.com/market/createbuyorder/
    // sessionid=
    // &currency=5
    // appid=753
    // market_hash_name=567060-Nazi+Brute
    // price_total=10
    // quantity=1
    // billing_state=
    // save_my_address=0

    //TODO GET
    // https://steamcommunity.com/market/getbuyorderstatus/?sessionid=&buy_orderid=
    // {"success":1,"active":1,"purchased":0,"quantity":"1","quantity_remaining":"1","purchases":[]}

    //TODO POST
    // https://steamcommunity.com/market/cancelbuyorder/
    // sessionid:
    // buy_orderid:



    new Table(
      root.querySelector("#BG_bottom > table") as HTMLElement as HTMLTableElement,
      config
    );


    console.log(root);
    super(root, []);
  }

}

export default CardMarketPage;