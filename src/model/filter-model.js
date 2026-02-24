import { FilterType } from '../utils';

export default class FilterModel {
  #filter = FilterType.EVERYTHING;

  getFilter() {
    return this.#filter;
  }

  setFilter(filter) {
    this.#filter = filter;
  }
}
