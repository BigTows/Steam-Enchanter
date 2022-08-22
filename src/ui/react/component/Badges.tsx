import React from "react";
import LevelUpService from "../../../service/LevelUpService";
import { SteamBadgePrice } from "../../../steam/api/SteamCardExchangeApi";
import Badge from "./Badge";
import Loading from "./ui/Loading";
import Pagination from "./ui/Pagination";

interface BadgesProperties {
  steamId: string;
}

interface BadgesState {
  badges?: Array<SteamBadgePrice>,
  currentPage: number
}

export default class Badges extends React.Component<BadgesProperties, BadgesState> {
  private static readonly ITEMS_PER_PAGE = 50;
  private readonly levelUpService: LevelUpService;

  constructor(props: BadgesProperties) {
    super(props);
    this.state = { currentPage: 1 };
    this.levelUpService = new LevelUpService();
    this.onPageChanged = this.onPageChanged.bind(this);
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

  render() {
    const pagination = this.state.badges !== undefined ?
      <Pagination items={this.state.badges.length} itemsPerPage={Badges.ITEMS_PER_PAGE}
                  currentPage={this.state.currentPage} callback={this.onPageChanged} /> : <></>;

    return (
      <div>
        <div className={"profile_customization_header ellipsis"}>Level up (beta#mvp)</div>
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
                 key={`${steamBadgePrice.appId}-${steamBadgePrice.appName}`} />
        );
      });
  }
}