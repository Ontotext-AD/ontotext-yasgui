import {Component, Event, EventEmitter, Host, h, Prop} from '@stencil/core';
import {Page} from '../../models/page';

@Component({
  tag: 'ontotext-pagination',
  styleUrl: 'pagination.scss',
  shadow: false,
})
export class Pagination {
  private readonly VISIBLE_PAGES_COUNT = 5;
  private readonly PAGES_COUNT_AROUND_CURRENT = 2;
  @Prop() pageNumber = 1;
  @Prop() pageSize = 10;
  @Prop() totalElements = 0;
  @Prop() pageElements: number;
  @Prop() hasMorePages: boolean | undefined;

  @Event() pageSelected: EventEmitter<Page>;

  constructor() {
    this.selectPage(this.pageNumber);
  }

  private getShownPageNumbers(): number[] {
    const lastShownPage = this.fetchLastShownPage();
    const firstShownPage = this.fetchFirstShownPage(lastShownPage);

    const pages = [];
    for (let index = firstShownPage; index <= lastShownPage; index++) {
      pages.push(index);
    }
    return pages;
  }

  private fetchLastShownPage(): number {
    const currentPageNumber = this.pageNumber;
    let lastShownPage = currentPageNumber;
    const pagesAfterCurrent = currentPageNumber <= 3 ? this.VISIBLE_PAGES_COUNT - currentPageNumber : this.PAGES_COUNT_AROUND_CURRENT;
    for (let pageNumber = 0; pageNumber < pagesAfterCurrent; pageNumber++) {
      if ((currentPageNumber + pageNumber) * this.pageSize < this.totalElements) {
        lastShownPage += 1;
      }
    }
    return lastShownPage;
  }

  private fetchFirstShownPage(lastShownPage: number): number {
    const firstPage = lastShownPage - this.VISIBLE_PAGES_COUNT + 1;
    return firstPage < 1 ? 1 : firstPage;
  }

  private previousButtonDisabled(): boolean {
    return this.pageNumber < this.PAGES_COUNT_AROUND_CURRENT;
  }

  private nextButtonDisabled(): boolean {
    if (this.totalElements && this.totalElements >= 0) {
      return this.pageNumber * this.pageSize >= this.totalElements;
    }
    return !this.hasMorePages;
  }

  private nextPage(): void {
    this.pageSelected.emit(new Page(this.pageSize, this.pageNumber + 1));
  }

  private previousPage(): void {
    this.pageSelected.emit(new Page(this.pageSize, this.pageNumber - 1));
  }

  private selectPage(pageNumber) {
    if (this.pageNumber !== pageNumber) {
      this.pageSelected.emit(new Page(this.pageSize, pageNumber));
    }
  }

  render() {
    return (
      <Host class="ontotext-pagination">
        <div class="page-selectors">
          <button class="page-selector previous-button"
                  onClick={() => this.previousPage()}
                  disabled={this.previousButtonDisabled()}>&lsaquo;</button>
          {
            this.getShownPageNumbers().map(pageNumber => {
              return <button class={`page-button page-selector ${this.pageNumber === pageNumber ? 'selected-page' : ''}`}
                             onClick={() => this.selectPage(pageNumber)}
                             disabled={this.pageNumber === pageNumber}>{pageNumber}</button>
            })}
          <button class="page-selector next-button"
                  onClick={() => this.nextPage()}
                  disabled={this.nextButtonDisabled()}>&rsaquo;</button>
        </div>
      </Host>
    )
  }
}
