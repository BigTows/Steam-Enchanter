import CardMarketPage from "../../steam/pages/CardMarketPage";
import ResourceHelper from "../resources/ResourceHelper";

test("CardMarketPage", () => {

  const body = ResourceHelper.loadHtml("steamCardMarketPage").body as HTMLElement;

  const page = new CardMarketPage(body);

  expect(page.getCurrency().id).toBe(5);
  expect(page.getCurrency().symbol).toBe("₽");

  expect(page.getCards()).toHaveLength(5);

  let card = page.getCards()[0];
  expect(card.appId).toBe(753);
  expect(card.quantity).toBe(3);
  expect(card.price).toBe(135);
  expect(card.hashName).toBe("525300-Harimu");

  card = page.getCards()[1];
  expect(card.appId).toBe(753);
  expect(card.quantity).toBe(4);
  expect(card.price).toBe(304);
  expect(card.hashName).toBe("525300-Vumor");

  card = page.getCards()[2];
  expect(card.appId).toBe(753);
  expect(card.quantity).toBe(2);
  expect(card.price).toBe(142);
  expect(card.hashName).toBe("525300-Rielareer");

  card = page.getCards()[3];
  expect(card.appId).toBe(753);
  expect(card.quantity).toBe(1);
  expect(card.price).toBe(123);
  expect(card.hashName).toBe("525300-Nybos");

  card = page.getCards()[4];
  expect(card.appId).toBe(753);
  expect(card.quantity).toBe(20);
  expect(card.price).toBe(129);
  expect(card.hashName).toBe("525300-Acizel");
});