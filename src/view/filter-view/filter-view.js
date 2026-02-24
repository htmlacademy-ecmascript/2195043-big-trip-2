import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { createFilterTemplate } from './filter-template.js';
import { FilterType } from '../../utils';

export default class FilterView extends AbstractStatefulView {
  #onFilterChange = null;
  #handlersRestored = false;

  constructor(filterAvailability = {}, currentFilter = FilterType.EVERYTHING, onFilterChange) {
    super();
    this._setState({ filterAvailability, currentFilter });
    this.#onFilterChange = onFilterChange;
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
    return createFilterTemplate(this._state.filterAvailability, this._state.currentFilter);
  }

  _restoreHandlers() {
    const element = this.element;

    element.addEventListener('change', this.#filterChangeHandler);
    element.addEventListener('submit', this.#formSubmitHandler);
  }

  #filterChangeHandler = (evt) => {
    const target = evt.target;
    if (target && target.type === 'radio' && target.name === 'trip-filter' && !target.disabled) {
      const newFilter = target.value;
      if (newFilter !== this._state.currentFilter) {
        this.updateElement({ currentFilter: newFilter });
        this.#onFilterChange?.(newFilter);
      }
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
  };
}
