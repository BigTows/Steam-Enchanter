import { template } from "./steam/teamplates/LevelUpBlock";

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.color) {
    console.log("Receive color = " + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse("Change color to " + msg.color);
  } else {
    sendResponse("Color message is none.");
  }
});
const elements = document.getElementsByClassName("profile_header_actions");

if (elements.length !== 0) {
  const personalLevelBlock = elements[0] as HTMLElement;

  const profileArea = document.getElementsByClassName("profile_customization_area")[0] as HTMLElement;
  const levelUpTemplate = template()
  profileArea.prepend(levelUpTemplate);


  const button = document.createElement("a");

  button.className = "btn_profile_action btn_medium";
  button.innerHTML = "<span>+ Level</span>";
  button.href = "#";

  button.onclick = function() {
    console.log(101001);
    levelUpTemplate.style.display = "";
  };


  personalLevelBlock.append(button);
}


const steamId: string = "76561198802139714";

//const cardsId: number = 286160; //Card id?
const cardsId: number = 567060; //Card id?


const owner = 3;
const badgeLvl = 2; //TODO calculate...

//*[@id="responsive_page_template_content"]/div[1]/div[1]/div/div/div/div[3]/div[1]/a/div/div


//https://steamcommunity.com/profiles/76561198802139714/gamecards/567060

// SteamPageLoader.loadGameCard(steamId, cardsId).then((page) => {
//
//   const details: Array<CardOrderDetails> = page.getGameCards().map(gameCard => {
//     return {
//       hashName: gameCard.hashName,
//       quantity: (5 - badgeLvl - gameCard.count)
//     };
//   });
//
//   page.getCardMarketPage(details).then(page => {
//
//     new SteamCardTraderService().createTrader(
//       page.getCards()
//     );
//   });
// });


//SteamPageLoader.loadCardMarketPage("https://steamcommunity.com/market/multibuy?appid=753&items[]=567060-Aborigen&qty[]=1&items[]=567060-Nazi%20Brute&qty[]=1&items[]=567060-Nazi%20jumper&qty[]=1&items[]=567060-Nazi%20officer&qty[]=1&items[]=567060-Aborigen%20shaman&qty[]=1");

//https://steamcommunity.com/market/multibuy?appid=753&items[]=567060-Aborigen&qty[]=1&items[]=567060-Nazi%20Brute&qty[]=1&items[]=567060-Nazi%20jumper&qty[]=1&items[]=567060-Nazi%20officer&qty[]=1&items[]=567060-Aborigen%20shaman&qty[]=1

//console.log(global.g_steamID as string)

