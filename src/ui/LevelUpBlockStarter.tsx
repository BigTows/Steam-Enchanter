import Badges from "./react/component/Badges";
import React from "react";
import { createRoot, Root } from "react-dom/client";

class LevelUpBlockStarter {
  private readonly block: HTMLElement;
  private readonly steamId: string;

  private reactRoot?: Root;

  constructor(steamId: string) {
    this.steamId = steamId;
    this.block = document.createElement("div");
    this.block.setAttribute("data-panel", "{\"type\":\"PanelGroup\"}");
    this.block.className = "profile_customization";
    this.block.style.display = "none";
    this.block.style.width = "100%";

  }

  public getBlock(): HTMLElement {
    return this.block;
  }

  public hide(): void {
    this.block.style.display = "none";
  }

  public show(): void {
    this.block.style.display = "";
    if (this.reactRoot === undefined) {
      this.reactRoot = createRoot(this.block!);
      this.reactRoot.render(<Badges steamId={this.steamId} />);
    }
  }
}


export default LevelUpBlockStarter;