import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import ListView from '../view/list-view.js';
import FormEditView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';
import { render, RenderPosition } from '../render.js';

export default class BoardPresenter {
  sortComponent = new SortView();
  filterComponent = new FilterView();
  listComponent = new ListView();

  constructor({ container, filtersContainer }) {
    this.container = container;
    this.filtersContainer = filtersContainer;
  }

  init() {
    render(this.filterComponent, this.filtersContainer);
    render(this.sortComponent, this.container);
    render(this.listComponent, this.container);
    render(new FormEditView(), this.listComponent.getElement(), RenderPosition.AFTERBEGIN);

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.listComponent.getElement());
    }
  }
}
