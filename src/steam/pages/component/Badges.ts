import SteamElement from "./SteamElement";
import HtmlUtils from "../../utils/HtmlUtils";
import CardBadge from "./CardBadge";

export interface BadgeData {
  appId: number,
  level: number
}

class Badges implements SteamElement {

  private readonly badges: Array<BadgeData> = [];

  constructor(badgesSheet: HTMLElement) {
    console.log(badgesSheet);
    for (let badgeRow of badgesSheet.querySelectorAll("div.badge_row") as NodeListOf<HTMLElement>) {
      const linkElement = HtmlUtils.getElementBySelector(badgeRow, "a") as HTMLLinkElement;
      const badgeElement = HtmlUtils.getElementBySelector(badgeRow, "div.badge_content > div.badge_current > div");
      this.badges.push(
        {
          appId: this.getAppIdFromLink(linkElement),
          level: new CardBadge(badgeElement).getLevel()
        }
      );
    }

  }


  private getAppIdFromLink(linkElement: HTMLLinkElement): number {
    let path = new URL(linkElement.href).pathname;

    if (path[path.length - 1] === "/") {
      path = path.slice(0, -1);
    }

    return parseInt(path.substring(path.lastIndexOf("/") + 1));
  }

  public getBadges(): Array<BadgeData> {
    return this.badges;
  }
}

export default Badges;