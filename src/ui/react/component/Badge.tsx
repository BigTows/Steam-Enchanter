import React from "react";
import currency from "currency.js";
import Loading from "./ui/Loading";
import LevelUpService from "../../../service/LevelUpService";
import SteamCurrency from "../../../steam/utils/SteamCurrency";
import { injector } from "../../../configuration/Injector";
import SteamCardTraderService from "../../../service/SteamCardTraderService";
import { CardMarketPosition } from "../../../steam/pages/component/CardBuyerTable";
import { Status } from "../../../service/SteamCardTraderProcess";
import NeedConfirmationStreamApiException from "../../../api/steam/exception/NeedConfirmationStreamApiException";

interface BadgeProperties {
  steamId: string,
  appId: number,
  appName: string,
  overpricePercent: number
}

enum BadgeStatus {
  Waiting,
  Processing,
  PriceLoaded,
  NeedConfirmation = 4,
  Completed,
  Error
}

interface BadgeState {
  status: BadgeStatus;
  orderDetails?: Array<CardMarketPosition>;
  price?: SteamCurrency;
}

export default class Badge extends React.Component<BadgeProperties, BadgeState> {
  private readonly levelUpService: LevelUpService;


  constructor(props: BadgeProperties) {
    super(props);
    this.state = { status: BadgeStatus.Waiting };

    this.calculateApp = this.calculateApp.bind(this);
    this.order = this.order.bind(this);

    // @ts-ignore
    this.levelUpService = injector.resolve(LevelUpService);
  }

  render() {
    return (
      <tr>
        <td>
          <div style={{ display: "table" }}>
            <img src={`https://cdn.akamai.steamstatic.com/steam/apps/${this.props.appId}/capsule_sm_120.jpg`}
                 className={"market_listing_item_img economy_item_hoverable"} alt="" />
            <span className={"market_multi_itemname economy_item_hoverable"}
                  style={{ float: "right", display: "table" }}>
            <a className={"market_listing_item_name_link"} target="_blank"
               href={`https://steamcommunity.com/profiles/${this.props.steamId}/gamecards/${this.props.appId}`}>
              <p style={{
                maxWidth: "24ch",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap"
              }}>{this.props.appName}</p>
            </a>
          </span>
          </div>
        </td>
        <td>
          <span className="market_dialog_input market_multi_price">
            <span id="market_multibuy_order_total">
              <span className="${LevelUpBlock.ID_PREFIX}${appId}price">{this.calculateBadgePrice()}</span>
              <span className="market_whatsthis" title="This is the most you can end up spending as a result of this buy order.
Items will be purchased at the cheapest price available, so the order may end up costing less than this amount.">(?)</span>
              </span>
          </span>
        </td>
        <td>
          <div className={"market_multi_status"}>
            {this.renderBadgeStatus()}
          </div>
        </td>
      </tr>
    );
  }


  private renderBadgeStatus() {
    const { status: badgeStatus } = this.state;
    switch (badgeStatus) {
      case BadgeStatus.Waiting:
        return (
          <a onClick={this.calculateApp}
             className={"btn_green_white_innerfade btn_medium_wide btn_uppercase market_unstyled_button"}>
            <span>Calculate</span>
          </a>
        );
      case BadgeStatus.Processing:
        return (
          <Loading />
        );
      case BadgeStatus.PriceLoaded:
        return (
          <a onClick={this.order} data-tooltip-html="You should confirm the order in Steam App."
             className="btn_green_white_innerfade btn_medium_wide btn_uppercase market_unstyled_button"><span>PLACE ORDER</span></a>
        );
      case BadgeStatus.Completed:
        return (
          <span className={"market_multi_warning"}>✔️</span>
        );
      case BadgeStatus.NeedConfirmation:
          return (
              <a onClick={this.order}
                 className="btn_profile_action btn_medium">
                  <span>Check Steam App, try again</span>
              </a>
          );
      case BadgeStatus.Error:
        return (
          <span className="market_multi_warning market_multi_warning_withimg">
            <img src="https://community.akamai.steamstatic.com/public/images/economy/market/icon_alertlistings.png"
                 alt={"Error"} />
          </span>
        );
    }
  }


  private calculateBadgePrice(): string {
    const { price, orderDetails } = this.state;

    if (price === undefined || orderDetails === undefined) {
      return "XXX";
    }

    const totalCents = orderDetails.reduce((sum, position) => {
      return sum + Math.ceil(position.price * (1 + this.props.overpricePercent / 100)) * position.quantity;
    }, 0);

    return currency(totalCents, { fromCents: true, symbol: SteamCurrency.getCurrencySymbolByWalletCurrencyNumber(price.getId()) }).format();
  }

  private calculateApp() {
    this.setState({ status: BadgeStatus.Processing });

    this.levelUpService.calculateOrderForBadge(
      this.props.steamId,
      this.props.appId,
      5
    ).then(order => {
      this.setState({ price: order.currency, status: BadgeStatus.PriceLoaded, orderDetails: order.orderDetails });
    }).catch(err => {
      console.error(err);
      this.setState({ status: BadgeStatus.Error });
    });
  }

  private order() {
    this.setState({ status: BadgeStatus.Processing });

    const { orderDetails, price } = this.state;

    if (orderDetails === undefined || price === undefined) {
      this.setState({ status: BadgeStatus.Error });
      console.error("Invalidate order state?");
      return;
    }

    injector.resolve(SteamCardTraderService).createTrader(
      orderDetails,
      price.getId(),
      this.props.overpricePercent
    ).then(a => {
      //TODO promise?
      const interval = setInterval(() => {
        if (a.getCurrentStatus() === Status.finished) {
          clearInterval(interval);
          this.setState({ status: BadgeStatus.Completed });
        } else if (a.getCurrentStatus() === Status.error) {
          clearInterval(interval);
          this.setState({ status: BadgeStatus.Error });
        }
      }, 1000);
    }).catch(error => {
        if (error instanceof NeedConfirmationStreamApiException){
            this.setState({ status: BadgeStatus.NeedConfirmation });
        }else {
            console.error(error);
            this.setState({status: BadgeStatus.Error});
        }
    });

  }
}