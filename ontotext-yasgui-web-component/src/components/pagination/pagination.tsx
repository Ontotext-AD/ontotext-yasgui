import {Component, Event, EventEmitter, Host, h, Prop} from '@stencil/core';
import {Page} from '../../models/page';

@Component({
  tag: 'ontotext-pagination',
  styleUrl: 'pagination.scss',
  shadow: false,
})
export class Pagination {
  private readonly NUMBER_SHOWN_PAGE_BEFORE_SELECTED = 2;
  private readonly NUMBER_SHOWN_PAGE_AFTER_SELECTED = 2;
  @Prop() pageNumber = 1;
  @Prop() pageSize = 10;
  @Prop() totalElements: number;
  @Prop() pageElements: number;
  @Prop() hasMorePages: boolean | undefined;

  @Event() pageSelected: EventEmitter<Page>;

  constructor() {
    this.selectPage(this.pageNumber);
  }

  private getShownPageNumbers(): number[] {
    const firstShownPage = this.fetchFirstShownPage();
    const lastShownPage = this.fetchLastShownPage();
    const pages = [];
    for (let index = firstShownPage; index <= lastShownPage; index++) {
      pages.push(index);
    }
    return pages;
  }

  private fetchLastShownPage(): number {
    let lastShownPage = this.pageNumber;
    for (let pageNumber = 0; pageNumber < this.NUMBER_SHOWN_PAGE_AFTER_SELECTED; pageNumber++) {
      if ((this.pageNumber + pageNumber) * this.pageSize < this.getTotalElements()) {
        lastShownPage += 1;
      }
    }
    return lastShownPage;
  }

  private getTotalElements(): number {
    return this.totalElements;
  }

  private fetchFirstShownPage(): number {
    const firstShownPage = this.pageNumber - this.NUMBER_SHOWN_PAGE_BEFORE_SELECTED;
    return firstShownPage < 1 ? 1 : firstShownPage;
  }

  private previousButtonDisabled(): boolean {
    return this.pageNumber < 2;
  }

  private nextButtonDisabled(): boolean {
    if (this.totalElements) {
      return this.pageNumber * this.pageSize >= this.totalElements;
    }
    return this.hasMorePages;
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
