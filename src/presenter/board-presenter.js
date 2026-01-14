import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import FormEditView from '../view/form-edit-view';
import PointView from '../view/point-view';
import { render, RenderPosition } from '../utils/render.js';
import PointsModel from '../model/points-model.js';

export default class BoardPresenter {
  sortComponent = new SortView();
  listComponent = new ListView();
  #model = new PointsModel();

  constructor({ container }) {
    this.container = container;
  }

  #renderBoard() {
    render(this.sortComponent, this.container);
    render(this.listComponent, this.container);

    const points = this.#model.getPoints();

    this.#renderFormEdit();
    this.#renderPoints(points);
  }

  #renderFormEdit() {
    render(
      new FormEditView({ type: 'flight' }, null, this.#model),
      this.listComponent.element,
      RenderPosition.AFTERBEGIN
    );
  }

  #renderPoints(points) {
    points.forEach((point) => {
      const destination = this.#model.getDestinationById(point.destination);
      const availableOffers = this.#model.getOffersByType(point.type);
      const selectedOffers = availableOffers.filter((offer) =>
        point.offers.includes(offer.id)
      );

      render(
        new PointView(point, destination, selectedOffers),
        this.listComponent.element
      );
    });
  }

  async init() {
    await this.#model.init();
    this.#renderBoard();
  }
}
