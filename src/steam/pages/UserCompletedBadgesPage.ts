import SteamPage, { SteamPageConfiguration } from "./SteamPage";
import SteamPageLoader from "./SteamPageLoader";
import Badges, { BadgeData } from "./component/Badges";
import ComponentLoader from "./component/ComponentLoader";


enum Elements {
  badges = "badges"
}


class UserCompletedBadgesPage extends SteamPage {

  private static readonly configuration: Array<SteamPageConfiguration> = [
    {
      name: Elements.badges,
      selector: "div.badges_sheet",
      component: new ComponentLoader(Badges)
    }
  ];

  private readonly steamId: string;

  private readonly currentPage: number;
  private readonly lastPage: number;

  constructor(root: HTMLElement, steamId: string, currentPage: number) {
    super(root, UserCompletedBadgesPage.configuration);
    this.steamId = steamId;
    this.currentPage = currentPage;
    this.lastPage = this.findLastPage(root) ?? this.currentPage;
  }

  private findLastPage(root: HTMLElement): number | undefined {
    const element = root.querySelector("div.pageLinks > a:nth-last-child(2)");
    return element === null ? undefined : parseInt((element as HTMLElement).innerText);
  }


  public getLastPage(): number {
    return this.lastPage;
  }

  public nextPage(): Promise<UserCompletedBadgesPage> {
    if (!this.hasNextPage()) {
      throw new Error("No more pages.");
    }
    //TODO SteamPageLoader to another place
    return SteamPageLoader.loadUserCompletedBadges(this.steamId, this.currentPage + 1);
  }

  public hasNextPage(): boolean {
    return this.currentPage < this.getLastPage();
  }

  public getBadges(): Array<BadgeData> {
    return this.getComponentElement<Badges>(Elements.badges).getBadges();
  }


}

export default UserCompletedBadgesPage;