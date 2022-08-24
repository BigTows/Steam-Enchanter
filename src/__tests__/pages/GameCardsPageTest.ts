import ResourceHelper from "../resources/ResourceHelper";
import GameCardsPage from "../../steam/pages/GameCardsPage";

test("Get game cards, when badge is not completed and some cards not exists", () => {
  const domPage = ResourceHelper.loadHtml("steamGameCardsPageWithTradingCards").body as HTMLElement;
  const gameCardsPage = new GameCardsPage(domPage, 530860);


  const cards = gameCardsPage.getGameCards();
  expect(cards).toHaveLength(6);

  let card = cards[0];
  expect(card.name).toBe("Desert");
  expect(card.hashName).toBe("530860-Desert (Trading Card)");
  expect(card.count).toBe(0);

  card = cards[1];
  expect(card.name).toBe("Horizon");
  expect(card.hashName).toBe("530860-Horizon");
  expect(card.count).toBe(1);

  card = cards[2];
  expect(card.name).toBe("Melted");
  expect(card.hashName).toBe("530860-Melted");
  expect(card.count).toBe(2);


  card = cards[3];
  expect(card.name).toBe("Cliff");
  expect(card.hashName).toBe("530860-Cliff");
  expect(card.count).toBe(3);

  card = cards[4];
  expect(card.name).toBe("Crossroads");
  expect(card.hashName).toBe("530860-Crossroads (Trading Card)");
  expect(card.count).toBe(4);


  card = cards[5];
  expect(card.name).toBe("Trader");
  expect(card.hashName).toBe("530860-Trader (Trading Card)");
  expect(card.count).toBe(5);


  expect(gameCardsPage.getLevelBadge()).toBe(0);
});

test("Get game cards, when badge is ready to crafting.", () => {
  const domPage = ResourceHelper.loadHtml("steamGameCardsPageWithCraft").body as HTMLElement;
  const gameCardsPage = new GameCardsPage(domPage, 525300);


  const cards = gameCardsPage.getGameCards();
  expect(cards).toHaveLength(5);

  let card = cards[0];
  expect(card.name).toBe("Harimu");
  expect(card.hashName).toBe("525300-Harimu");
  expect(card.count).toBe(3);

  card = cards[1];
  expect(card.name).toBe("Vumor");
  expect(card.hashName).toBe("525300-Vumor");
  expect(card.count).toBe(3);

  card = cards[2];
  expect(card.name).toBe("Rielareer");
  expect(card.hashName).toBe("525300-Rielareer");
  expect(card.count).toBe(3);


  card = cards[3];
  expect(card.name).toBe("Nybos");
  expect(card.hashName).toBe("525300-Nybos");
  expect(card.count).toBe(3);

  card = cards[4];
  expect(card.name).toBe("Acizel");
  expect(card.hashName).toBe("525300-Acizel");
  expect(card.count).toBe(3);



  expect(gameCardsPage.getLevelBadge()).toBe(2);
  expect(gameCardsPage.getCardMarketPageLink([
    {
      hashName: '18941-!9114h9u1%1951hn 215512njk2 13 (Trading Card)',
      quantity: 1
    },
    {
      hashName: '2414-!9114h9u1%1%%^#$%^&*(@)!(*&^%$ 215512njk2 13 (Trading Card)',
      quantity: 2
    }
  ])).toBe('https://steamcommunity.com/market/multibuy?appid=753&items%5B%5D=18941-%219114h9u1%251951hn+215512njk2+13+%28Trading+Card%29&qty%5B%5D=1&items%5B%5D=2414-%219114h9u1%251%25%25%5E%23%24%25%5E%26*%28%40%29%21%28*%26%5E%25%24+215512njk2+13+%28Trading+Card%29&qty%5B%5D=2')
});