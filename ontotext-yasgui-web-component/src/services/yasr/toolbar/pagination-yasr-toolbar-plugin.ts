import {YasrToolbarPlugin} from '../../../models/yasr-toolbar-plugin';

export class PaginationYasrToolbarPlugin implements YasrToolbarPlugin {

  private yasrIdToEventListenerMapper = new Map<string, any>();

  //@ts-ignore
  createElement(yasr: Yasr): HTMLElement {
    const element: Page = (document.createElement("ontotext-pagination") as unknown) as Page;
    const pageSelectedListener = this.pageSelectedHandler(yasr);
    this.yasrIdToEventListenerMapper.set(yasr.getTabId(), pageSelectedListener);
    element.addEventListener("pageSelected", pageSelectedListener);
    return element;
  }

  //@ts-ignore
  updateElement(element: HTMLElement, yasr: Yasr): void {
    const paginationElement: Page = element;
    paginationElement.pageNumber = yasr.yasqe?.getPageNumber();
    paginationElement.pageSize = yasr.yasqe?.getPageSize();
    paginationElement.pageElements = yasr.results?.getBindings()?.length || 0;
    paginationElement.totalElements = yasr.persistentJson?.yasr.response?.totalElements || -1;
    paginationElement.hasMorePages = yasr.results?.getHasMorePages();
    this.updateQueryResultPaginationVisibility(paginationElement, yasr);
  }

  getOrder(): number {
    return 100000;
  }

  //@ts-ignore
  destroy(element: HTMLElement, yasr: Yasr) {
    const eventHandler = this.yasrIdToEventListenerMapper.get(yasr.getTabId());
    if (eventHandler) {
      element.removeEventListener('pageSelected', eventHandler);
    }
  }

  //@ts-ignore
  private updateQueryResultPaginationVisibility(resultQueryPaginationElement: Page, yasr: Yasr) {

    resultQueryPaginationElement.classList.add('hidden');

    // Pagination is not visible
    // when executed query is for explain plan query,
    if (yasr.yasqe.getIsExplainPlanQuery()) {
      return;
    }
    // or pagination is on first page and page hasn't results,
    const hasNotResults = !yasr.results?.getBindings()?.length;
    if (hasNotResults && resultQueryPaginationElement.pageNumber === 1) {
      return;
    }
    // or has fewer results than one page.
    if (!this.hasMoreThanOnePageElements(resultQueryPaginationElement)) {
      return;
    }

    resultQueryPaginationElement.classList.remove('hidden');
  }

  private hasMoreThanOnePageElements(resultQueryPaginationElement: Page): boolean {
    if (resultQueryPaginationElement.pageNumber && resultQueryPaginationElement.pageNumber > 1) {
      return true;
    }
    if (resultQueryPaginationElement.hasMorePages !== undefined) {
      return resultQueryPaginationElement.hasMorePages;
    }

    if (resultQueryPaginationElement.pageSize && resultQueryPaginationElement.totalElements) {
      return resultQueryPaginationElement.pageSize < resultQueryPaginationElement.totalElements;
    }
    return false;
  }

  //@ts-ignore
  private pageSelectedHandler(yasr: Yasr) {
    return (pageEvent: any) => {
      const page: Page = pageEvent.detail;
      const yasqe = yasr.yasqe;
      if (yasqe) {
        yasqe.setPageNumber(page.pageNumber || 1);
        yasqe.setPageSize(page.pageSize || 10);
        yasqe
          .query()
          .then()
          .catch(() => {
            // catch this to avoid unhandled rejection
          });
      }
    };
  }
}


interface Page extends HTMLElement {
  pageSize?: number;
  pageNumber?: number;
  totalElements?: number;
  pageElements?: number;
  hasMorePages?: boolean;
}
