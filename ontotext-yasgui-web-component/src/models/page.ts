export class Page {

  constructor(private _pageSize: number, private _pageNumber: number) {}

  get pageSize(): number {
    return this._pageSize;
  }

  get pageNumber(): number {
    return this._pageNumber;
  }
}
