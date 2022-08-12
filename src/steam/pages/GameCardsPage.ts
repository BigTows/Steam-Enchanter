/**
 * This is OOP retrospective of page Steam `Steam Community :: Steam Badges :: <APP_NAME>
 */

import SteamPage, {SteamPageConfiguration} from "./SteamPage";
import SteamPageLoader from "./SteamPageLoader";
import CardMarketPage from "./CardMarketPage";

enum Elements {
    /**
     * Button of "Buy remaining cards on the Market"
     */
    remainingCards = "remainingCards"
}


class GameCardsPage extends SteamPage {


    private static readonly configuration: Array<SteamPageConfiguration> = [
        {
            name: Elements.remainingCards,
            selector: "#responsive_page_template_content > div.pagecontent > div.maincontent > div.badge_row.depressed.badge_gamecard_page > div > div.badge_cards_to_collect > div.gamecards_inventorylink > a",
            component: undefined
        }
    ]

    constructor(root: HTMLElement) {
        super(root, GameCardsPage.configuration)
    }

    public async getCardMarketPage(): Promise<CardMarketPage> {

        const url = new URL(this.getHtmlElement(Elements.remainingCards).getAttribute('href') as string);
        url.host = 'steamcommunity.com'
        return await SteamPageLoader.loadCardMarketPage(url.toString())
    }

}

export default GameCardsPage