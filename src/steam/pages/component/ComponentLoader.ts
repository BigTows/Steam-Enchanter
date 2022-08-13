import SteamElement from "./SteamElement";

class ComponentLoader {
  private readonly className: SteamElement;

  constructor(className: SteamElement) {
    this.className = className;

  }

  load(root: HTMLElement): SteamElement {
    // @ts-ignore
    return new this.className(root);
  }
}

export default ComponentLoader;