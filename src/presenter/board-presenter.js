import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import FormEditView from '../view/form-edit-view';
import PointView from '../view/point-view';
import { render, RenderPosition } from '../utils/render.js';

export default class BoardPresenter {
  sortComponent = new SortView();
  listComponent = new ListView();
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointComponents = new Map();
  #currentEditingPointId = null;

  constructor({ container, pointsModel, destinationsModel, offersModel }) {
    this.container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  #renderBoard() {
    render(this.sortComponent, this.container);
    render(this.listComponent, this.container);

    const points = this.#pointsModel.getPoints();

    this.#renderPoints(points);
  }

  #renderPoints(points) {
    points.forEach((point) => {
      const destination = this.#destinationsModel.getDestinationById(point.destination);
      const availableOffers = this.#offersModel.getOffersByType(point.type);
      const selectedOffers = availableOffers.filter((offer) =>
        point.offers.includes(offer.id)
      );

      const pointComponent = new PointView(
        point,
        destination,
        selectedOffers,
        () => this.#replacePointToForm(point)
      );

      this.#pointComponents.set(point.id, { pointComponent, formComponent: null });

      render(
        pointComponent,
        this.listComponent.element
      );
    });
  }

  #replacePointToForm(point) {
    const destination = this.#destinationsModel.getDestinationById(point.destination);
    const availableOffers = this.#offersModel.getOffersByType(point.type);
    const selectedOffers = availableOffers.filter((offer) =>
      point.offers.includes(offer.id)
    );

    const formComponent = new FormEditView(
      point,
      destination,
      {
        getOffersByType: (type) => this.#offersModel.getOffersByType(type),
        getDestinations: () => this.#destinationsModel.getDestinations()
      },
      () => this.#replaceFormToPoint(point.id),
      () => this.#replaceFormToPoint(point.id)
    );

    const components = this.#pointComponents.get(point.id);
    const pointElement = components.pointComponent.element;
    const formElement = formComponent.element;

    pointElement.replaceWith(formElement);

    components.formComponent = formComponent;
    this.#currentEditingPointId = point.id;

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint(pointId) {
    const components = this.#pointComponents.get(pointId);
    if (!components || !components.formComponent) {
      return;
    }

    const formElement = components.formComponent.element;
    const pointElement = components.pointComponent.element;

    formElement.replaceWith(pointElement);

    components.formComponent.removeElement();
    components.formComponent = null;
    this.#currentEditingPointId = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      if (this.#currentEditingPointId) {
        this.#replaceFormToPoint(this.#currentEditingPointId);
      }
    }
  };

  init() {
    this.#renderBoard();
  }
}
