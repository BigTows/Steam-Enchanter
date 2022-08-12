import HtmlUtils from "../utils/HtmlUtils";

export interface SteamPageConfiguration {
    /**
     * Name of component
     */
    name: string,
    /**
     * Selector for this component
     */
    selector: string,

    component: string | undefined
}

abstract class SteamPage {

    private readonly storage: Map<string, HTMLElement> = new Map<string, HTMLElement>()


    protected constructor(root: HTMLElement, configurationList: Array<SteamPageConfiguration>) {
        for (const configuration of configurationList) {
            this.storage.set(
                configuration.name,
                HtmlUtils.getElementBySelector(root, configuration.selector)
            )
        }
    }


    protected getHtmlElement(nameElement: string): HTMLElement {
        const result = this.storage.get(nameElement);
        if (result === undefined) {
            throw new Error("Unregistered element")
        }
        return result
    }


}

export default SteamPage