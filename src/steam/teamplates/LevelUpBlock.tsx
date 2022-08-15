class LevelUpBlock {
  private static readonly ID_PREFIX = "levelUpBlockTemplate";
  private readonly block: HTMLElement;
  private readonly gamesContainer: HTMLElement;

  constructor() {
    this.block = document.createElement("div");
    this.block.setAttribute("data-panel", "{\"type\":\"PanelGroup\"}");
    this.block.className = "profile_customization";
    this.block.style.display = "none";
    this.block.style.width = "100%";
    this.block.innerHTML = this.getBaseTemplate();
    this.gamesContainer = this.block.getElementsByClassName(`${LevelUpBlock.ID_PREFIX}GamesContainer`)[0] as HTMLElement;
  }


  private getBaseTemplate() {
    return `
<div class="profile_customization_header ellipsis">Test</div>
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


  public addApp(appId: number, appName: string, pricePerBadge: number, onClick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null) {
    const appElement = document.createElement("tr");
    appElement.innerHTML = this.appElementTemplate(appId, appName, pricePerBadge);

    (appElement.getElementsByClassName(`${LevelUpBlock.ID_PREFIX}${appId}placeOrder`)[0] as HTMLElement).onclick = onClick;
    this.gamesContainer.appendChild(appElement);
  }



  private appElementTemplate(appId: number, appName: string, pricePerBadge: number) {
    return `
<td>
                              <div style="display: table">
                                  <img src="https://cdn.akamai.steamstatic.com/steam/apps/${appId}/capsule_sm_120.jpg"
                                       class="market_listing_item_img economy_item_hoverable" alt="">
                                  <span class="market_multi_itemname economy_item_hoverable"
                                        style=" float: right; display: table;">
<a class="market_listing_item_name_link"
                   href="https://store.steampowered.com/app/${appId}">
                   
                   
 <p style="
  max-width: 30ch;
  text-overflow: ellipsis;
  overflow:hidden;
  white-space: nowrap;">${appName}</p>
</a>
</span>
                     
                              </td>
                              <td>
                                <span class="market_dialog_input market_multi_price">
<span id="market_multibuy_order_total">${pricePerBadge}
            <span class="market_whatsthis" title="This is the most you can end up spending as a result of this buy order.
Items will be purchased at the cheapest price available, so the order may end up costing less than this amount.">(?)</span>
          </span>
                                </span>
                              </td>
                              <td>

                                <div class="market_multi_status">
                                  <a id="market_multibuy_purchase"
                                     class="btn_green_white_innerfade btn_medium_wide btn_uppercase market_unstyled_button"
                                     style=""><span class="${LevelUpBlock.ID_PREFIX}${appId}placeOrder">PLACE ORDER</span></a>
                                  <div class="market_multi_throbber" style="display: none">
                                    <div class="LoadingWrapper">
                                      <div class="LoadingThrobber" style="height: 50px; margin-top: 17px;">
                                        <div class="Bar Bar1"></div>
                                        <div class="Bar Bar2"></div>
                                        <div class="Bar Bar3"></div>
                                      </div>
                                    </div>
                                  </div>
                                  <span id="buy_176139861_success" class="market_multi_warning"
                                        style="display: none">✔️</span>
                                  <span id="buy_176139861_error"
                                        class="market_multi_warning market_multi_warning_withimg" style="display: none"><img
                                    src="https://community.akamai.steamstatic.com/public/images/economy/market/icon_alertlistings.png"></span>
                                  <span id="buy_176139861_warning" class="market_multi_warning"
                                        style="display: none">⚠️</span>
                                </div>
                              </td>
    `;
  }
}


export default LevelUpBlock;