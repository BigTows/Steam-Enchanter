import { CardMarketPosition } from "../pages/component/CardBuyerTable";
import Badges from "../../react/component/Badges";
import React from "react";
import { createRoot } from "react-dom/client";

interface AppElementAction {
  showProcess: (() => void),
  finishCalculation: ((details: Array<CardMarketPosition>, currencyId: number) => void),
  initOrder: (() => void),
  error: (() => void),
  success: (() => void),
  changePrice: ((value: string) => void),
}

class LevelUpBlock {
  private static readonly ID_PREFIX = "levelUpBlockTemplate";
  private readonly block: HTMLElement;
  private readonly gamesContainer: HTMLElement;
  private readonly steamId: string;

  constructor(steamId: string) {
    this.steamId = steamId;
    this.block = document.createElement("div");
    this.block.setAttribute("data-panel", "{\"type\":\"PanelGroup\"}");
    this.block.className = "profile_customization";
    this.block.style.display = "none";
    this.block.style.width = "100%";
    //this.block.innerHTML = this.getBaseTemplate();
    this.gamesContainer = this.block.getElementsByClassName(`${LevelUpBlock.ID_PREFIX}GamesContainer`)[0] as HTMLElement;


    const root = createRoot(this.block!);
    root.render(<Badges steamId={steamId}/>);
  }


  private getBaseTemplate() {
    return `
<div class="profile_customization_header ellipsis">Level up (beta#mvp)</div>
<div class="profile_customization_block">
  <div class="customtext_showcase">
    <div class="showcase_content_bg showcase_notes">

      <div id="BG_bottom" class="market_multibuy">
        <table style="width: 100%">
          <colgroup>
            <col style="width: 60%">
            <col style="width: 10%">
            <col style="width: 30%">
          </colgroup>
          <thead>
          <tr>
            <td style="border-right: 1px solid #404040">ITEM NAME</td>
            <td colspan="2">PRICE</td>
          </tr>
          </thead>
          <tbody class="${LevelUpBlock.ID_PREFIX}GamesContainer">
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
    `;
  }


  public getBlock() {
    return this.block;
  }

  public hide(): void {
    this.block.style.display = "none";
  }

  public show(): void {
    this.block.style.display = "";
  }

  /**
   * TODO Move to react, fuck this self-made reactive
   * @param appId
   * @param appName
   * @param pricePerBadge
   * @param onCalculation
   * @param onBuy
   */
  public addApp(appId: number, appName: string,
                onCalculation: ((actions: AppElementAction) => void),
                onBuy: ((positions: Array<CardMarketPosition>, currencyId:number, callbacks: AppElementAction) => void),
  ) {
    const appElement = document.createElement("tr");
    appElement.innerHTML = this.appElementTemplate(appId, appName);
    //shit -- start
    const calculateButton = (appElement.getElementsByClassName(`${LevelUpBlock.ID_PREFIX}${appId}Calculate`)[0] as HTMLElement);
    const placeOrderButton = (appElement.getElementsByClassName(`${LevelUpBlock.ID_PREFIX}${appId}placeOrder`)[0] as HTMLElement);
    const waiting = (appElement.getElementsByClassName(`${LevelUpBlock.ID_PREFIX}${appId}waiting`)[0] as HTMLElement);
    const success = (appElement.getElementsByClassName(`${LevelUpBlock.ID_PREFIX}${appId}success`)[0] as HTMLElement);
    const error = (appElement.getElementsByClassName(`${LevelUpBlock.ID_PREFIX}${appId}error`)[0] as HTMLElement);
    const price = (appElement.getElementsByClassName(`${LevelUpBlock.ID_PREFIX}${appId}price`)[0] as HTMLElement);

    const callbacks: AppElementAction = {
      showProcess: (): void => {
        calculateButton.style.display = "none";
        placeOrderButton.style.display = "none";
        waiting.style.display = "";
      },
      initOrder: (): void => {
        placeOrderButton.style.display = "none";
      },
      finishCalculation: (positions: Array<CardMarketPosition>, currencyId: number): void => {
        waiting.style.display = "none";
        placeOrderButton.style.display = "";
        placeOrderButton.onclick = function() {
          onBuy(positions,currencyId, callbacks);
        };
      },
      changePrice: (value: string): void => {
        price.innerText = value;
      },
      success: () => {
        waiting.style.display = "none";
        success.style.display = "";
      },
      error: () => {
        waiting.style.display = "none";
        error.style.display = "";
      }
    };

      calculateButton.onclick = function() {
        onCalculation(callbacks);
      };

    //shit -- still

    this.gamesContainer.appendChild(appElement);
  }


  private appElementTemplate(appId: number, appName: string) {
    return `
<td>
                              <div style="display: table">
                                  <img src="https://cdn.akamai.steamstatic.com/steam/apps/${appId}/capsule_sm_120.jpg"
                                       class="market_listing_item_img economy_item_hoverable" alt="">
                                  <span class="market_multi_itemname economy_item_hoverable"
                                        style=" float: right; display: table;">
<a class="market_listing_item_name_link" target="_blank"
                   href="https://steamcommunity.com/profiles/${this.steamId}/gamecards/${appId}">
                   
                   
 <p style="
  max-width: 25ch;
  text-overflow: ellipsis;
  overflow:hidden;
  white-space: nowrap;">${appName}</p>
</a>
</span>
                     
                              </td>
                              <td>
                                <span class="market_dialog_input market_multi_price">
<span id="market_multibuy_order_total"><span class="${LevelUpBlock.ID_PREFIX}${appId}price">XXX</span>
            <span class="market_whatsthis" title="This is the most you can end up spending as a result of this buy order.
Items will be purchased at the cheapest price available, so the order may end up costing less than this amount.">(?)</span>
          </span>
                                </span>
                              </td>
                              <td>

                                <div class="market_multi_status">
                                  <a id="market_multibuy_purchase"
                                     class="btn_green_white_innerfade btn_medium_wide btn_uppercase market_unstyled_button"
                                     style=""><span class="${LevelUpBlock.ID_PREFIX}${appId}Calculate">Calculate</span></a>
                                   <a id="market_multibuy_purchase"
                                     class="btn_green_white_innerfade btn_medium_wide btn_uppercase market_unstyled_button"
                                     style=""><span class="${LevelUpBlock.ID_PREFIX}${appId}placeOrder" style="display: none">PLACE ORDER</span></a>
                                  <div class="market_multi_throbber ${LevelUpBlock.ID_PREFIX}${appId}waiting"  style="display: none">
                                    <div class="LoadingWrapper">
                                      <div class="LoadingThrobber" style="height: 50px; margin-top: 17px;">
                                        <div class="Bar Bar1"></div>
                                        <div class="Bar Bar2"></div>
                                        <div class="Bar Bar3"></div>
                                      </div>
                                    </div>
                                  </div>
                                  <span class="market_multi_warning ${LevelUpBlock.ID_PREFIX}${appId}success" 
                                        style="display: none">✔️</span>
                                  <span
                                        class="market_multi_warning market_multi_warning_withimg ${LevelUpBlock.ID_PREFIX}${appId}error"  style="display: none"><img
                                    src="https://community.akamai.steamstatic.com/public/images/economy/market/icon_alertlistings.png"></span>
                                  <span class="market_multi_warning"
                                        style="display: none">⚠️</span>
                                </div>
                              </td>
    `;
  }
}


export default LevelUpBlock;