import SteamPageLoader from "./steam/pages/SteamPageLoader";

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.color) {
    console.log("Receive color = " + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse("Change color to " + msg.color);
  } else {
    sendResponse("Color message is none.");
  }
});


const steamId: string = "76561198802139714";

const cardsId: number = 286160; //Card id?
//const cardsId: number = 48000; //Card id?


const owner = 3;
const badgeLvl = 1;

//*[@id="responsive_page_template_content"]/div[1]/div[1]/div/div/div/div[3]/div[1]/a/div/div


//https://steamcommunity.com/profiles/76561198802139714/gamecards/567060

SteamPageLoader.loadGameCard(steamId, cardsId).then((page) => {

  console.log(page.getGameCards());


  page.getCardMarketPage().then(page => {
    console.log(page.getCards());
  });
});


//SteamPageLoader.loadCardMarketPage("https://steamcommunity.com/market/multibuy?appid=753&items[]=567060-Aborigen&qty[]=1&items[]=567060-Nazi%20Brute&qty[]=1&items[]=567060-Nazi%20jumper&qty[]=1&items[]=567060-Nazi%20officer&qty[]=1&items[]=567060-Aborigen%20shaman&qty[]=1");

//https://steamcommunity.com/market/multibuy?appid=753&items[]=567060-Aborigen&qty[]=1&items[]=567060-Nazi%20Brute&qty[]=1&items[]=567060-Nazi%20jumper&qty[]=1&items[]=567060-Nazi%20officer&qty[]=1&items[]=567060-Aborigen%20shaman&qty[]=1

//console.log(global.g_steamID as string)

