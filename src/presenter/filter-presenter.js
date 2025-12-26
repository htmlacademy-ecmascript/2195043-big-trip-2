import FilterView from '../view/filter-view';
import { render } from '../utils/render.js';

export default class FilterPresenter {
  filterComponent = new FilterView();

  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(this.filterComponent, this.container);
  }
}
