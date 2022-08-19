import HtmlUtils from "../utils/HtmlUtils";
import ComponentLoader from "./component/ComponentLoader";
import SteamElement from "./component/SteamElement";

export interface SteamPageConfiguration {
  /**
   * Name of component
   */
  name: string,
  /**
   * Selector for this component
   */
  selector: string,

  component?: ComponentLoader
}

interface ElementData {
  html: HTMLElement,
  component: SteamElement | undefined
}

abstract class SteamPage {

  private readonly storage: Map<string, ElementData> = new Map<string, ElementData>();


  protected constructor(root: HTMLElement, configurationList: Array<SteamPageConfiguration>) {
    for (const configuration of configurationList) {
      const selectedHtmlElement = HtmlUtils.getElementBySelector(root, configuration.selector);
      this.storage.set(
        configuration.name,
        <ElementData>{
          html: selectedHtmlElement,
          component: configuration.component !== undefined ? configuration.component.load(selectedHtmlElement) : undefined
        }
      );
    }
  }


  protected getHtmlElement(nameElement: string): HTMLElement {
    return this.getElementData(nameElement).html;
  }

  protected getComponentElement<T extends SteamElement>(nameElement: string): T {
    const component = this.getElementData(nameElement).component;
    if (component === undefined) {
      throw new Error(`Element ${nameElement} don't contains any SteamElement`);
    }
    return component as T;
  }


  private getElementData(nameElement: string): ElementData {
    const result = this.storage.get(nameElement);
    if (result === undefined) {
      throw new Error(`Unregistered element ${nameElement}`);
    }
    return result;
  }


}

export default SteamPage;