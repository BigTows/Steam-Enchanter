import React from "react";
import LevelUpService from "../../service/LevelUpService";
import { SteamBadgePrice } from "../../steam/api/SteamCardExchangeApi";
import Badge from "./Badge";
import Loading from "./ui/Loading";

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
    console.log(props);
    this.state = { currentPage: 0 };

    // @ts-ignore
    this.levelUpService = new LevelUpService(null, this.props.steamId);
  }

  componentDidMount() {
    this.levelUpService.getUncompletedBadges().then(result => {
      console.log("Finished!");
      this.setState({ badges: result });
    });
  }

  render() {
    return (
      <div>
        <div className={"profile_customization_header ellipsis"}>Level up (beta#mvp)</div>
        <div className={"profile_customization_block"}>
          <div className="customtext_showcase">
            <div className="showcase_content_bg showcase_notes">
              <div id="BG_bottom" className="market_multibuy">
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
        <tr><td colSpan={4}>
          <Loading/>
        </td></tr>
      );
    } else {
      return this.getBadges([...badges], currentPage);
    }
  }

  private getBadges(badges: Array<SteamBadgePrice>, page: number) {

    return badges
      .splice(page * Badges.ITEMS_PER_PAGE, Badges.ITEMS_PER_PAGE)
      .map(steamBadgePrice => {
        return (
          <Badge steamId={this.props.steamId} appId={steamBadgePrice.appId} appName={steamBadgePrice.appName}
                 key={`${steamBadgePrice.appId}-${steamBadgePrice.appName}`} />
        );
      });
  }
}