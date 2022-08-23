import "reflect-metadata";
import SteamCardExchangeApi from "../../steam/api/SteamCardExchangeApi";
import { mock } from "jest-mock-extended";
import SteamPageLoader from "../../steam/pages/SteamPageLoader";
import LevelUpService from "../../service/LevelUpService";
import UserCompletedBadgesPage from "../../steam/pages/UserCompletedBadgesPage";

test("Try get uncompleted Badges", async () => {
  const steamPageLoaderMock = mock<SteamPageLoader>();
  const steamCardExchangerMock = mock<SteamCardExchangeApi>();
  const steamId = "12414";

  steamCardExchangerMock.getLoad.mockReturnValue(new Promise(resolve => {
    resolve(
      [
        {
          appId: 99,
          appName: "Test",
          price: 12
        },
        {
          appId: 100,
          appName: "Test",
          price: 12
        },
        {
          appId: 101,
          appName: "UncompletedBadges",
          price: 123
        },
        {
          appId: 102,
          appName: "UncompletedBadges#2",
          price: 144
        }
      ]
    );
  }));

  steamPageLoaderMock.loadUserCompletedBadges.calledWith(steamId, 1).mockReturnValue(new Promise(resolve => {
    const mockPage = mock<UserCompletedBadgesPage>();
    mockPage.hasNextPage.mockReturnValue(true);
    mockPage.getCurrentPage.mockReturnValue(1)
    mockPage.getBadges.mockReturnValue([
      {
        appId: 100,
        level: 5
      },
      {
        appId: 101,
        level: 3
      }
    ]);
    resolve(mockPage);
  }));

  steamPageLoaderMock.loadUserCompletedBadges.calledWith(steamId, 2).mockReturnValue(new Promise(resolve => {
    const mockPage = mock<UserCompletedBadgesPage>();
    mockPage.hasNextPage.mockReturnValue(false);
    mockPage.getBadges.mockReturnValue([
      {
        appId: 99,
        level: 5
      },
      {
        appId: 102,
        level: 1
      }
    ]);
    resolve(mockPage);
  }));


  const levelUpService = new LevelUpService(steamPageLoaderMock, steamCardExchangerMock);

  const result = await levelUpService.getUncompletedBadges(steamId);

  expect(result).toHaveLength(2)

  let badge = result[0];
  expect(badge.appId).toBe(101)
  expect(badge.appName).toBe("UncompletedBadges")
  expect(badge.price).toBe(123)

  badge = result[1];
  expect(badge.appId).toBe(102)
  expect(badge.appName).toBe("UncompletedBadges#2")
  expect(badge.price).toBe(144)
});

test('Calculate order for Badge',()=>{

})