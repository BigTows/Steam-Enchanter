export interface RowConfiguration {
  /**
   * Name of element
   */
  name: string,

  executor: (cel: HTMLElement) => any
}

abstract class Table {

  private readonly storage: Array<Map<string, string>> = [];

  protected constructor(table: HTMLTableElement, configurationList: Array<RowConfiguration | undefined>) {

    //TODO a little hack
    const body = table.tBodies[0];

    for (let rowIndex = 0; rowIndex < body.rows.length; rowIndex++) {

      const row = body.rows[rowIndex];

      for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
        const configuration = configurationList[cellIndex];
        if (configuration === undefined) {
          continue;
        }

        this.putStorage(rowIndex, configuration.name, configuration.executor(row.cells[cellIndex]));
      }
    }
  }

  private putStorage(rowIndex: number, key: string, value: string) {
    const values = this.storage[rowIndex];
    if (values !== undefined) {
      values.set(key, value);
    } else {
      this.storage[rowIndex] = new Map<string, string>();
      this.putStorage(rowIndex, key, value);
    }
  }


  protected getRows(): Array<Map<string, any>> {
    return this.storage;
  }

}

export default Table;