import ResourceHelper from "../resources/ResourceHelper";
import GameCardsPage from "../../steam/pages/GameCardsPage";

test('Get game cards',()=>{
  const domPage = ResourceHelper.loadHtml('steamGameCardsPageWithTradingCards').body as HTMLElement
  const gameCardsPage = new GameCardsPage(domPage, 530860)


  const cards = gameCardsPage.getGameCards();
  expect(cards).toHaveLength(6)

  let card = cards[0];
  expect(card.name).toBe('Desert')
  expect(card.hashName).toBe('530860-Desert (Trading Card)')
  expect(card.count).toBe(0)

  card = cards[1];
  expect(card.name).toBe('Horizon')
  expect(card.hashName).toBe('530860-Horizon')
  expect(card.count).toBe(1)

  card = cards[2];
  expect(card.name).toBe('Melted')
  expect(card.hashName).toBe('530860-Melted')
  expect(card.count).toBe(2)


  card = cards[3];
  expect(card.name).toBe('Cliff')
  expect(card.hashName).toBe('530860-Cliff')
  expect(card.count).toBe(3)

  card = cards[4];
  expect(card.name).toBe('Crossroads')
  expect(card.hashName).toBe('530860-Crossroads (Trading Card)')
  expect(card.count).toBe(4)


  card = cards[5];
  expect(card.name).toBe('Trader')
  expect(card.hashName).toBe('530860-Trader (Trading Card)')
  expect(card.count).toBe(5)


  expect(gameCardsPage.getLevelBadge()).toBe(0)
})