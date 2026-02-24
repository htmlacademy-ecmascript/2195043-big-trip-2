import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { createSortTemplate } from './sort-template.js';

export default class SortView extends AbstractStatefulView {
  #onSortTypeChange = null;
  #handlersRestored = false;

  constructor(currentSortType = 'day', onSortTypeChange) {
    super();
    this._setState({ currentSortType });
    this.#onSortTypeChange = onSortTypeChange;
  }

  get element() {
    const element = super.element;
    if (!this.#handlersRestored) {
      this.#handlersRestored = true;
      this._restoreHandlers();
    }
    return element;
  }

  get template() {
    return createSortTemplate(this._state.currentSortType);
  }

  _restoreHandlers() {
    const element = this.element;

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
          if (sortType && sortType !== this._state.currentSortType) {
            this.updateElement({ currentSortType: sortType });
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
      if (sortType && sortType !== this._state.currentSortType) {
        this.updateElement({ currentSortType: sortType });
        this.#onSortTypeChange?.(sortType);
      }
    }
  };
}
