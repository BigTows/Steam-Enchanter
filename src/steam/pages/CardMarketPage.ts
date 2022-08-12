import SteamPage, {SteamPageConfiguration} from "./SteamPage";
import SteamPageLoader from "./SteamPageLoader";

class CardMarketPage extends SteamPage {

    private static readonly configuration:Array<SteamPageConfiguration> = [
        {
            name:"test",
            selector: "#BG_bottom > table",
            component: undefined
        }
    ]


    constructor(root: HTMLElement) {
        console.log(root)
        super(root, []);
    }

}

export default CardMarketPage