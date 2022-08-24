import "reflect-metadata";
import LevelUpBlockStarter from "./ui/LevelUpBlockStarter";
import HtmlUtils from "./steam/utils/HtmlUtils";

const steamId: string = JSON.parse((HtmlUtils.getElementBySelector(document.body, "#webui_config")).getAttribute("data-userinfo") as string).steamid;
const levelUpBlock = new LevelUpBlockStarter(steamId);


if (HtmlUtils.getElementBySelector(document.body, "#responsive_page_template_content > script").innerHTML.includes(`"steamid":"${steamId}"`)) {
  const personalLevelBlock = HtmlUtils.getElementBySelector(document.body, "div.profile_header_actions");

  const profileArea = HtmlUtils.getElementBySelector(document.body, "div.profile_customization_area");
  profileArea.prepend(levelUpBlock.getBlock());

  const button = document.createElement("a");

  button.className = "btn_profile_action btn_medium";
  button.innerHTML = "<span>Level up</span>";
  button.href = "#";

  button.onclick = function() {
    levelUpBlock.show();
  };
  personalLevelBlock.append(button);
}