/**
 * SteamCardExchange -
 */
import currency from "currency.js";

interface SteamBadgePrice {
  appId: number,
  appName: string,
  price: number
}

class SteamCardExchangeApi {


  constructor() {

    chrome.runtime.sendMessage({}, (response: any) => {
      console.log(response.data[0][0][0]);
    });
  }


  async getLoad(): Promise<Array<SteamBadgePrice>> {
    return new Promise<Array<SteamBadgePrice>>((resolve) => {
      chrome.runtime.sendMessage({}, (response: any) => {

        console.log(response)

        const result = response.data.map((metaData: Array<any>) => {
          // metaData[0][0];// APP-ID
          // metaData[0][1];// APP-Name
          // metaData[1]; // COUNT
          // metaData[2]; // PRICE DOLLAR
          return {
            appId: metaData[0][0],
            appName: metaData[0][1],
            price: currency(metaData[2]).intValue
          };
        }).sort((left: SteamBadgePrice, right: SteamBadgePrice) => {
          return left.price - right.price;
        });

        resolve(result)
      });
    });
  }
}

export default SteamCardExchangeApi;