import HtmlUtils from "../../utils/HtmlUtils";

class CardBadge {
  private readonly level: number;


  constructor(badge: HTMLElement) {
    console.log(badge)
    this.level = this.badgeExists(badge) ? this.processBadgeLevel(badge) : 0;
  }


  private badgeExists(badge: HTMLElement): boolean {
    return badge.getElementsByClassName("badge_empty_circle").length === 0;
  }

  private processBadgeLevel(badge: HTMLElement): number {
    const levelOfBadgeElement = HtmlUtils.getElementBySelector(badge, "div.badge_info_description > div:nth-child(2)");

    const levelContext = levelOfBadgeElement.innerText;
    const numArrRaw = levelContext.match(/[\d\.]+/g);
    if (numArrRaw === null || numArrRaw.length < 1) {
      throw new Error("Can't find badge level.");
    }
    const numbers = numArrRaw.filter(n => n !== ".").map(value => parseInt(value));
    const level = numbers[0];//Because it's first

    if (level < 1 || level > 5) {
      throw new Error(`Found incorrect level ${level}`)
    }
    return level;
  }


  public getLevel(): number {
    return this.level;
  }
}

export default CardBadge;