import "reflect-metadata";
import SteamMarketApi from "../../api/steam/SteamMarketApi";
import { mock } from "jest-mock-extended";
import SteamCardTraderService from "../../service/SteamCardTraderService";
import Cookies from "js-cookie";
import { Status } from "../../service/SteamCardTraderProcess";

test("Create trader process.", async () => {

  const steamApiMock = mock<SteamMarketApi>();
  const sessionId = "12414";
  Cookies.set("sessionid", sessionId);

  const service = new SteamCardTraderService(steamApiMock);


  steamApiMock.createOrder.calledWith(
    {
      sessionId: sessionId,
      currency: 5,
      appId: 10,
      marketHashName: "112",
      priceTotal: (91 + 200) * 2,
      quantity: 2
    }).mockReturnValue(new Promise(resolve => resolve("order-1")));

  const process = await service.createTrader([
    {
      appId: 10,
      hashName: "112",
      quantity: 2,
      price: 91
    }
  ], 5);

  expect(process.getCurrentStatus()).toBe(Status.pending);
});

test("When session id is not initialized", async () => {
  const steamApiMock = mock<SteamMarketApi>();

  const service = new SteamCardTraderService(steamApiMock);

  await expect(async () => {
    await service.createTrader([
      {
        appId: 10,
        hashName: "112",
        quantity: 2,
        price: 91
      }
    ], 5);
  }).rejects.toThrowError("Session id is not initialized");
});