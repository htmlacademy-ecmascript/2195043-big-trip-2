import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import FormEditView from '../view/form-edit-view';
import PointView from '../view/point-view';
import { render, RenderPosition } from '../utils/render.js';

export default class BoardPresenter {
  sortComponent = new SortView();
  listComponent = new ListView();

  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(this.sortComponent, this.container);
    render(this.listComponent, this.container);
    render(
      new FormEditView(),
      this.listComponent.getElement(),
      RenderPosition.AFTERBEGIN
    );

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.listComponent.getElement());
    }
  }
}
