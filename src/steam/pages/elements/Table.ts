export interface RowConfiguration {
  /**
   * Name of element
   */
  name: string,

  executor: (cel: HTMLElement) => string
}

class Table {

  private storage: Map<string, Array<String>> = new Map();

  constructor(table: HTMLTableElement, configurationList: Array<RowConfiguration | undefined>) {

    //TODO a little hack
    const body = table.tBodies[0];

    for (let rowIndex = 0; rowIndex < body.rows.length; rowIndex++) {

      const row = body.rows[rowIndex];

      for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
        const configuration = configurationList[cellIndex];
        if (configuration === undefined) {
          continue;
        }

        this.putStorage(configuration.name, configuration.executor(row.cells[cellIndex]));
      }
    }

    console.log(Object.fromEntries(this.storage));
  }

  private putStorage(key: string, value: string) {
    const values = this.storage.get(key);
    if (values !== undefined) {
      values.push(value);
    } else {
      this.storage.set(key, []);
      this.putStorage(key, value);
    }
  }

}

export default Table;