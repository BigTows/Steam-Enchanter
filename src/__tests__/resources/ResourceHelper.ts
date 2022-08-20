import fs from "fs";
import path from "path";

class ResourceHelper {


  public static loadHtml(resource: string): Document {
    const filePath = path.join(__dirname, "html", `${resource}.html`);

    const content = fs.readFileSync(filePath, { encoding: "utf-8" }).toString();


    const doc = document.implementation.createHTMLDocument();
    doc.open();
    doc.write(content);
    doc.close();
    return doc;
  }
}

export default ResourceHelper;