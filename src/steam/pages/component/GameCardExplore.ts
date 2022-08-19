import SteamElement from "./SteamElement";

export interface GameCard {
  name: string,
  count: number
}

class GameCardExplore implements SteamElement {

  private readonly gameCards: Array<GameCard> = [];

  constructor(cardPanel: HTMLElement) {

    for (const ownedCard of cardPanel.getElementsByClassName("badge_card_set_card owned")) {
      const elements = ownedCard.getElementsByClassName("badge_card_set_text badge_card_set_title ellipsis");
      if (elements.length === 0) {
        throw new Error("Can't find count of current owned cards");
      }

      this.gameCards.push(this.getOwnedCardData(elements[0] as HTMLElement))
    }

    for (const ownedCard of cardPanel.getElementsByClassName("badge_card_set_card unowned")) {
      const elements = ownedCard.getElementsByClassName("badge_card_set_text badge_card_set_title ellipsis");
      if (elements.length === 0) {
        throw new Error("Can't find count of current owned cards");
      }

      this.gameCards.push(this.getUnownedCardData(elements[0] as HTMLElement))
    }
  }


  private getOwnedCardData(footerCard: HTMLElement): GameCard {
    const data = footerCard.innerText.trim().split("\n");
    if (data.length !== 2) {
      throw new Error("Can't find meta data.");
    }

    return {
      name: data[1].trim(),
      count: parseInt(data[0].trim().replace(/[)(]/g, ""))
    };
  }

  private getUnownedCardData(footerCard: HTMLElement): GameCard{
    return {
      name: footerCard.innerText.trim(),
      count: 0
    };
  }

  public getGameCards(): Array<GameCard> {
    return this.gameCards;
  }
}

export default GameCardExplore;