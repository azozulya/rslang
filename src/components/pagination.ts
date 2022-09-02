import createElement from '../utils/createElement';
import ArrowBack from '../assets/img/arrow-back.svg';
import ArrowForward from '../assets/img/arrow-forward.svg';

class Pagination {
  private total: number;

  private perPage: number;

  private currentPage: number;

  private pages: HTMLInputElement[] = [];

  private pagesContainer: HTMLElement;

  private onClickHandler: (page: number) => Promise<void>;

  constructor(
    total: number,
    perPage: number,
    currentPage: number,
    onClickHandler: (page: number) => Promise<void>
  ) {
    this.total = total;
    this.perPage = perPage;
    this.currentPage = currentPage;
    this.onClickHandler = onClickHandler;
    this.pagesContainer = createElement({ tagname: 'div' });
  }

  private onPageClickHandler = () => {
    const page = this.pages.find((item) => item.checked);

    if (page && parseInt(page.value, 10) === this.currentPage) return;

    if (page) this.onClickHandler?.(parseInt(page.value, 10));
  };

  private drawPage(pageNum: number) {
    const pageLabel = <HTMLLabelElement>createElement({ tagname: 'label' });
    pageLabel.classList.add('pagination__label');
    pageLabel.innerText = pageNum.toString();

    if (pageNum === this.currentPage) {
      pageLabel.classList.add('pagination__label--current');
    }

    const pageBtn = <HTMLInputElement>createElement({ tagname: 'input' });
    pageBtn.classList.add('pagination__inp');
    pageBtn.type = 'radio';
    pageBtn.name = 'page';
    pageBtn.value = pageNum.toString();

    pageLabel.append(pageBtn);

    this.pagesContainer.append(pageLabel);
    this.pages.push(pageBtn);
  }

  private drawPages(pagesArray: (string | number)[]) {
    pagesArray.forEach((pageNum) => {
      if (Number.isInteger(pageNum)) {
        this.drawPage(parseInt(pageNum.toString(), 10));
      } else {
        this.pagesContainer.insertAdjacentHTML('beforeend', pageNum.toString());
      }
    });
  }

  private drawPrevBtn(currentPage: number) {
    return this.prevNextBtn(
      (currentPage - 1).toString(),
      `<svg class="pagination__icon">
        <use xlink:href="${ArrowBack}#arrow-back"></use>
      </svg>`,
      currentPage === 1
    );
  }

  private drawNextBtn(currentPage: number, totalPages: number) {
    return this.prevNextBtn(
      (currentPage + 1).toString(),
      `<svg class="pagination__icon">
        <use xlink:href="${ArrowForward}#arrow-forward"></use>
      </svg>`,
      currentPage === totalPages
    );
  }

  private prevNextBtn(btnValue: string, btnLabel: string, hideFlag: boolean) {
    const pageLabel = <HTMLLabelElement>createElement({ tagname: 'label' });
    pageLabel.classList.add('pagination__label');
    pageLabel.innerHTML = btnLabel;

    if (hideFlag) {
      pageLabel.classList.add('pagination__label--disabled');
    }

    const prevBtn = <HTMLInputElement>createElement({ tagname: 'input' });
    prevBtn.classList.add('pagination__inp');
    prevBtn.type = 'radio';
    prevBtn.name = 'page';
    prevBtn.value = btnValue;

    if (hideFlag) {
      prevBtn.disabled = true;
    }

    pageLabel.append(prevBtn);

    this.pagesContainer.append(pageLabel);
    this.pages.push(prevBtn);
  }

  // eslint-disable-next-line max-lines-per-function
  draw() {
    const totalPages = Math.ceil(this.total / this.perPage);

    this.pagesContainer.classList.add('pagination');
    this.pagesContainer.addEventListener('click', this.onPageClickHandler);

    if (totalPages <= 10) {
      new Array(totalPages).fill(0).forEach((_, idx) => this.drawPage(idx + 1));
    }

    if (totalPages > 10) {
      const middlePage = Math.ceil(totalPages / 2);

      this.drawPrevBtn(this.currentPage);

      if ([1, totalPages, middlePage].includes(this.currentPage)) {
        this.drawPages([
          1,
          '<span class="pagination__dots">...</span>',
          middlePage - 1,
          middlePage,
          middlePage + 1,
          '<span class="pagination__dots">...</span>',
          totalPages,
        ]);
      } else if (this.currentPage < 5) {
        new Array(this.currentPage + 1)
          .fill(0)
          .forEach((_, idx) => this.drawPage(idx + 1));
        this.pagesContainer.insertAdjacentHTML(
          'beforeend',
          '<span class="pagination__dots">...</span>'
        );
        this.drawPage(totalPages);
      } else if (this.currentPage > totalPages - 5) {
        this.drawPage(1);
        this.pagesContainer.insertAdjacentHTML(
          'beforeend',
          '<span class="pagination__dots">...</span>'
        );
        new Array(5)
          .fill(0)
          .reverse()
          .map((_, idx) => this.drawPage(totalPages - 4 + idx));
      } else {
        this.drawPages([
          1,
          '<span class="pagination__dots">...</span>',
          this.currentPage - 1,
          this.currentPage,
          this.currentPage + 1,
          '<span class="pagination__dots">...</span>',
          totalPages,
        ]);
      }

      this.drawNextBtn(this.currentPage, totalPages);
    }

    return this.pagesContainer;
  }
}

export default Pagination;
