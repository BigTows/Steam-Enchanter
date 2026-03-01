import React from "react";
import LevelUpService from "../../../service/LevelUpService";
import { SteamBadgePrice } from "../../../steam/api/SteamCardExchangeApi";
import Badge from "./Badge";
import Loading from "./ui/Loading";
import Pagination from "./ui/Pagination";
import { injector } from "../../../configuration/Injector";

interface BadgesProperties {
  steamId: string;
}

interface BadgesState {
  badges?: Array<SteamBadgePrice>,
  currentPage: number,
  overpricePercent: number
}

export default class Badges extends React.Component<BadgesProperties, BadgesState> {
  private static readonly ITEMS_PER_PAGE = 50;
  private readonly levelUpService: LevelUpService;

  constructor(props: BadgesProperties) {
    super(props);
    this.state = { currentPage: 1, overpricePercent: 10 };
    this.levelUpService = injector.resolve(LevelUpService);
    this.onPageChanged = this.onPageChanged.bind(this);
    this.onOverpriceChanged = this.onOverpriceChanged.bind(this);
  }

  componentDidMount() {
    this.levelUpService.getUncompletedBadges(this.props.steamId).then(result => {
      console.log("Finished!", result);
      this.setState({ badges: result });
    });
  }

  onPageChanged(newPage: number) {
    this.setState({ currentPage: newPage });
  }

  onOverpriceChanged(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      this.setState({ overpricePercent: value });
    }
  }

  render() {
    const pagination = this.state.badges !== undefined ?
      <Pagination items={this.state.badges.length} itemsPerPage={Badges.ITEMS_PER_PAGE}
                  currentPage={this.state.currentPage} callback={this.onPageChanged} /> : <></>;

    return (
      <div>
        <div className={"profile_customization_header ellipsis"} style={{ display: "flex", alignItems: "center" }}>
          <span>Uncompleted badges</span>
          <span className={`profile_paging`} style={{ background: "none" }}>(Price stats provided by <a
            href="https://www.steamcardexchange.net/" target="_blank">SteamCardExchange</a>)</span>
          <span style={{ marginLeft: "auto", fontSize: "13px", color: "#BFBFBF", whiteSpace: "nowrap" }}
                title="Maximum percentage above the current lowest price you're willing to pay. Higher values increase the chance of fulfilling the order, but cost more.">
            Overprice: <input type="number" value={this.state.overpricePercent}
                              onChange={this.onOverpriceChanged}
                              min={0}
                              style={{
                                backgroundColor: "rgba(0,0,0,0.2)",
                                border: "1px solid #000",
                                boxShadow: "1px 1px 0 0 rgba(91,132,181,0.2)",
                                color: "#BFBFBF",
                                fontSize: "13px",
                                width: "50px",
                                textAlign: "center"
                              }} />%
          </span>
        </div>
        <div className={"profile_customization_block"}>
          <div className="customtext_showcase">
            {pagination}
            <div className="showcase_content_bg showcase_notes">
              <div className="market_multibuy">
                <table style={{ width: "100%" }}>
                  <colgroup>
                    <col style={{ width: "60%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "30%" }} />
                  </colgroup>
                  <thead>
                  <tr>
                    <td style={{ borderRight: "1px solid #404040" }}>ITEM NAME</td>
                    <td colSpan={2}>PRICE</td>
                  </tr>
                  </thead>
                  <tbody className="${LevelUpBlock.ID_PREFIX}GamesContainer">
                  {this.getContent()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getContent() {
    const { badges, currentPage } = this.state;
    if (badges === undefined) {
      return (
        <tr>
          <td colSpan={4}>
            <Loading />
          </td>
        </tr>
      );
    } else {
      return this.getBadges([...badges], currentPage);
    }
  }

  private getBadges(badges: Array<SteamBadgePrice>, page: number) {

    return badges
      .splice((page - 1) * Badges.ITEMS_PER_PAGE, Badges.ITEMS_PER_PAGE)
      .map(steamBadgePrice => {
        return (
          <Badge steamId={this.props.steamId} appId={steamBadgePrice.appId} appName={steamBadgePrice.appName}
                 overpricePercent={this.state.overpricePercent}
                 key={`${steamBadgePrice.appId}-${steamBadgePrice.appName}`} />
        );
      });
  }
}