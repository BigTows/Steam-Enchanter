import "reflect-metadata";
import { anyObject, mock } from "jest-mock-extended";
import HttpClient from "../../component/http/HttpClient";
import GameCardsPage from "../../steam/pages/GameCardsPage";
import SteamPageLoader from "../../steam/pages/SteamPageLoader";
import CardMarketPage from "../../steam/pages/CardMarketPage";
import UserCompletedBadgesPage from "../../steam/pages/UserCompletedBadgesPage";

const host = "http://localhost";

test("Load game card", async () => {
  const httpClientMock = mock<HttpClient>();

  const steamPageLoader = new SteamPageLoader(host, httpClientMock);
  const steamId = "12414124";
  const appId = 1244;

  const mockedPage = mock<GameCardsPage>();

  httpClientMock.get<GameCardsPage>
    .calledWith(`${host}/profiles/${steamId}/gamecards/${appId}`, anyObject())
    .mockReturnValue(new Promise(resolve => {
      resolve(mockedPage)
    }));

  const result = await steamPageLoader.loadGameCard(steamId, appId);
  expect(result).toBe(mockedPage);
});

test("Load card market page", async ()=>{
  const httpClientMock = mock<HttpClient>();

  const steamPageLoader = new SteamPageLoader(host, httpClientMock);

  const link = 'ajkfklajkaakfjalf';

  const mockedPage = mock<CardMarketPage>();

  httpClientMock.get<CardMarketPage>
    .calledWith(link, anyObject())
    .mockReturnValue(new Promise(resolve => {
      resolve(mockedPage)
    }));

  const result = await steamPageLoader.loadCardMarketPage(link);
  expect(result).toBe(mockedPage);
})


test("Load user compled badges", async ()=>{
  const httpClientMock = mock<HttpClient>();

  const steamPageLoader = new SteamPageLoader(host, httpClientMock);
  const steamId = "12414124";
  const page = 1244;

  const mockedPage = mock<UserCompletedBadgesPage>();

  httpClientMock.get<UserCompletedBadgesPage>
    .calledWith(`${host}/profiles/${steamId}/badges/?sort=c&p=${page}`, anyObject())
    .mockReturnValue(new Promise(resolve => {
      resolve(mockedPage)
    }));

  const result = await steamPageLoader.loadUserCompletedBadges(steamId, page);
  expect(result).toBe(mockedPage);
})