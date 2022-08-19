import Table, { RowConfiguration } from "./Table";
import SteamElement from "./SteamElement";
import currency from "currency.js";

export interface CardMarketPosition {
  quantity: number,
  appId: number,
  hashName: string,
  price: number
}

class CardBuyerTable extends Table implements SteamElement {

  private static readonly configuration: Array<RowConfiguration | undefined> = [
    {
      name: "quantity",
      executor: (td) => {
        return td.getElementsByTagName("input")[0].value;
      }
    },
    {
      name: "marketHashName",
      executor: (td) => {
        let url = decodeURIComponent(td.getElementsByTagName("a")[0].href);
        url = url.replace("https://steamcommunity.com/market/listings/", "");
        const paths = url.split("/");
        return [
          paths[0],//AppId
          paths[1]// marketHashName
        ];
      }
    },
    {
      name: "price",
      executor: (td) => {
        return td.getElementsByTagName("input")[0].value;
      }
    }
  ];

  private readonly cards: Array<CardMarketPosition>;


  constructor(table: HTMLElement) {
    super(table as HTMLTableElement, CardBuyerTable.configuration);

    this.cards = this.getRows().map((rowKeyValue) => {
      const metaData =  rowKeyValue.get("marketHashName") as Array<string>;

      return <CardMarketPosition>{
        quantity: parseInt(rowKeyValue.get("quantity") as string),
        price: currency(rowKeyValue.get("price") as string).value,
        appId: parseInt(metaData[0]),
        hashName: metaData[1],
      };
    });
  }


  public getCards(): Array<CardMarketPosition> {
    return this.cards;
  }

}

export default CardBuyerTable;