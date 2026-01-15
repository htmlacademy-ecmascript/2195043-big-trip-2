import FilterView from '../view/filter-view';
import { render } from '../utils/render.js';
import { FilterType, getFilterAvailability } from '../utils/index.js';

export default class FilterPresenter {
  #filterComponent = null;
  #container = null;
  #pointsModel = null;
  #currentFilter = FilterType.EVERYTHING;

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#renderFilters();
    this.#setFilterChangeHandler();
  }

  #renderFilters() {
    if (this.#filterComponent) {
      this.#filterComponent.removeElement();
    }

    const points = this.#pointsModel.getPoints();
    const filterAvailability = getFilterAvailability(points);
    
    this.#filterComponent = new FilterView(filterAvailability, this.#currentFilter);
    render(this.#filterComponent, this.#container);
  }

  #setFilterChangeHandler() {
    const element = this.#filterComponent.element;
    if (!element) {
      return;
    }

    const radioButtons = element.querySelectorAll('input[type="radio"][name="trip-filter"]');
    radioButtons.forEach((radio) => {
      radio.removeEventListener('change', this.#filterChangeHandler);
      radio.addEventListener('change', this.#filterChangeHandler);
    });

    const form = element.querySelector('.trip-filters');
    if (form) {
      form.removeEventListener('change', this.#filterChangeHandler);
      form.addEventListener('change', this.#filterChangeHandler);
      form.removeEventListener('submit', this.#formSubmitHandler);
      form.addEventListener('submit', this.#formSubmitHandler);
    }
  }

  #filterChangeHandler = (evt) => {
    const target = evt.target;
    if (target && target.type === 'radio' && target.name === 'trip-filter' && !target.disabled) {
      const newFilter = target.value;
      if (newFilter !== this.#currentFilter) {
        this.#currentFilter = newFilter;
        if (this.onFilterChange) {
          this.onFilterChange(this.#currentFilter);
        }
      }
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
  };

  setFilter(filterType) {
    this.#currentFilter = filterType;
    this.#renderFilters();
    this.#setFilterChangeHandler();
  }
}
