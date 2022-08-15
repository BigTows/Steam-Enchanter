import SteamCardExchangeApi from "./steam/api/SteamCardExchangeApi";
import LevelUpBlock from "./steam/teamplates/LevelUpBlock";
import SteamPageLoader from "./steam/pages/SteamPageLoader";
import UserCompletedBadgesPage from "./steam/pages/UserCompletedBadgesPage";

const elements = document.getElementsByClassName("profile_header_actions");

const levelUpBlock = new LevelUpBlock();
const steamId: string = "76561198802139714"; //TODO CALCULATE!

if (elements.length !== 0) {
  const personalLevelBlock = elements[0] as HTMLElement;

  const profileArea = document.getElementsByClassName("profile_customization_area")[0] as HTMLElement;
  profileArea.prepend(levelUpBlock.getBlock());


  const button = document.createElement("a");

  button.className = "btn_profile_action btn_medium";
  button.innerHTML = "<span>+ Level</span>";
  button.href = "#";

  levelUpBlock.show();
//
//   new SteamCardExchangeApi().getLoad().then(async steamBadges => {
//
//
//     for (let i = 0; i < 8; i++) {
//       const gameCardsPage = await SteamPageLoader.loadGameCard(steamId, steamBadges[i].appId);
//       if (gameCardsPage.getLevelBadge() < 5) {
//         levelUpBlock.addApp(steamBadges[i].appId, steamBadges[i].appName, steamBadges[i].price, () => {
//
// console.log("assa")
//           const details: Array<CardOrderDetails> = gameCardsPage.getGameCards().map(gameCard => {
//             return {
//               hashName: gameCard.hashName,
//               quantity: (5 - gameCardsPage.getLevelBadge() - gameCard.count)
//             };
//           });
//
//           gameCardsPage.getCardMarketPage(details).then(page => {
//
//             new SteamCardTraderService().createTrader(
//               page.getCards()
//             );
//           });
//         });
//       }
//     }
//   });


  button.onclick = function() {
    levelUpBlock.show();

    // new SteamCardExchangeApi().getLoad().then(a => {
    //   a.forEach(steamBadge => {
    //     levelUpBlock.addApp(steamBadge.appId, steamBadge.appName, steamBadge.price);
    //   });
    // });


  };


  personalLevelBlock.append(button);
}


new SteamCardExchangeApi().getLoad().then(a => {
  console.log(a);
});


SteamPageLoader.loadUserCompletedBadges(steamId, 1).then(page => {
  p(page);
});


async function p(page: UserCompletedBadgesPage) {
  console.log(page.getBadges())
  if (page.hasNextPage()) {
    p(await page.nextPage());
  }
}


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