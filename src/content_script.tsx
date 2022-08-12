import SteamPageLoader from "./steam/pages/SteamPageLoader";
import GameCardsPage from "./steam/pages/GameCardsPage";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.color) {
        console.log("Receive color = " + msg.color);
        document.body.style.backgroundColor = msg.color;
        sendResponse("Change color to " + msg.color);
    } else {
        sendResponse("Color message is none.");
    }
});


const steamId: string = "76561198802139714"

const appId: number = 567060

//*[@id="responsive_page_template_content"]/div[1]/div[1]/div/div/div/div[3]/div[1]/a/div/div


//https://steamcommunity.com/profiles/76561198802139714/gamecards/567060

// SteamPageLoader.loadGameCard(steamId, appId).then((page)=>{
//     page.getCardMarketPage()
// })


SteamPageLoader.loadCardMarketPage('https://steamcommunity.com/market/multibuy?appid=753&items[]=567060-Aborigen&qty[]=1&items[]=567060-Nazi%20Brute&qty[]=1&items[]=567060-Nazi%20jumper&qty[]=1&items[]=567060-Nazi%20officer&qty[]=1&items[]=567060-Aborigen%20shaman&qty[]=1')

//https://steamcommunity.com/market/multibuy?appid=753&items[]=567060-Aborigen&qty[]=1&items[]=567060-Nazi%20Brute&qty[]=1&items[]=567060-Nazi%20jumper&qty[]=1&items[]=567060-Nazi%20officer&qty[]=1&items[]=567060-Aborigen%20shaman&qty[]=1

//console.log(global.g_steamID as string)

