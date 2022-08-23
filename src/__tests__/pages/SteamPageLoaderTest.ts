import "reflect-metadata";
import HttpClient from "../../component/http/HttpClient";
import { mock } from "jest-mock-extended";
import SteamPageLoader from "../../steam/pages/SteamPageLoader";
import GameCardsPage from "../../steam/pages/GameCardsPage";


test("Load game card", () => {
  const httpClientMock = mock<HttpClient>();
  const host = "http://localhost";

  const steamPageLoader = new SteamPageLoader(host, httpClientMock);
  const steamId = "12414124";
  const appId = 1244;

  const mockedPage = mock<GameCardsPage>();

  console.log(`${host}/profiles/${steamId}/gamecards/${appId}`)
  httpClientMock.get<GameCardsPage>
    .mockReturnValue(new Promise(resolve => resolve(mockedPage)));

  const result = steamPageLoader.loadGameCard(steamId, appId);

  expect(result).toBe(mockedPage);

});