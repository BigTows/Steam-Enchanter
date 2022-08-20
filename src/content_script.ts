import "reflect-metadata";
import LevelUpBlock from "./steam/teamplates/LevelUpBlock";
import LevelUpService from "./service/LevelUpService";
import HtmlUtils from "./steam/utils/HtmlUtils";

const steamId: string = JSON.parse((HtmlUtils.getElementBySelector(document.body, "#webui_config")).getAttribute("data-userinfo") as string).steamid;
const levelUpBlock = new LevelUpBlock(steamId);


if (HtmlUtils.getElementBySelector(document.body, "#responsive_page_template_content > script").innerHTML.includes(`"steamid":"${steamId}"`)) {
  const personalLevelBlock = HtmlUtils.getElementBySelector(document.body, "div.profile_header_actions");

  const levelUpService = new LevelUpService(levelUpBlock, steamId);

  const profileArea = HtmlUtils.getElementBySelector(document.body, "div.profile_customization_area");
  profileArea.prepend(levelUpBlock.getBlock());

  const button = document.createElement("a");

  button.className = "btn_profile_action btn_medium";
  button.innerHTML = "<span>Level up</span>";
  button.href = "#";

  button.onclick = function() {
    levelUpBlock.show();
    levelUpService.loadUncompletedBadges();

  };
  personalLevelBlock.append(button);
}