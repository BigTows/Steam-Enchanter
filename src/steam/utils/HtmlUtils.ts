class HtmlUtils {
    public static getElementBySelector(html: HTMLElement, selector: string): HTMLElement {
        const result = html.querySelector(selector);
        if (result === null) {
            throw new Error(`Can't find element by selector ${selector}`)
        }
        return result as HTMLElement;
    }
}

export default HtmlUtils