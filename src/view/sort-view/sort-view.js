import AbstractView from '../../framework/view/abstract-view.js';
import { createSortTemplate } from './sort-template.js';

export default class SortView extends AbstractView {
  #onSortTypeChange = null;
  #currentSortType = 'day';
  #handlersSet = false;

  constructor(currentSortType = 'day', onSortTypeChange) {
    super();
    this.#currentSortType = currentSortType;
    this.#onSortTypeChange = onSortTypeChange;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  get element() {
    const element = super.element;
    if (!this.#handlersSet) {
      this.#setSortChangeHandler(element);
      this.#handlersSet = true;
    }
    return element;
  }

  #setSortChangeHandler(element) {
    const form = element.querySelector('.trip-sort');
    if (form) {
      form.addEventListener('change', this.#sortChangeHandler);
    }
    
    const labels = element.querySelectorAll('label.trip-sort__btn');
    labels.forEach((label) => {
      label.addEventListener('click', (evt) => {
        evt.preventDefault();
        const inputId = label.getAttribute('for');
        const input = element.querySelector(`#${inputId}`);
        if (input && !input.disabled) {
          input.checked = true;
          const sortType = input.dataset.sortType;
          if (sortType && sortType !== this.#currentSortType) {
            this.#currentSortType = sortType;
            this.#onSortTypeChange?.(sortType);
          }
        }
      });
    });
  }

  #sortChangeHandler = (evt) => {
    const target = evt.target;
    if (target && target.type === 'radio' && target.name === 'trip-sort' && !target.disabled) {
      const sortType = target.dataset.sortType;
      if (sortType && sortType !== this.#currentSortType) {
        this.#currentSortType = sortType;
        this.#onSortTypeChange?.(sortType);
      }
    }
  };
}
