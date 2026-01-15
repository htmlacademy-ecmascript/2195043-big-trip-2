import AbstractView from '../../framework/view/abstract-view.js';
import { createFilterTemplate } from './filter-template.js';
import { FilterType } from '../../utils/index.js';

export default class FilterView extends AbstractView {
  constructor(filterAvailability = {}, currentFilter = FilterType.EVERYTHING) {
    super();
    this.filterAvailability = filterAvailability;
    this.currentFilter = currentFilter;
  }

  get template() {
    return createFilterTemplate(this.filterAvailability, this.currentFilter);
  }
}

