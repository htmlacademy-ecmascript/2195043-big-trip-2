import FilterView from '../view/filter-view';
import { render } from '../utils/render.js';
import { getFilterAvailability } from '../utils';

export default class FilterPresenter {
  #filterComponent = null;
  #container = null;
  #pointsModel = null;
  #filterModel = null;

  constructor({ container, pointsModel, filterModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
  }

  init() {
    this.#renderFilters();
  }

  #renderFilters() {
    const points = this.#pointsModel.getPoints();
    const filterAvailability = getFilterAvailability(points);
    const currentFilter = this.#filterModel.getFilter();

    if (this.#filterComponent) {
      this.#filterComponent.updateElement({ filterAvailability, currentFilter });
    } else {
      this.#filterComponent = new FilterView(
        filterAvailability,
        currentFilter,
        (newFilter) => {
          this.#filterModel.setFilter(newFilter);
          this.onFilterChange?.();
        }
      );
      render(this.#filterComponent, this.#container);
    }
  }

  setFilter(filterType) {
    if (filterType !== undefined) {
      this.#filterModel.setFilter(filterType);
    }
    this.#renderFilters();
  }
}
