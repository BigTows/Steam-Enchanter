import ResourceHelper from "../resources/ResourceHelper";
import UserCompletedBadgesPage from "../../steam/pages/UserCompletedBadgesPage";

test("User completed badges with metallic, steam badges and default badges.", () => {
  const dom = ResourceHelper.loadHtml("steamUserCompletedBadgesLastPageWithMetallicAndSteamAwards").body as HTMLElement;

  const page = new UserCompletedBadgesPage(dom, "21313", 4);

  const badges = page.getBadges();

  expect(badges).toHaveLength(72);

  let badge;

  //Shoppe Keep 2
  badge = badges[0];
  expect(badge.appId).toBe(684580);
  expect(badge.level).toBe(2);

  //It's Spring Again
  badge = badges[1];
  expect(badge.appId).toBe(434210);
  expect(badge.level).toBe(4);


  //Nuclear Contingency
  badge = badges[2];
  expect(badge.appId).toBe(540900);
  expect(badge.level).toBe(5);

  //Community Leader
  badge = badges[70];
  expect(badge.appId).toBe(2);
  expect(badge.level).toBe(0);//Because infinity

  //Component skip metallic badge (Counter-Strike: Global Offensive)

  //Spring Cleaning Event 2018
  badge = badges[71];
  expect(badge.appId).toBe(28);
  expect(badge.level).toBe(0);//Because infinity
});